'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PayPalPayment({ plan }: { plan: { name: string; price: string } }) {
  const handlePayment = async () => {
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.name }),
      });
      
      const data = await res.json();
      
      if (data.links) {
        const approveLink = data.links.find((link: any) => link.rel === 'approve');
        if (approveLink) {
          window.location.href = approveLink.href;
        } else {
          alert('Lien d\'approbation PayPal introuvable');
        }
      } else {
        alert('Erreur lors de la création de la commande PayPal');
      }
    } catch (error) {
      console.error('PayPal Error:', error);
      alert('Une erreur est survenue lors du paiement');
    }
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={handlePayment}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        Payer avec PayPal <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
