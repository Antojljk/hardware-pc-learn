'use client';

import { ArrowRight } from 'lucide-react';
import PayPalPayment from './PayPalPayment';

export default function SubscriptionButton({ plan }: { plan: { name: string; href: string; cta: string; price: string } }) {
  const handleSubscription = async () => {
    if (plan.name === 'FREE') {
      window.location.href = plan.href;
      return;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {plan.name === 'FREE' ? (
        <button onClick={handleSubscription} className="btn-primary w-full">
          {plan.cta}
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <PayPalPayment plan={plan} />
      )}
    </div>
  );
}
