import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const Schema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(3).max(500),
});

export async function GET() {
  const list = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: { select: { username: true } } },
  });
  return NextResponse.json(
    list.map(r => ({
      id: r.id,
      rating: r.rating,
      message: r.message,
      createdAt: r.createdAt,
      username: r.user.username,
    }))
  );
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  try {
    const data = Schema.parse(await req.json());
    const review = await prisma.review.create({
      data: { userId: user.id, rating: data.rating, message: data.message },
    });
    return NextResponse.json({ ok: true, id: review.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
