import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    // Simulation du montant selon le plan
    const prices: Record<string, string> = {
      'ESSENTIEL': '7.99',
      'PRO': '14.99',
      'ULTIMATE': '24.99',
    };

    const amount = prices[plan] || '0.00';

    const response = await fetch('https://api-m.sandbox.paypal.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: amount,
            },
          },
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('PayPal Create Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
