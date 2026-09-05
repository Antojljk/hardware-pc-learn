import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = session.client_reference_id;
      const plan = session.metadata?.plan;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: plan as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          stripeCustomerId,
          stripeSubscriptionId,
        },
      });

      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeSubscriptionId = subscription.id;
      
      const user = await prisma.user.findUnique({
        where: { stripeSubscriptionId },
      });

      if (user) {
        const newPlan = event.type === 'customer.subscription.deleted' 
          ? 'FREE' 
          : (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ESSENTIEL ? 'ESSENTIEL' : 
             subscription.items.data[0].price.id === process.env.STRIPE_PRICE_PRO ? 'PRO' : 
             subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ULTIMATE ? 'ULTIMATE' : 'FREE');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: newPlan as any }, // eslint-disable-line @typescript-eslint/no-explicit-any
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
