import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildProgressionReport, SKILLS, type SkillKey } from '@/lib/progression';
import { getPlan, planLabel } from '@/lib/plans';
import {
  User, Trophy, Flame, Sparkles, Mail, Calendar, ShieldCheck,
  TrendingUp, ChevronRight, Cpu, Stethoscope, Wrench, Gauge,
  MessageCircle, Activity, BookOpen, ClipboardList, Hammer as HammerIcon,
  Crown, BarChart3,
} from 'lucide-react';
import { LogoutButton } from './LogoutButton';

export const metadata = { title: 'Profil — HardwarePC' };

const ICON_FOR_SKILL: Record<SkillKey, React.ComponentType<{ className?: string }>> = {
  composants: Cpu,
  montage: HammerIcon,
  diagnostic: Stethoscope,
  depannage: Wrench,
  performances: Gauge,
  relation_client: MessageCircle,
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
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
  return formatDate(date);
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const [badges, report] = await Promise.all([
    prisma.badgesOnUsers.findMany({
      where: { userId: user.id },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    }),
    buildProgressionReport(user.id, user.xp),
  ]);

  const plan = getPlan(user.plan);
  const initials = user.username
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* HERO */}
      <section className="module-hero relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-text text-bg grid place-items-center font-display text-2xl sm:text-3xl font-bold tabular-nums shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="module-eyebrow flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Compte
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-2 truncate">
                {user.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-text-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </span>
                <span aria-hidden className="text-faint">·</span>
                <span className="badge-accent inline-flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Offre {planLabel(user.plan)}
                </span>
                {user.isGuest && <span className="badge-warning">Invité</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NIVEAU + XP + PROGRESSION */}
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

      {/* STATS RAPIDES */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          icon={Sparkles}
          label="XP cumulé"
          value={user.xp.toString()}
        />
        <StatTile
          icon={Flame}
          label="Série en cours"
          value={`${user.streak} j`}
        />
        <StatTile
          icon={Trophy}
          label="Badges"
          value={String(badges.length)}
        />
        <StatTile
          icon={Activity}
          label="Activités"
          value={String(report.activity.total)}
        />
      </section>

      {/* COMPÉTENCES + STATS PAR TYPE */}
      <section className="grid lg:grid-cols-[3fr_2fr] gap-4">
        <div className="anim-rise anim-rise-2">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="section-title flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted" /> Compétences principales
            </h2>
            <span className="badge-muted tabular-nums">{report.skills.length}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {report.skills
              .slice()
              .sort((a, b) => b.value - a.value)
              .slice(0, 4)
              .map(s => {
                const def = SKILLS.find(x => x.key === s.key)!;
                const Icon = ICON_FOR_SKILL[s.key];
                return (
                  <article
                    key={s.key}
                    className="card-depth relative overflow-hidden p-4 anim-rise"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-3xl"
                      style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 70%)' }}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-9 h-9 rounded-lg grid place-items-center bg-bg-elev border border-border shrink-0">
                          <Icon className="w-4 h-4 text-text" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-display font-semibold tracking-tight text-text truncate">
                            {def.label}
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.1em] text-muted truncate">
                            {def.short}
                          </div>
                        </div>
                        <div className="font-display text-xl font-semibold tabular-nums text-text shrink-0">
                          {s.value}<span className="text-muted text-sm">%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
                        <div
                          className="h-full bg-text transition-all duration-700 ease-smooth"
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
          <div className="mt-3">
            <Link
              href="/progression"
              className="btn-outline w-full justify-center"
            >
              Voir toutes mes compétences
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="anim-rise anim-rise-3">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted" /> Statistiques
            </h2>
          </div>
          <div className="card-depth p-5 space-y-3">
            <StatRow icon={BookOpen} label="Cours terminés" value={report.activity.byType.course} />
            <StatRow icon={ClipboardList} label="Quiz passés" value={report.activity.byType.quiz} />
            <StatRow icon={ShieldCheck} label="Examens" value={report.activity.byType.exam} />
            <StatRow icon={MessageCircle} label="Entretiens" value={report.activity.byType.interview} />
            <StatRow icon={Wrench} label="Diagnostics" value={report.activity.byType.diagnostic} />
            <StatRow icon={HammerIcon} label="Configurations" value={report.activity.byType.build} />
          </div>
        </div>
      </section>

      {/* BADGES + ACTIVITÉ RÉCENTE */}
      <section className="grid lg:grid-cols-[2fr_3fr] gap-4">
        <div className="card-depth p-5 sm:p-6 anim-rise anim-rise-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4 text-muted" /> Badges ({badges.length})
            </h2>
          </div>
          {badges.length === 0 ? (
            <p className="text-sm text-muted">Pas encore de badge — termine un cours ou un quiz pour commencer.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.slice(0, 12).map(b => (
                <div
                  key={b.badge.id}
                  className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-bg-elev border border-border"
                  title={b.badge.description}
                >
                  <span className="font-display tabular-nums text-text-soft">
                    {b.badge.icon}
                  </span>
                  <span>{b.badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-depth p-5 sm:p-6 anim-rise anim-rise-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted" /> Activité récente
            </h2>
            <span className="badge-muted tabular-nums">{report.recent.length}</span>
          </div>
          {report.recent.length === 0 ? (
            <p className="text-sm text-muted">Pas encore d'activité enregistrée.</p>
          ) : (
            <ul className="divide-y divide-border">
              {report.recent.slice(0, 6).map(item => (
                <li key={`${item.type}-${item.id}`} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted">
                      {formatRelative(item.createdAt)}
                    </div>
                  </div>
                  <span className="font-display font-semibold tabular-nums text-text">
                    {item.score}<span className="text-muted text-xs">%</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* INFOS COMPTE */}
      <section className="card-depth p-5 sm:p-6 anim-rise anim-rise-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <User className="w-4 h-4 text-muted" /> Informations du compte
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <InfoRow label="Pseudo" value={user.username} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow
            icon={Calendar}
            label="Inscrit le"
            value={formatDate(user.createdAt)}
          />
          {user.lastActiveAt && (
            <InfoRow
              icon={Activity}
              label="Dernière activité"
              value={formatRelative(user.lastActiveAt)}
            />
          )}
          <InfoRow icon={Crown} label="Offre actuelle" value={planLabel(user.plan)} />
          <InfoRow
            label="Type"
            value={user.isGuest ? 'Compte invité' : 'Compte standard'}
          />
        </div>

        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-3">
          <Link href="/parametres" className="btn-outline">
            Modifier mon profil
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/tarifs" className="btn-outline">
            Gérer mon offre
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/historique" className="btn-outline">
            Historique complet
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4 lift-3d">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-muted" />
      </div>
      <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-text">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted mt-0.5">
        {label}
      </div>
    </div>
  );
}

function StatRow({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="inline-flex items-center gap-2 text-sm text-text-soft">
        <Icon className="w-4 h-4 text-muted" />
        {label}
      </span>
      <span className="font-display font-semibold tabular-nums text-text">{value}</span>
    </div>
  );
}

function InfoRow({
  label, value, icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-[0.12em] text-muted inline-flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="font-medium text-text break-words">{value}</div>
    </div>
  );
}
