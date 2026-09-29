import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function verifyPayPalWebhookSignature(req: NextRequest, body: any) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID is not configured');
  }

  const accessToken = await getPayPalAccessToken();
  const verifyResponse = await fetch('https://api-m.sandbox.paypal.com/v1/logginglog/webhooks/verify-webhook-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      transmission_id: req.headers.get('paypal-transmission-id'),
      transmission_time: req.headers.get('paypal-transmission-time'),
      cert_url: req.headers.get('paypal-cert-url'),
      auth_algo: req.headers.get('auth-algo'),
      webhook_id: webhookId,
      webhook_event: body,
    }),
  });

  if (!verifyResponse.ok) return false;
  const data = await verifyResponse.json();
  return data.verification_status === 'SUCCESS';
}

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

  if (!response.ok) throw new Error('Failed to fetch PayPal access token');
  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const isValid = await verifyPayPalWebhookSignature(req, body);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource;
      const customId = resource.custom_id; 
      
      // For simplicity, we assume the custom_id format is "userId:PLAN" or just userId
      // Let's handle both: "userId:PRO" or "userId" (defaulting to ESSENTIEL)
      const [userId, plan] = customId ? customId.split(':') : [];

      if (!userId) {
        console.error('PayPal Webhook: Missing userId in custom_id');
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const finalPlan = (plan as 'FREE' | 'ESSENTIEL' | 'PRO' | 'ULTIMATE') || 'ESSENTIEL';

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: finalPlan,
        },
      });

      console.log(`PayPal Webhook: Updated plan to ${finalPlan} for user ${userId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('PayPal Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
