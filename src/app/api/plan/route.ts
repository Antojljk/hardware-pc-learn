import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.redirect('/api/stripe/checkout', 307);
}
