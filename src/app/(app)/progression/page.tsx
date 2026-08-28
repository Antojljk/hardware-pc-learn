import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { buildProgressionReport, SKILLS, type SkillKey } from '@/lib/progression';
import { SCENARIOS } from '@/content/diagnostics';
import { getLevel } from '@/lib/xp';
import {
  TrendingUp, Clock, Trophy, Target, BookOpen, MessageSquareQuote, Wrench,
  Activity, Flame, Award, Layers, ShieldCheck, ChevronRight, Zap,
  Cpu, MonitorPlay, Layers as LayersIcon, HardDrive, CircuitBoard, Plug,
  Wind, Mouse, Database, Cable, Settings, Thermometer, BarChart3,
  Stethoscope, Combine, AppWindow, Lightbulb, Sparkles, ArrowRight,
  CircleAlert, Hammer as HammerIcon, MessageCircle, Gauge as GaugeIcon, ClipboardList,
} from 'lucide-react';
import { MasteryChart } from './MasteryChart';
import { ActivityChart } from './ActivityChart';

export const metadata = { title: 'Progression — HardwarePC' };

// Icônes Lucide résolues à partir du nom d'icône stocké dans la définition
// des domaines techniques (cf. src/lib/xp.ts). Permet d'afficher les
// 21 micro-domaines sans casser l'ancien DOMAINS array.
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu, MonitorPlay, Layers: LayersIcon, HardDrive, CircuitBoard, Plug, Wind,
  Mouse, Binary: Database, Boxes: Database, Database, Cable, Zap, Settings,
  Gauge: GaugeIcon, Thermometer, BarChart3, Stethoscope, Hammer: HammerIcon,
  Combine, AppWindow,
};

// Mapping catégorie de scénario → libellé lisible
const SCENARIO_LABEL: Record<string, string> = {
  'GPU/Display':  'GPU / Affichage',
  'Alimentation': 'Alimentation',
  'Système':      'Système',
  'Thermique':    'Thermique',
  'RAM':          'Mémoire',
  'Stockage':     'Stockage',
  'Alimentation/VRM': 'Alimentation / VRM',
  'GPU':          'GPU',
};

const ICON_FOR_SKILL: Record<SkillKey, React.ComponentType<{ className?: string }>> = {
  composants: Cpu,
  montage: HammerIcon,
  diagnostic: Stethoscope,
  depannage: Wrench,
  performances: GaugeIcon,
  relation_client: MessageCircle,
};

const TYPE_LABEL: Record<'quiz' | 'exam' | 'diagnostic' | 'interview' | 'course' | 'build', string> = {
  quiz:       'Quiz',
  exam:       'Examen',
  diagnostic: 'Diagnostic',
  interview:  'Entretien',
  course:     'Cours',
  build:      'Configuration',
};

const TYPE_ICON: Record<'quiz' | 'exam' | 'diagnostic' | 'interview' | 'course' | 'build', React.ComponentType<{ className?: string }>> = {
  quiz:       Target,
  exam:       ClipboardList,
  diagnostic: Wrench,
  interview:  MessageSquareQuote,
  course:     BookOpen,
  build:      Sparkles,
};

// Libellés courts des domaines techniques — utilisés dans le tooltip d'un
// cours lié à un skill précis.
const SKILL_DOMAINS: Record<SkillKey, string[]> = {
  composants:      ['CPU', 'GPU', 'RAM', 'Stockage', 'Carte mère', 'VRM', 'BIOS/UEFI'],
  montage:         ['Montage / Build', 'Compatibilité', 'Pilotes / OS'],
  diagnostic:      ['Diagnostic'],
  depannage:       ['BSOD', 'Instabilité', 'Alimentation'],
  performances:    ['Benchmarks', 'Overclocking', 'Thermique'],
  relation_client: ['Support', 'Vente'],
};

export default async function ProgressionPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const report = await buildProgressionReport(user.id, user.xp);
  // getLevel importé pour rétrocompatibilité (le hero utilise désormais report.level)
  void getLevel;

  // Pour le graphique d'activité : 14 derniers jours
  const days: { day: string; xp: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const dailyXp = report.recent
      .filter(a => new Date(a.createdAt) >= d && new Date(a.createdAt) < next)
      .reduce((s, a) => s + a.score * a.weight, 0);
    days.push({ day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }), xp: Math.round(dailyXp) });
  }

  // Pour le graphique de maîtrise par compétence technique (rétrocompat)
  const { DOMAINS } = await import('@/lib/xp');
  const technicalStats = DOMAINS.map(d => ({
    key: d.key,
    label: d.label,
    value: report.domains[d.key] ?? 0,
    attempts: 0,
  })).filter(d => d.value > 0);

  const badges = await prisma.badgesOnUsers.findMany({
    where: { userId: user.id },
    include: { badge: true },
  });

  // Prochaine leçon
  const completedIds = new Set(
    (await prisma.lessonProgress.findMany({
      where: { userId: user.id, completed: true },
      select: { lessonId: true },
    })).map(l => l.lessonId)
  );
  const nextLesson = await prisma.lesson.findFirst({
    where: { id: { notIn: Array.from(completedIds) } },
    orderBy: [{ trackId: 'asc' }, { order: 'asc' }],
  });

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="module-hero">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Tableau de bord
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Progression
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Tes compétences, ton niveau et la suite recommandée pour devenir technicien.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[420px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Zap className="w-3.5 h-3.5" /> XP
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {user.xp}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Flame className="w-3.5 h-3.5" /> Série
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {user.streak}<span className="text-sm text-muted ml-0.5">j</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Award className="w-3.5 h-3.5" /> Badges
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {badges.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <Activity className="w-3.5 h-3.5" /> Global
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {report.globalPercent}<span className="text-sm text-muted ml-0.5">%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NIVEAU + PROGRESSION GLOBALE */}
      <section className="card-depth relative overflow-hidden p-5 sm:p-6 anim-rise anim-rise-1">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative grid lg:grid-cols-[1fr_2fr] gap-6 items-center">
          <div>
            <div className="module-eyebrow flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Niveau actuel
            </div>
            <div className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              {report.level.current.title}
            </div>
            <div className="text-sm text-muted mt-2">
              {report.level.isMax ? (
                <span className="text-text">Niveau maximum atteint</span>
              ) : (
                <>Prochain palier · <span className="text-text">{report.level.next.title}</span></>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div className="text-[11px] uppercase tracking-wider text-muted">
                Progression globale
              </div>
              <div className="font-display text-2xl font-semibold tabular-nums tracking-tight">
                {report.globalPercent}<span className="text-muted text-base ml-0.5">%</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
              <div
                className="h-full bg-text transition-all duration-700 ease-smooth"
                style={{ width: `${report.globalPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted tabular-nums">
              <span>{user.xp} XP cumulés</span>
              <span>
                {report.level.isMax
                  ? '— palier final —'
                  : `${Math.max(0, report.level.next.xpRequired - user.xp)} XP → ${report.level.next.title}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 COMPÉTENCES */}
      <section className="anim-rise anim-rise-2">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted" /> Compétences
            </h2>
            <p className="text-[11px] uppercase tracking-[0.12em] text-faint mt-1">
              Calculées à partir de tes quiz, examens, diagnostics, entretiens, cours et configurations
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {report.skills.map(s => (
            <SkillCard key={s.key} skill={s} />
          ))}
        </div>
      </section>

      {/* GRAPHIQUES */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="module-frame anim-rise anim-rise-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Activité (14 derniers jours)</h2>
            <span className="badge-muted tabular-nums">
              {days.reduce((s, d) => s + d.xp, 0)} XP
            </span>
          </div>
          <ActivityChart data={days} />
        </div>
        <div className="module-frame anim-rise anim-rise-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Maîtrise technique</h2>
            <span className="badge-muted">{technicalStats.length} domaines</span>
          </div>
          {technicalStats.length === 0 ? (
            <EmptyState label="Pas encore de données de quiz." />
          ) : (
            <MasteryChart data={technicalStats.slice(0, 12)} />
          )}
        </div>
      </section>

      {/* PROCHAINE ÉTAPE + ACTIVITÉ RÉCENTE */}
      <section className="grid lg:grid-cols-[1fr_2fr] gap-4">
        {/* Prochaine étape recommandée */}
        <div className="card-depth relative overflow-hidden p-5 sm:p-6 anim-rise anim-rise-1">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-muted" />
              <h2 className="section-title">Prochaine étape</h2>
            </div>
            {report.recommended ? (
              <RecommendedStep report={report} />
            ) : (
              <EmptyState label="Commence par un quiz ou un cours pour calibrer ta progression." />
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="card-depth p-5 sm:p-6 anim-rise anim-rise-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted" /> Activité récente
            </h2>
            <span className="badge-muted tabular-nums">{report.activity.total}</span>
          </div>
          {report.recent.length === 0 ? (
            <EmptyState label="Pas encore d'activité enregistrée." />
          ) : (
            <ul className="divide-y divide-border">
              {report.recent.slice(0, 8).map(item => {
                const Icon = TYPE_ICON[item.type];
                return (
                  <li key={`${item.type}-${item.id}`} className="py-3 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg grid place-items-center bg-bg-elev border border-border text-text shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.label}</div>
                      <div className="text-[11px] uppercase tracking-wider text-muted">
                        {TYPE_LABEL[item.type]} · {formatRelative(item.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:block w-20 h-1.5 rounded-full bg-bg-elev overflow-hidden">
                        <div className="h-full bg-text" style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="font-display font-semibold tabular-nums text-text w-12 text-right">
                        {item.score}<span className="text-muted text-xs font-normal">%</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* STATS GLOBALES PAR TYPE */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat icon={BookOpen} label="Cours terminés" value={report.activity.byType.course} />
        <Stat icon={Target} label="Quiz passés" value={report.activity.byType.quiz} />
        <Stat icon={Layers} label="Examens" value={report.activity.byType.exam} />
        <Stat icon={MessageSquareQuote} label="Entretiens" value={report.activity.byType.interview} />
        <Stat icon={Wrench} label="Diagnostics" value={report.activity.byType.diagnostic} />
      </section>

      {/* DOMAINES À AMÉLIORER + PROCHAINE LEÇON */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="module-frame anim-rise anim-rise-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <CircleAlert className="w-4 h-4" /> Domaines à améliorer
            </h2>
            <span className="badge-muted tabular-nums">{report.weakSkills.length}</span>
          </div>
          {report.weakSkills.length === 0 ? (
            <EmptyState label="Aucune compétence critique —继续保持." />
          ) : (
            <ul className="space-y-2">
              {report.weakSkills.map(key => {
                const s = report.skills.find(x => x.key === key)!;
                const def = SKILLS.find(x => x.key === key)!;
                return (
                  <li
                    key={key}
                    className="rounded-xl border border-border bg-bg-elev/40 p-3 flex items-center gap-3"
                  >
                    <span className="flex-1 min-w-0">
                      <span className="font-medium block">{def.label}</span>
                      <span className="text-[11px] text-muted">{def.short}</span>
                    </span>
                    <div className="hidden sm:block w-24 h-1.5 rounded-full bg-bg overflow-hidden">
                      <div className="h-full bg-text/70" style={{ width: `${s.value}%` }} />
                    </div>
                    <Link
                      href={def.href}
                      className="btn-outline text-xs shrink-0"
                    >
                      {def.cta}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="module-frame anim-rise anim-rise-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Continuer un cours
            </h2>
            <span className="badge-muted">Suivant</span>
          </div>
          {nextLesson ? (
            <Link href={`/cours/${nextLesson.slug}`} className="block group">
              <div className="text-[11px] uppercase tracking-wider text-muted">{nextLesson.level}</div>
              <div className="font-display text-xl font-semibold mt-1 group-hover:text-accent transition-colors text-text">
                {nextLesson.title}
              </div>
              <div className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">{nextLesson.objective}</div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-text">
                Ouvrir la leçon <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ) : (
            <EmptyState label="Tu as terminé tous les cours. Bravo." />
          )}
        </div>
      </section>

      {/* RÉUSSITES (BADGES) */}
      {badges.length > 0 && (
        <section className="module-frame anim-rise anim-rise-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Réussites
            </h2>
            <span className="badge-muted tabular-nums">{badges.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div
                key={b.badge.id}
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-bg-elev border border-border lift-3d"
              >
                <span className="font-display tabular-nums text-text-soft">
                  {b.badge.icon}
                </span>
                <span>{b.badge.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RACCOURCIS */}
      <section className="grid sm:grid-cols-3 gap-3">
        <Link
          href="/revisions"
          className="card-depth relative overflow-hidden lift-3d group p-5 anim-rise anim-rise-1"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <Clock className="w-5 h-5 text-text" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold tracking-tight">Révisions</div>
              <div className="text-xs text-muted mt-0.5">Réviser les termes clés</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
        <Link
          href="/entretiens"
          className="card-depth relative overflow-hidden lift-3d group p-5 anim-rise anim-rise-2"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <MessageSquareQuote className="w-5 h-5 text-text" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold tracking-tight">Entretiens</div>
              <div className="text-xs text-muted mt-0.5">S&apos;entraîner à l&apos;oral</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
        <Link
          href="/diagnostic"
          className="card-depth relative overflow-hidden lift-3d group p-5 anim-rise anim-rise-3"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-bg-elev border border-border shrink-0">
              <Wrench className="w-5 h-5 text-text" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold tracking-tight">Diagnostics</div>
              <div className="text-xs text-muted mt-0.5">Résoudre des pannes</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </section>
    </div>
  );
}

// ─────────────────────────────── Sous-composants ───────────────────────────────

function SkillCard({ skill }: { skill: ReturnType<typeof Object> }) {
  // Note : la signature est large mais le type précis est passé par l'appelant
  // (SkillBreakdown). On retape ici pour ne pas dépendre d'un import circulaire.
  const s = skill as {
    key: SkillKey;
    value: number;
    activity: number;
    signals: number;
    components: { quiz: number; exam: number; diagnostic: number; interview: number; courses: number; builds: number };
    attempts: number;
  };
  const def = SKILLS.find(x => x.key === s.key)!;
  const Icon = ICON_FOR_SKILL[s.key];
  const tone = s.value >= 75 ? 'text-text' : s.value >= 50 ? 'text-text-soft' : 'text-muted';
  const ring = s.value >= 75 ? 'border-text/30' : s.value >= 50 ? 'border-border' : 'border-border';

  return (
    <article className={`card-depth relative overflow-hidden p-4 sm:p-5 border ${ring} anim-rise`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-lg grid place-items-center bg-bg-elev border border-border shrink-0">
              <Icon className="w-4 h-4 text-text" />
            </span>
            <div className="min-w-0">
              <div className="font-display font-semibold tracking-tight text-text truncate">{def.label}</div>
              <div className="text-[10px] uppercase tracking-[0.1em] text-muted truncate">{def.short}</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`font-display text-2xl font-semibold tabular-nums ${tone}`}>
              {s.value}<span className="text-muted text-sm font-normal">%</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-faint tabular-nums">
              {s.signals} signal{s.signals > 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
          <div
            className="h-full bg-text transition-all duration-700 ease-smooth"
            style={{ width: `${s.value}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] uppercase tracking-[0.08em] text-muted">
          <SourceChip label="Quiz" v={s.components.quiz} />
          <SourceChip label="Exam." v={s.components.exam} />
          <SourceChip label="Diag." v={s.components.diagnostic} />
          <SourceChip label="Entr." v={s.components.interview} />
          <SourceChip label="Cours" v={s.components.courses} />
          <SourceChip label="Builds" v={s.components.builds} />
        </div>
      </div>
    </article>
  );
}

function SourceChip({ label, v }: { label: string; v: number }) {
  const tone = v >= 75 ? 'text-text border-text/30 bg-text/8'
    : v >= 40 ? 'text-text-soft border-border bg-bg-elev'
    : 'text-muted border-border bg-bg-elev';
  return (
    <div className={`rounded-md border px-1.5 py-1 tabular-nums text-center ${tone}`}>
      <div className="font-display text-[11px] font-semibold">{v > 0 ? `${v}%` : '—'}</div>
      <div className="text-[9px] mt-0.5">{label}</div>
    </div>
  );
}

function RecommendedStep({ report }: { report: ReturnType<typeof Object> }) {
  const r = report as { recommended: { skill: SkillKey; href: string; cta: string; reason: string } };
  const def = SKILLS.find(x => x.key === r.recommended.skill)!;
  const Icon = ICON_FOR_SKILL[r.recommended.skill];
  const s = (report as { skills: { key: SkillKey; value: number }[] }).skills.find(x => x.key === r.recommended.skill);
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-lg grid place-items-center bg-text/10 border border-text/30 shrink-0">
          <Icon className="w-4 h-4 text-text" />
        </span>
        <div className="min-w-0">
          <div className="font-display text-lg font-semibold text-text">{def.label}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted">
            {s ? `${s.value}% actuellement` : 'À découvrir'}
          </div>
        </div>
      </div>
      <p className="text-sm text-text-soft leading-relaxed mb-4">
        {r.recommended.reason}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SKILL_DOMAINS[r.recommended.skill].map(d => (
          <span key={d} className="badge-muted">{d}</span>
        ))}
      </div>
      <Link href={r.recommended.href} className="btn-primary w-full justify-center">
        {r.recommended.cta}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function Stat({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="card p-4 flex flex-col gap-1.5 lift-3d">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-muted" />
        <span className="badge-muted tabular-nums">{value}</span>
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-bg-elev/40 p-6 text-center">
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function formatRelative(date: Date): string {
  const ms = Date.now() - date.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `il y a ${d} j`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

// Silence unused imports for parity
void SCENARIOS;
void SCENARIO_LABEL;
void ICONS;
