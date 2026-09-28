'use client';
import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function PayPalPayment({ plan }: { plan: { name: string; price: string } }) {
  const createOrder = async () => {
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.name }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.id) {
        throw new Error('Order ID not found in response');
      }
      return data.id;
    } catch (error) {
      console.error('PayPal Create Order Error:', error);
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID, plan: plan.name }),
      });
      const result = await res.json();
      if (result.status === 'success') {
        alert('Paiement réussi !');
      } else {
        alert('Erreur lors de la capture du paiement');
      }
    } catch (error) {
      console.error('PayPal Approve Error:', error);
      alert('Une erreur est survenue lors de la confirmation du paiement');
    }
  };

  return (
    <div className="w-full">
      <PayPalScriptProvider options={{ 
        clientId: "BAAVHhDX4rhe0eK1hrvT9gXtzVz7AO2FrFDfqti2-e3lFIYBOyrEHTwAvfqGC_iNl4aHvZP8ARTgt5_MX4", 
        currency: "EUR" 
      }}>
        <PayPalButtons 
          createOrder={createOrder} 
          onApprove={onApprove}
          style={{ layout: 'vertical', shape: 'rect' }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
