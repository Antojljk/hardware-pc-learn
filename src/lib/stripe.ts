import Stripe from 'stripe';

let stripePromise: Stripe | null = null;

export function getStripe() {
  if (!stripePromise) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripePromise = new Stripe(secretKey, {
      apiVersion: '2026-08-26.dahlia', // Or latest available
      typescript: true,
    });
  }
  return stripePromise;
}
