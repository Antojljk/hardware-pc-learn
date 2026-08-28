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
  Activity,
  ListChecks,
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
    <div className="space-y-6">
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Tableau de bord
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Salut {user.username}
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              {today.charAt(0).toUpperCase() + today.slice(1)} — explore les composants,
              mesure ta progression, teste tes acquis.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/quiz" className="btn-primary">
                <Brain className="w-4 h-4" /> Lancer un quiz
              </Link>
              <Link href="/diagnostic" className="btn-outline">
                <Wrench className="w-4 h-4" /> Diagnostic
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Flame className="w-3.5 h-3.5" /> Série
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {user.streak} j
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Target className="w-3.5 h-3.5" /> Score
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {avgScore}%
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Trophy className="w-3.5 h-3.5" /> Badges
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {badges.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          NIVEAU & PROGRESSION
          ============================================================ */}
      <section className="module-frame anim-rise anim-rise-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Niveau & série
          </h2>
          <span className="badge-muted">Niveau {lvl.current.level}</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted">Niveau</span>
              <span className="font-display text-3xl font-semibold tabular-nums text-text">{lvl.current.level}</span>
              <span className="font-display text-lg text-muted">— {lvl.current.title}</span>
            </div>
            <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
              <div className="h-full bg-accent transition-all duration-700 ease-smooth" style={{ width: `${lvl.progress}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-[11px] uppercase tracking-[0.1em]">
              <span className="text-text tabular-nums">{user.xp} XP</span>
              <span className="text-muted">{lvl.next.xpRequired} XP → {lvl.next.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 min-w-[240px]">
            <Stat icon={BookOpen} label="Cours" value={`${completedLessons}/${allLessons}`} />
            <Stat icon={Trophy} label="Badges" value={String(badges.length)} />
            <Stat icon={Flame} label="Série" value={`${user.streak} j`} />
          </div>
        </div>
      </section>

      {/* ============================================================
          MODULES 3D
          ============================================================ */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="section-title">Architecture matérielle</h2>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">02 · Composants</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.slice(0, 6).map((m, i) => (
            <Link
              key={m.title}
              href="/cours"
              className={`card-depth relative overflow-hidden lift-3d group p-5 sm:p-6 anim-rise anim-rise-${(i % 4) + 1}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-50 blur-3xl"
                style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="badge-muted">{m.accent}</span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-faint">
                    0{i + 1}
                  </span>
                </div>

                <div className="aspect-[4/3] -mx-2 rounded-xl bg-bg-elev border border-border-soft grid place-items-center transition-transform duration-500 group-hover:-translate-y-0.5">
                  <m.icon className="w-12 h-12 text-text" strokeWidth={1.4} />
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <h3 className="font-display text-base font-semibold tracking-tight text-text">{m.title}</h3>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted mt-1">{m.tag}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          MAÎTRISE PAR DOMAINE
          ============================================================ */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="section-title">Maîtrise par domaine</h2>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">03 · Progression</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {domainEntries.map(d => (
            <DomainProgress key={d.key} label={d.label} value={d.value} color={masteryColor(d.value)} />
          ))}
        </div>
      </section>

      {/* ============================================================
          CONTINUER + À AMÉLIORER
          ============================================================ */}
      <section className="grid lg:grid-cols-2 gap-3">
        <article className="card-depth relative overflow-hidden p-5 sm:p-6 anim-rise anim-rise-1">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted" /> Continuer
              </h2>
              <span className="text-[10px] uppercase tracking-[0.14em] text-faint">04</span>
            </div>
            {nextLesson ? (
              <Link href={`/cours/${nextLesson.slug}`} className="block group">
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted">{nextLesson.level}</div>
                <div className="font-display text-xl font-semibold mt-1 group-hover:text-accent transition-colors text-text">
                  {nextLesson.title}
                </div>
                <div className="text-[14px] text-muted mt-2 line-clamp-2 leading-relaxed">{nextLesson.objective}</div>
                <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-text">
                  Ouvrir la leçon <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : (
              <div className="text-muted">Tu as terminé tous les cours. Bravo.</div>
            )}
          </div>
        </article>

        <article className="card-depth relative overflow-hidden p-5 sm:p-6 anim-rise anim-rise-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" /> À renforcer
              </h2>
              <span className="text-[10px] uppercase tracking-[0.14em] text-faint">05</span>
            </div>
            {weakDomains.length === 0 ? (
              <div className="text-muted">Aucun domaine sous le seuil — continue à varier les quiz.</div>
            ) : (
              <ul className="divide-y divide-border">
                {weakDomains.map((d, i) => (
                  <li key={d.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <div className="font-medium text-text">{d.label}</div>
                      <div className="text-[11px] uppercase tracking-[0.1em] text-muted">
                        <span className={DOMAIN_COLORS[i % DOMAIN_COLORS.length]}>{d.value}%</span>
                        &nbsp;— à travailler
                      </div>
                    </div>
                    <Link href={`/quiz?category=${d.key}`} className="btn-outline text-[12px] py-1.5">S&apos;entraîner</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </section>

      {/* ============================================================
          BADGES
          ============================================================ */}
      {badges.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" /> Badges débloqués
            </h2>
            <span className="badge-muted tabular-nums">{badges.length}</span>
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
          QUICKLINKS
          ============================================================ */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="section-title">Modules pratiques</h2>
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">06 · Aller plus loin</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <QuickLink href="/entretiens"  icon={MessageSquareQuote} num="07" title="Entretien blanc" desc="Prépare un entretien." />
          <QuickLink href="/constructeur" icon={Wrench}             num="08" title="Constructeur PC"  desc="Crée ta config." />
          <QuickLink href="/glossaire"   icon={BookOpen}           num="09" title="Glossaire"        desc="300+ termes." />
        </div>
      </section>

      {/* ============================================================
          CTA final
          ============================================================ */}
      <section className="card-highlight anim-rise anim-rise-4">
        <div className="flex flex-col items-center text-center gap-5 py-8">
          <span className="badge border-border text-muted bg-transparent">Prêt à aller plus loin</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-text max-w-[44rem]">
            Construis, diagnostique, comprends. Le hardware n&apos;a plus de secret.
          </h2>
          <p className="text-muted max-w-[28rem]">
            Une session rapide par jour suffit pour transformer ta compréhension du PC.
          </p>
          <Link href="/cours" className="btn-primary mt-2">
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
    <div className="rounded-full border border-border bg-bg-soft px-4 py-2.5 flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted" />
      <div className="flex items-baseline gap-2">
        <span className="font-display text-base font-semibold tabular-nums text-text">{value}</span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted">{label}</span>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, desc, num }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; num: string }) {
  return (
    <Link href={href} className="card-depth relative overflow-hidden lift-3d p-5 flex items-center gap-4 group">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
      />
      <span className="relative text-[10px] uppercase tracking-[0.14em] text-faint w-6">{num}</span>
      <Icon className="relative w-5 h-5 text-text" />
      <div className="relative flex-1">
        <div className="font-medium text-text">{title}</div>
        <div className="text-[11px] uppercase tracking-[0.08em] text-muted">{desc}</div>
      </div>
      <ArrowRight className="relative w-4 h-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-text" />
    </Link>
  );
}
