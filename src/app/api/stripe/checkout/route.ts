import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const { plan } = await req.json();
    
    const normalizedPlan = String(plan).trim().toUpperCase();

    try {
      const stripe = getStripe();
      const priceIdToTest = 'price_1UCRfrRkSVAzmjB1yVqRRgf9';

      const secretKey = process.env.STRIPE_SECRET_KEY || '';
      const mode = secretKey.startsWith('sk_test') ? 'test' : secretKey.startsWith('sk_live') ? 'live' : 'unknown';
      console.log(`[STRIPE-DIAG] mode: ${mode}`);

      try {
        await stripe.balance.retrieve();
        console.log(`[STRIPE-DIAG] account: identity_verified`);
      } catch {
        console.log(`[STRIPE-DIAG] account: verification_failed`);
      }

      try {
        const price = await stripe.prices.retrieve(priceIdToTest);
        console.log(`[STRIPE-DIAG] price_found: true`);
        console.log(`[STRIPE-DIAG] price_active: ${price.active}`);
        console.log(`[STRIPE-DIAG] price_currency: ${price.currency}`);
        console.log(`[STRIPE-DIAG] price_type: ${price.type}`);
      } catch (err: unknown) {
        const stripeError = err as { code?: string; message: string };
        console.log(`[STRIPE-DIAG] price_found: false`);
        if (stripeError.code) console.log(`[STRIPE-DIAG] price_error_code: ${stripeError.code}`);
        console.log(`[STRIPE-DIAG] price_error_message: ${stripeError.message}`);
      }
    } catch (e) {
      console.log('[STRIPE-DIAG] Fatal diagnostic error:', (e as Error).message);
    }

    
    const priceIds: Record<string, string> = {
      ESSENTIEL: process.env.STRIPE_PRICE_ESSENTIEL!,
      PRO: process.env.STRIPE_PRICE_PRO!,
      ULTIMATE: process.env.STRIPE_PRICE_ULTIMATE!,
    };

    const priceId = priceIds[normalizedPlan];
    if (!priceId) return NextResponse.json({ error: 'Plan invalide ou non disponible' }, { status: 400 });

      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/parametres?session_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tarifs`,
      client_reference_id: user.id,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Session Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la session' }, { status: 500 });
  }
}
