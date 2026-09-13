'use client';

import { ArrowRight } from 'lucide-react';

export default function SubscriptionButton({ plan }: { plan: { name: string; href: string; cta: string } }) {
  const handleSubscription = async () => {
    if (plan.name === 'FREE') {
      window.location.href = plan.href;
      return;
    }

    try {
       const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.name }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la souscription');
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue');
    }
  };

  return (
    <button onClick={handleSubscription} className="btn-primary w-full">
      {plan.cta}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
