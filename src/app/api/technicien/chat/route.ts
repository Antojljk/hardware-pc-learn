import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { canAccess } from '@/lib/plans';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  if (!canAccess(user.plan, 'mode_technicien', user.id)) {
    return NextResponse.json({ error: 'Accès réservé au mode technicien' }, { status: 403 });
  }

  try {
    const { messages, scenario } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `Tu joues le rôle d'un client non-technique qui a un problème avec son PC. 
Le scénario est : ${JSON.stringify(scenario)}. 
Tu décris tes symptômes en langage simple, tu réponds aux questions du technicien de façon réaliste. 
Tu ne donnes pas la solution directement. 
Quand le technicien a correctement identifié le problème et proposé la bonne solution, tu confirmes que ça a résolu le problème.`,
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
