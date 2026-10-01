import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  try {
    const stripe = getStripe();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1ULg9URkSVAzmjB1ybFLE0Tp',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hardware-pc-learn.vercel.app'}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hardware-pc-learn.vercel.app'}/offres`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Stripe Lifetime Session Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
