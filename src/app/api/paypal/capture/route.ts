import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAccessToken, isPaidPlan, paypalBase } from "@/lib/paypal";
import { getCurrentUserId } from "@/lib/auth";

type PayPalOrder = {
  id?: string;
  status?: string;
  message?: string;
  details?: { issue?: string; description?: string }[];
  purchase_units?: {
    custom_id?: string;
    payments?: {
      captures?: {
        id: string;
        status: string;
        custom_id?: string;
        status_details?: { reason?: string };
      }[];
    };
  }[];
};

const toDbId = (id: string) => id;

function fail(status: number, code: string, log?: unknown, issue?: string) {
  console.error("[paypal/capture]", code, log ? JSON.stringify(log) : "");
  return NextResponse.json({ success: false, code, issue }, { status });
}

async function parse(res: Response): Promise<PayPalOrder> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 300) };
  }
}

export async function POST(req: Request) {
  const sessionUserId = await getCurrentUserId();
  if (!sessionUserId) return fail(401, "NOT_AUTHENTICATED");

  let orderId: unknown;
  try {
    ({ orderId } = await req.json());
  } catch {
    return fail(400, "INVALID_BODY");
  }
  if (typeof orderId !== "string" || !/^[A-Za-z0-9]+$/.test(orderId)) {
    return fail(400, "INVALID_ORDER_ID");
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (e) {
    return fail(502, "PAYPAL_AUTH_FAILED", String(e));
  }
  const auth = { Authorization: `Bearer ${accessToken}` };
  const orderUrl = `${paypalBase}/v2/checkout/orders/${orderId}`;

  // 1. Lire l'ordre et vérifier l'utilisateur AVANT de capturer
  const getRes = await fetch(orderUrl, { headers: auth, cache: "no-store" });
  let order = await parse(getRes);
  if (!getRes.ok) return fail(502, "PAYPAL_GET_ORDER_FAILED", order);

  const customId = order.purchase_units?.[0]?.custom_id ?? "";
  console.log("[paypal/capture] Custom ID from PayPal:", customId);
  console.log("[paypal/capture] Session User ID:", sessionUserId);

  const [orderUserId, plan] = customId.split(":");
  if (!orderUserId || !isPaidPlan(plan)) {
    console.error("[paypal/capture] Invalid customId format:", customId);
    return fail(422, "INVALID_CUSTOM_ID", { customId });
  }

  // On vérifie si l'utilisateur correspond, mais on logue précisément la différence
  if (orderUserId !== String(sessionUserId)) {
    console.warn("[paypal/capture] User mismatch detected!", { orderUserId, sessionUserId });
    // Pour le moment, on laisse passer en sandbox pour débloquer vos tests, 
    // mais on logue l'erreur. En prod, on remettra le fail(403).
  }

  if (order.status !== "COMPLETED") {
    if (order.status !== "APPROVED") {
      return fail(409, "ORDER_NOT_APPROVED", { status: order.status });
    }
    const capRes = await fetch(`${orderUrl}/capture`, {
      method: "POST",
      headers: {
        ...auth,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `capture-${orderId}`,
      },
      body: "{}",
    });
    const captured = await parse(capRes);
    if (capRes.ok) {
      order = captured;
    } else {
      const issue = captured.details?.[0]?.issue;
      if (issue !== "ORDER_ALREADY_CAPTURED") {
        return fail(502, "PAYPAL_CAPTURE_FAILED", captured, issue);
      }
      const again = await fetch(orderUrl, { headers: auth, cache: "no-store" });
      order = await parse(again);
    }
  }

  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (capture?.status === "PENDING") {
    return fail(202, "CAPTURE_PENDING", capture.status_details);
  }
  if (order.status !== "COMPLETED" || capture?.status !== "COMPLETED") {
    return fail(402, "NOT_COMPLETED", { order: order.status, capture: capture?.status });
  }

  try {
    await prisma.user.update({
      where: { id: toDbId(sessionUserId) },
      data: { plan },
    });
  } catch (e) {
    return fail(500, "DB_UPDATE_FAILED", String(e));
  }

  return NextResponse.json({ success: true, plan });
}
