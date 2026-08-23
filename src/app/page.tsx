import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { computeDomainMastery, unlockBadges, updateStreak } from '@/lib/gamification';
import { getLevel, DOMAINS, masteryColor } from '@/lib/xp';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  Trophy,
  Flame,
  Target,
  BookOpen,
  Brain,
  Wrench,
  MessageSquareQuote,
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  PcCase,
} from 'lucide-react';
import { DomainProgress } from '@/components/DomainProgress';

const MODULES = [
  { icon: Cpu,           title: 'Processeur', tag: 'CPU · Cores · Cache',  accent: 'Architecture CPU' },
  { icon: CircuitBoard,  title: 'Carte mère', tag: 'Chipsets · Slots',     accent: 'Bus & connectique' },
  { icon: MemoryStick,   title: 'Mémoire',    tag: 'DDR5 · Latence CAS',   accent: 'RAM · Dual Channel' },
  { icon: HardDrive,     title: 'Stockage',   tag: 'NVMe · TLC · QLC',      accent: 'SSD · Endurance' },
  { icon: PcCase,        title: 'Boîtier',    tag: 'Airflow · Format',      accent: 'Refroidissement' },
];

const DOMAIN_COLORS = ['text-accent', 'text-warning', 'text-success', 'text-text', 'text-muted'];
const DOMAIN_BG     = ['bg-accent',   'bg-warning',   'bg-success',   'bg-text',   'bg-muted'];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  await updateStreak(user.id);
  await unlockBadges(user.id);

  const [mastery, attempts, completedLessons, allLessons, badges] = await Promise.all([
    computeDomainMastery(user.id),
    prisma.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.lessonProgress.count({ where: { userId: user.id, completed: true } }),
    prisma.lesson.count(),
    prisma.badgesOnUsers.findMany({ where: { userId: user.id }, include: { badge: true } }),
  ]);

  const lvl = getLevel(user.xp);
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score / Math.max(1, a.total)) * 100, 0) / attempts.length)
    : 0;

  const domainEntries = DOMAINS.map(d => ({
    key: d.key,
    label: d.label,
    value: mastery[d.key] ?? 0,
  })).sort((a, b) => b.value - a.value);

  const weakDomains = domainEntries.slice().sort((a, b) => a.value - b.value).filter(d => d.value < 65).slice(0, 3);

  const completedIds = new Set(
    (await prisma.lessonProgress.findMany({ where: { userId: user.id, completed: true }, select: { lessonId: true } }))
      .map(l => l.lessonId)
  );
  const nextLesson = await prisma.lesson.findFirst({
    where: { id: { notIn: Array.from(completedIds) } },
    orderBy: [{ trackId: 'asc' }, { order: 'asc' }],
  });

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-16">
      {/* ============================================================
          HERO — CoreTech style : titre énorme, lède mono, CTA pill
          ============================================================ */}
      <section className="pt-2">
        <div className="flex items-center justify-between gap-3 mb-10 text-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span>{today}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Session active
          </span>
        </div>

        <h1 className="font-display font-semibold text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.045em] text-text">
          Salut {user.username}.<br />
          <span className="text-muted">Prêt à ouvrir le capot&nbsp;?</span>
        </h1>

        <div className="mt-10 grid lg:grid-cols-[2fr_1fr] gap-10 items-end">
          <p className="font-mono text-[15px] leading-relaxed text-text-soft max-w-[60ch]">
            Explore les composants, mesure ta progression, teste tes acquis. Un parcours clair,
            des quiz rapides, des examens blancs et un constructeur de configuration — tout
            pour comprendre vraiment comment ton PC tourne.
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/quiz" className="btn-primary">
              <Brain className="w-4 h-4" /> Lancer un quiz
            </Link>
            <Link href="/diagnostic" className="btn-outline">
              <Wrench className="w-4 h-4" /> Diagnostic
            </Link>
          </div>
        </div>
      </section>

      <hr className="hair-rule" />

      {/* ============================================================
          NIVEAU + STATS — minimal, grille fine, pas de gradient
          ============================================================ */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-6">
          <h2 className="section-title">Niveau &amp; série</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">01 · Profil</span>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Niveau</span>
                <span className="font-display text-3xl font-semibold tabular-nums">{lvl.current.level}</span>
                <span className="font-display text-lg text-muted">— {lvl.current.title}</span>
              </div>
              <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
                <div className="h-full bg-accent transition-all duration-700 ease-smooth" style={{ width: `${lvl.progress}%` }} />
              </div>
              <div className="flex justify-between mt-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                <span className="text-text tabular-nums">{user.xp} XP</span>
                <span className="text-muted">{lvl.next.xpRequired} XP → {lvl.next.title}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 min-w-[280px]">
              <Stat icon={Flame}    label="Série"      value={`${user.streak} j`} />
              <Stat icon={BookOpen} label="Cours"      value={`${completedLessons}/${allLessons}`} />
              <Stat icon={Target}   label="Score moyen" value={`${avgScore}%`} />
              <Stat icon={Trophy}   label="Badges"     value={String(badges.length)} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MARQUEE — petite bande défilante façon CoreTech
          ============================================================ */}
      <section aria-hidden="true" className="-mx-6 sm:-mx-10">
        <div className="marquee-strip">
          <Marquee items={[...MODULES.map(m => m.title), 'Quiz', 'Examens blancs', 'Constructeur PC', 'Diagnostic', 'Glossaire']} />
        </div>
      </section>

      {/* ============================================================
          MODULES 3D — équivalent "gallery.image-carousel-elastic" :
          grille aérée, grandes tuiles, badge + meta
          ============================================================ */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="m-badge">Modules interactifs</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em] mt-4 text-text">
            Architecture matérielle
          </h2>
          <p className="mt-3 text-text-soft text-[15px]">
            Visualise le rôle de chaque composant et la façon dont ils communiquent entre eux.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.slice(0, 6).map((m, i) => (
            <Link
              key={m.title}
              href="/cours"
              className="card card-hover p-6 flex flex-col gap-5 group"
            >
              <div className="flex items-start justify-between">
                <span className={cnBadge(i)}>{m.accent}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  0{i + 1}
                </span>
              </div>

              <div className="aspect-[4/3] -mx-2 rounded-xl bg-bg-elev border border-border-soft grid place-items-center transition-transform duration-500 group-hover:-translate-y-0.5">
                <m.icon className="w-12 h-12 text-text" strokeWidth={1.4} />
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">{m.title}</h3>
                <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted mt-1">{m.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          MAÎTRISE PAR DOMAINE
          ============================================================ */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-6">
          <h2 className="section-title">Maîtrise par domaine</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">02 · Progression</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {domainEntries.map(d => (
            <DomainProgress key={d.key} label={d.label} value={d.value} color={masteryColor(d.value)} />
          ))}
        </div>
      </section>

      <hr className="hair-rule" />

      {/* ============================================================
          CONTINUER + À AMÉLIORER — deux colonnes fines
          ============================================================ */}
      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted" /> Continuer
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">03</span>
          </div>
          {nextLesson ? (
            <Link href={`/cours/${nextLesson.slug}`} className="block group">
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{nextLesson.level}</div>
              <div className="font-display text-xl font-semibold mt-1 group-hover:text-accent transition-colors">
                {nextLesson.title}
              </div>
              <div className="text-[14px] text-text-soft mt-2 line-clamp-2 leading-relaxed">{nextLesson.objective}</div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-mono text-text">
                Ouvrir la leçon <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ) : (
            <div className="text-text-soft">Tu as terminé tous les cours. Bravo.</div>
          )}
        </article>

        <article className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" /> À renforcer
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">04</span>
          </div>
          {weakDomains.length === 0 ? (
            <div className="text-text-soft">Aucun domaine sous le seuil — continue à varier les quiz.</div>
          ) : (
            <ul className="divide-y divide-border">
              {weakDomains.map((d, i) => (
                <li key={d.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="font-medium">{d.label}</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      <span className={DOMAIN_COLORS[i % DOMAIN_COLORS.length]}>{d.value}%</span>
                      &nbsp;— à travailler
                    </div>
                  </div>
                  <Link href={`/quiz?category=${d.key}`} className="btn-outline text-[12px] py-1.5">S&apos;entraîner</Link>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      {/* ============================================================
          BADGES — liste horizontale minimaliste
          ============================================================ */}
      {badges.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-3 mb-6">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" /> Badges débloqués
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">05</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {badges.map(b => (
              <li key={b.badge.id} className="badge">
                <span>{b.badge.icon}</span>
                <span>{b.badge.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============================================================
          QUICKLINKS — gros, monospace, sans gradient
          ============================================================ */}
      <section className="grid sm:grid-cols-3 gap-3">
        <QuickLink href="/entretiens"  icon={MessageSquareQuote} num="06" title="Entretien blanc" desc="Prépare un entretien." />
        <QuickLink href="/constructeur" icon={Wrench}             num="07" title="Constructeur PC"  desc="Crée ta config." />
        <QuickLink href="/glossaire"   icon={BookOpen}           num="08" title="Glossaire"        desc="300+ termes." />
      </section>

      {/* ============================================================
          CTA — surface sombre façon CoreTech .dcr
          ============================================================ */}
      <section className="card-highlight">
        <div className="flex flex-col items-center text-center gap-5 py-10">
          <span className="m-badge border-bg/30 text-bg/80 bg-transparent">Prêt à aller plus loin</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-bg max-w-[44rem]">
            Construis, diagnostique, comprends. Le hardware n&apos;a plus de secret.
          </h2>
          <p className="text-bg/70 max-w-[28rem]">
            Une session rapide par jour suffit pour transformer ta compréhension du PC.
          </p>
          <Link href="/cours" className="btn-primary bg-bg text-text border-bg hover:opacity-90 mt-2">
            Voir tous les cours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-white px-4 py-2.5 flex items-center gap-3">
      <Icon className="w-4 h-4 text-text-soft" />
      <div className="flex items-baseline gap-2">
        <span className="font-display text-base font-semibold tabular-nums">{value}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{label}</span>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, desc, num }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; num: string }) {
  return (
    <Link href={href} className="card card-hover p-5 flex items-center gap-4 group">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint w-6">{num}</span>
      <Icon className="w-5 h-5 text-text" />
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{desc}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-text" />
    </Link>
  );
}

/* marquee infinie en CSS pur */
function Marquee({ items }: { items: string[] }) {
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div className="flex gap-10 whitespace-nowrap animate-[marquee_28s_linear_infinite] will-change-transform">
        {list.map((it, i) => (
          <span key={i} className="font-mono text-[12px] uppercase tracking-[0.16em] text-text">
            <span className="text-accent">●</span>&nbsp;&nbsp;{it}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

function cnBadge(i: number) {
  // 5 accents en alternance pour les badges des modules
  const map = [
    'badge-accent',
    'badge-warning',
    'badge-success',
    'badge',
    'badge',
  ];
  return map[i % map.length];
}

// garde l'import pour l'utiliser plus tard sans warning
void DOMAIN_BG;
