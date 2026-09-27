import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPlan, PlanKey } from '@/lib/plans';

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
    throw new Error(`Failed to fetch PayPal access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { orderID, plan } = await req.json();
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planKey = plan as PlanKey;
    const planDef = getPlan(planKey);

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.status === 'COMPLETED') {
      const amountPaid = parseFloat(data.purchase_units[0].payments.captures[0].amount.value);
      const expectedPrice = planDef.priceMonthly;

      if (isNaN(amountPaid) || amountPaid < expectedPrice) {
        return NextResponse.json({ error: 'Insufficient payment amount' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: planKey,
        },
      });
      return NextResponse.json({ status: 'success' });
    }

    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (error) {
    console.error('PayPal Capture Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
