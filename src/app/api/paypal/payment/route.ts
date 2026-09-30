import { NextResponse } from "next/server";
import { getAccessToken, isPaidPlan, paypalBase, PLANS } from "@/lib/paypal";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!isPaidPlan(plan)) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    const amount = PLANS[plan]?.price || '0.00';
    const accessToken = await getAccessToken();

    const orderBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: `${userId}:${plan}`,
          description: PLANS[plan]?.label || 'Plan Hardware PC',
          amount: { 
            currency_code: "EUR", 
            value: amount 
          },
        },
      ],
      application_context: {
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: `${origin}/offres/succes`,
        cancel_url: `${origin}/offres?paiement=annule`,
      },
    };

    console.log("[paypal/payment] Sending body to PayPal:", JSON.stringify(orderBody));

    const res = await fetch(`${paypalBase}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": crypto.randomUUID(),
      },
      body: JSON.stringify(orderBody),
    });

    const order = await res.json();
    if (!res.ok) {
      console.error("PayPal create order error:", JSON.stringify(order));
      return NextResponse.json(
        { error: "Erreur lors de la création de la commande" },
        { status: 502 }
      );
    }

    const approve = order.links?.find(
      (l: { rel: string }) => l.rel === "payer-action" || l.rel === "approve"
    );
    if (!approve) {
      return NextResponse.json({ error: "Lien d'approbation absent" }, { status: 502 });
    }

    return NextResponse.json({ url: approve.href, orderId: order.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
