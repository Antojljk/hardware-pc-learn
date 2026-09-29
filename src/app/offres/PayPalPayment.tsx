'use client';
import React, { useState } from 'react';

export default function PayPalPayment({ plan }: { plan: { name: string; price: string } }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    console.log('PayPal: Début du processus de paiement pour le plan:', plan.name);
    setIsLoading(true);
    try {
      const res = await fetch('/api/paypal/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.name }),
      });
      
      console.log('PayPal: Réponse reçue de l\'API, status:', res.status);

      if (!res.ok) throw new Error('Erreur lors de la création de la commande');
      
      const data = await res.json();
      console.log('PayPal: Données reçues:', data);

      if (data.url) {
        console.log('PayPal: Redirection vers:', data.url);
        window.location.href = data.url;
      } else if (data.id) {
        console.log('PayPal: Redirection via ID:', data.id);
        window.location.href = `/api/paypal/redirect?orderId=${data.id}`;
      } else {
        throw new Error('Lien de paiement non trouvé');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la redirection vers PayPal';
      console.error('PayPal Error:', error);
      alert(`Erreur : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={isLoading}
      className={`w-full py-2 px-4 bg-[#FFC439] hover:bg-[#f2ba33] text-[#003087] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Payment via PayPal"
    >
      {isLoading ? (
        <span className="animate-spin">🌀</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      )}
      {isLoading ? 'Traitement...' : 'Payer avec PayPal'}
    </button>
  );
}
