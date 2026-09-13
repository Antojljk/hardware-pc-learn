import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { canAccess } from '@/lib/plans';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  if (!canAccess(user.plan, 'mode_technicien', user.id)) {
    return NextResponse.json({ error: 'Accès réservé au mode technicien' }, { status: 403 });
  }

  try {
    const { messages, scenario } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: `Tu joues le rôle d'un client non-technique qui a un problème avec son PC. 
Le scénario est : ${JSON.stringify(scenario)}. 
Tu décris tes symptômes en langage simple, tu réponds aux questions du technicien de façon réaliste. 
Tu ne donnes pas la solution directement. 
Quand le technicien a correctement identifié le problème et proposé la bonne solution, tu confirmes que ça a résolu le problème.`,
      messages: messages,
    });

    return NextResponse.json({ text: response.content[0].type === 'text' ? response.content[0].text : '' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
