import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAccessToken, isPaidPlan, paypalBase } from "@/lib/paypal";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const sessionUserId = await getCurrentUserId();
    if (!sessionUserId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (typeof orderId !== "string" || !orderId) {
      return NextResponse.json({ error: "orderId manquant" }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    const res = await fetch(`${paypalBase}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `capture-${orderId}`,
      },
    });

    const data = await res.json();

    const alreadyCaptured = data?.details?.some(
      (d: { issue?: string }) => d.issue === "ORDER_ALREADY_CAPTURED"
    );
    if (!res.ok && !alreadyCaptured) {
      console.error("PayPal capture error:", JSON.stringify(data));
      return NextResponse.json({ error: "Capture impossible" }, { status: 502 });
    }

    const order = alreadyCaptured
      ? await (
          await fetch(`${paypalBase}/v2/checkout/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        ).json()
      : data;

    const unit = order.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const customId: string | undefined = capture?.custom_id ?? unit?.custom_id;

    if (order.status !== "COMPLETED" || capture?.status !== "COMPLETED" || !customId) {
      return NextResponse.json({ error: "Paiement non finalisé" }, { status: 402 });
    }

    const [userId, plan] = customId.split(":");
    if (userId !== sessionUserId || !isPaidPlan(plan)) {
      return NextResponse.json({ error: "Commande non valide" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    return NextResponse.json({ success: true, plan });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
