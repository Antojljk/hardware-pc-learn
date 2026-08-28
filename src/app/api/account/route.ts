import { NextResponse } from 'next/server';
import {
  updateProfile,
  updatePassword,
  deleteAccount,
} from '@/lib/account';

/**
 * API de gestion du compte utilisateur.
 * POST /api/account  { action: 'update_profile' | 'update_password' | 'delete', ...payload }
 *
 * Toutes les actions requièrent un utilisateur authentifié et ne peuvent
 * porter que sur le compte courant (vérifié côté lib/account).
 */
export async function POST(req: Request) {
  let body: { action?: string } & Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const action = body.action;
  if (!action) return NextResponse.json({ error: 'Action manquante' }, { status: 400 });

  try {
    if (action === 'update_profile') {
      const result = await updateProfile(body as never);
      if (!result.ok) return NextResponse.json({ error: result.error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    if (action === 'update_password') {
      const result = await updatePassword(body as never);
      if (!result.ok) return NextResponse.json({ error: result.error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    if (action === 'delete') {
      const password = typeof body.password === 'string' ? body.password : '';
      const result = await deleteAccount(password);
      if (!result.ok) return NextResponse.json({ error: result.error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
