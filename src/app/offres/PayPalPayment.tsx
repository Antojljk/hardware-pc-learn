'use client';
import React, { useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { ArrowRight } from 'lucide-react';

export default function PayPalPayment({ plan }: { plan: { name: string; price: string } }) {
  const paypalButtonsRef = useRef<HTMLDivElement>(null);

  const createOrder = async () => {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.name }),
    });
    const data = await res.json();
    return data.id;
  };

  const onApprove = async (data: { orderID: string }) => {
    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID, plan: plan.name }),
    });
    if (res.ok) {
      alert('Paiement réussi !');
    } else {
      alert('Erreur lors de la capture du paiement');
    }
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={() => paypalButtonsRef.current?.click()}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        Payer avec PayPal <ArrowRight className="w-4 h-4" />
      </button>
      
      <div 
        ref={paypalButtonsRef} 
        className="absolute opacity-0 pointer-events-none pointer-events-none"
        style={{ width: '1px', height: '1px', overflow: 'hidden' }}
      >
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
          <PayPalButtons 
            style={{ color: 'gold', shape: 'pill', layout: 'vertical' }} 
            createOrder={createOrder} 
            onApprove={onApprove} 
            fundingSource="paypal"
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
