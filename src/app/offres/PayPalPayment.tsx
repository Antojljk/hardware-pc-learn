'use client';
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPalPayment({ plan }: { plan: { name: string; price: string } }) {
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
    <div>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        <PayPalButtons 
          style={{ color: 'gold', shape: 'pill', layout: 'vertical' }} 
          createOrder={createOrder} 
          onApprove={onApprove} 
          fundingSource="paypal"
        />
      </PayPalScriptProvider>
    </div>
  );
}
