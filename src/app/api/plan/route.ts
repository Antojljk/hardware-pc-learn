import { NextResponse } from 'next/server';
import { updatePlan } from '@/lib/account';

/**
 * Met à jour l'offre associée au compte.
 * POST /api/plan  { plan: 'FREE' | 'ESSENTIEL' | 'PRO' | 'ULTIMATE' }
 *
 * À l'étape 6 : aucune passerelle de paiement n'est appelée — l'offre est
 * simplement enregistrée. L'étape 8 ajoutera la création d'une session
 * Stripe (ou équivalent) et le branchement du webhook.
 */
export async function POST(req: Request) {
  let body: { plan?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const result = await updatePlan({ plan: body.plan as 'FREE' | 'ESSENTIEL' | 'PRO' | 'ULTIMATE' });
  if (!result.ok) return NextResponse.json({ error: result.error.message }, { status: 400 });
  return NextResponse.json({ ok: true, plan: result.plan });
}
