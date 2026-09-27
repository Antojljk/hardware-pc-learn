import { NextRequest, NextResponse } from 'next/server';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('PayPal Token Error Response:', errorData);
    throw new Error(`Failed to fetch PayPal access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    const prices: Record<string, string> = {
      'ESSENTIEL': '7.99',
      'PRO': '14.99',
      'ULTIMATE': '24.99',
    };

    const amount = prices[plan] || '0.00';
    const accessToken = await getPayPalAccessToken();

    const response = await fetch('https://api-m.sandbox.paypal.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('PayPal Order Error Response:', errorData);
      return NextResponse.json({ error: 'PayPal API Error', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('PayPal Create Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
