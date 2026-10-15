import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { url, visitorId, userId, email } = await req.json();
    
    await prisma.pageView.create({
      data: {
        url,
        visitorId,
        userId,
        email,
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error('Tracking failed:', e);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
