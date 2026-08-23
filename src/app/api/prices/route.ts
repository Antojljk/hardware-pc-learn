import { NextResponse, type NextRequest } from 'next/server';
import { searchPrice } from '@/lib/prices';

// Cache 6h côté route handler
export const revalidate = 21600;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim();
  if (!q || q.length > 200) {
    return NextResponse.json({ ok: false, error: 'invalid_query' }, { status: 400 });
  }
  try {
    const result = await searchPrice(q);
    if (!result) {
      return NextResponse.json(
        { ok: false, error: 'unavailable' },
        { status: 200, headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800' } }
      );
    }
    return NextResponse.json(
      { ok: true, ...result },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=43200' } }
    );
  } catch (e) {
    console.error('[api/prices] error', e);
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 200 });
  }
}
