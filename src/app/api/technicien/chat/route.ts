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
      model: 'gemini-2.0-flash',
      systemInstruction: `Tu joues le rôle d'un client non-technique qui a un problème avec son PC. 
Le scénario est : ${JSON.stringify(scenario)}. 
Tu décris tes symptômes en langage simple, tu réponds aux questions du technicien de façon réaliste. 
Tu ne donnes pas la solution directement. 
Quand le technicien a correctement identifié le problème et proposé la bonne solution, tu confirmes que ça a résolu le problème.`,
    });

    const rawHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const filteredHistory = rawHistory.filter((m: { role: string; parts: { text: string }[] }, idx: number) => {
      if (idx === 0) return m.role === 'user';
      return m.role !== rawHistory[idx - 1].role;
    });

    const chat = model.startChat({
      history: filteredHistory,
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
