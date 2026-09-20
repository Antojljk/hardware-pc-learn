import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { orderID, plan } = await req.json();
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/payments/capture?PayerID=${orderID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
      },
    });

    const data = await response.json();

    if (data.status === 'COMPLETED') {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: plan,
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
