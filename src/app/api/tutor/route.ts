import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TERMS } from '@/content/glossary';
import { consumeAiMessage } from '@/lib/ai-quota';
import { canAccess, planLabel } from '@/lib/plans';

const schema = z.object({ message: z.string().min(1).max(2000) });

// Recherche locale dans le glossaire + base de réponses pédagogiques pré-écrites.
function localAnswer(q: string): string {
  const lower = q.toLowerCase();
  // Réponses pré-écrites sur des sujets fréquents
  const canned: { keys: string[]; reply: string }[] = [
    {
      keys: ['tdp', 'consommation', 'puissance'],
      reply: "Le TDP (Thermal Design Power) est une valeur indicative de dissipation thermique, pas la consommation réelle.\n\n• TDP = chaleur à évacuer (en W), basée sur une charge type.\n• Consommation réelle = ce que le CPU tire du 12V sur la durée. Avec PL1/PL2, un CPU 65W peut consommer 100-120W en pic.\n• C'est pour ça qu'une alimentation doit avoir 30% de marge par rapport à la somme TDP CPU + TBP GPU.",
    },
    {
      keys: ['ddr5', '6000', 'cl30', 'sweet spot', 'am5'],
      reply: "Sur AMD AM5, le sweet spot est DDR5-6000 CL30. Pourquoi ?\n\n• Le contrôleur mémoire est lié à l'Infinity Fabric (FCLK).\n• Pour rester en ratio 1:1, il faut MCLK = FCLK, donc 2000 MHz max (DDR5-4000 en 1:1 strict).\n• Au-delà, le ratio passe 2:1, mais DDR5-6000 MCLK 3000 MHz reste le point le plus performant avant de payer le surcoût.\n• Latence réelle = CL × 2000 / fréquence. CL30 à 6000 = 10 ns, comparable à de la DDR4 haut de gamme.",
    },
    {
      keys: ['vrm', 'carte mère', 'phases'],
      reply: "Le VRM convertit le 12V de la PSU en tensions précises (≈1-1.4V) pour le CPU.\n\n• Chaque phase = MOSFET haut + MOSFET bas + inductance + condensateur.\n• Plus il y a de phases robustes, plus le courant est délivré sans chute.\n• Le LLC (Load Line Calibration) compense la chute de tension sous charge, sans toutefois compenser un VRM trop juste.\n• Température VRM > 110°C = danger (HWiNFO64).",
    },
    {
      keys: ['bruit', 'ventilateur', 'ventilo'],
      reply: "PC bruyant ? Démarche :\n\n1. Identifier la source (HWiNFO64 → ventilateurs). GPU ou CPU ?\n2. Si CPU : ventirad mal installé, pâte thermique séchée, ou ventilateur qui s'use.\n3. Si GPU : courbe agressive, ou poussière dans les pales.\n4. Régler les courbes dans le BIOS (CPU) ou MSI Afterburner (GPU).\n5. Vérifier le câblage : un ventilateur en 3 pins forcé en PWM (4 pins) tourne à 100%.",
    },
    {
      keys: ['dlss', 'fsr', 'xess'],
      reply: "DLSS (NVIDIA), FSR (AMD) et XeSS (Intel) sont des techniques d'upscaling : rendu en résolution réduite + reconstruction par IA/algorithme → image proche du natif à coût de FPS bien moindre.\n\n• DLSS 3.5 + Ray Reconstruction : meilleure qualité, NVIDIA only.\n• FSR 2/3 : open source, fonctionne sur toutes les GPU.\n• XeSS : intermédiaire, Intel GPU dédié ou fallback.",
    },
  ];

  for (const c of canned) if (c.keys.some(k => lower.includes(k))) return c.reply;

  // Sinon, cherche un terme du glossaire
  const match = TERMS.find(t =>
    lower.includes(t.term.toLowerCase()) ||
    t.term.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w))
  );
  if (match) {
    const firstCat = (match.categories[0] || 'hardware').toString();
    return `Définition (${match.level}) :\n\n• Simple : ${match.simple}\n\n• Technique : ${match.technical}${match.example ? `\n\n• Exemple : ${match.example}` : ''}\n\nPour approfondir, regarde les cours sur ${firstCat}.`;
  }
  return "Je n'ai pas trouvé de réponse précise, mais je peux t'orienter :\n\n• Pour une notion → va dans le Glossaire.\n• Pour comprendre en profondeur → regarde les Cours.\n• Pour t'entraîner → passe un Quiz.\n\nReformule ta question avec un terme précis (DDR5, VRM, NVMe, FPS, etc.) pour une réponse plus juste.";
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  // Garde-fou d'offre : la fonctionnalité Tuteur IA est payante.
  if (!canAccess(user.plan, 'tutor_ai', user.id)) {
    return NextResponse.json(
      {
        error: 'Tuteur IA réservé aux utilisateurs connectés avec une offre payante.',
        code: 'PLAN_REQUIRED',
        feature: 'tutor_ai',
        required: 'ESSENTIEL',
      },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  // Consommation du quota mensuel (source de vérité côté serveur).
  const quota = await consumeAiMessage(user.id, user.plan);
  if (!quota.ok) {
    return NextResponse.json(
      {
        error: `Quota mensuel atteint pour l'offre ${planLabel(user.plan)}.`,
        code: 'QUOTA_EXCEEDED',
        feature: 'tutor_ai',
        plan: planLabel(user.plan),
        used: quota.used,
        limit: quota.limit,
      },
      { status: 403 },
    );
  }

  // Si une clé OpenAI est présente, on pourrait appeler l'API. Sinon, fallback local.
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un tuteur expert en hardware PC (CPU, GPU, RAM, stockage, alimentation, etc.). Tu réponds en français, de manière claire, structurée et adaptée au niveau de l\'utilisateur.' },
            { role: 'user', content: parsed.data.message },
          ],
          max_tokens: 600,
        }),
      });
      if (r.ok) {
        const data = await r.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({
            reply,
            source: 'openai',
            quota: { used: quota.used, limit: quota.limit, remaining: quota.limit - quota.used },
          });
        }
      }
    } catch {/* fallback */}
  }

  return NextResponse.json({
    reply: localAnswer(parsed.data.message),
    source: 'local',
    quota: { used: quota.used, limit: quota.limit, remaining: quota.limit - quota.used },
  });
}

void prisma;
