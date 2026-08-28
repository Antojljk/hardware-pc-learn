import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserActivities, ActivityType } from '@/lib/history';
import React from 'react';
import {
  Activity,
  BookOpen,
  Target,
  Layers,
  MessageSquareQuote,
  Wrench,
  Sparkles,
  Trophy,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const metadata = { title: 'Historique — HardwarePC' };

const TYPE_ICON: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  course: BookOpen,
  quiz: Target,
  exam: Layers,
  interview: MessageSquareQuote,
  diagnostic: Wrench,
  build: Sparkles,
  badge: Trophy,
};

const TYPE_LABEL: Record<ActivityType, string> = {
  course: 'Cours terminé',
  quiz: 'Quiz passé',
  exam: 'Examen passé',
  interview: 'Entretien réalisé',
  diagnostic: 'Diagnostic réalisé',
  build: 'Configuration créée',
  badge: 'Badge débloqué',
};

export default async function HistoriquePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const activities = await getUserActivities(user.id);

  // Filtered arrays for each section
  const courseActivities = activities.filter(a => a.type === 'course');
  const quizActivities = activities.filter(a => a.type === 'quiz');
  const examAndInterviewActivities = activities.filter(a => a.type === 'exam' || a.type === 'interview');
  const diagAndBuildActivities = activities.filter(a => a.type === 'diagnostic' || a.type === 'build');
  const badgeActivities = activities.filter(a => a.type === 'badge');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HERO */}
      <section className="module-hero">
        <div className="module-eyebrow">Historique</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Vos activités
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">
          Retrouvez ici l'historique complet de vos apprentissages et réalisations sur HardwarePC.
        </p>
      </section>

      {/* STATS RAPIDES */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4 lift-3d">
          <div className="flex items-center justify-between">
            <Activity className="w-4 h-4 text-muted" />
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-text">
            {activities.length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted mt-0.5">
            Activités totales
          </div>
        </div>
        <div className="card p-4 lift-3d">
          <div className="flex items-center justify-between">
            <BookOpen className="w-4 h-4 text-muted" />
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-text">
            {courseActivities.length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted mt-0.5">
            Cours terminés
          </div>
        </div>
        <div className="card p-4 lift-3d">
          <div className="flex items-center justify-between">
            <Target className="w-4 h-4 text-muted" />
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-text">
            {quizActivities.length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted mt-0.5">
            Quiz passés
          </div>
        </div>
        <div className="card p-4 lift-3d">
          <div className="flex items-center justify-between">
            <Trophy className="w-4 h-4 text-muted" />
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-text">
            {badgeActivities.length}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted mt-0.5">
            Badges débloqués
          </div>
        </div>
      </section>

      {/* LISTE D'HISTORIQUE */}
      <section className="module-frame anim-rise anim-rise-1">
        <h2 className="section-title mb-4">
          <Clock className="w-4 h-4 text-muted" /> Activité chronologique
        </h2>
        {activities.length === 0 ? (
          <p className="text-sm text-muted">Aucune activité enregistrée pour le moment.</p>
        ) : (
          <ul className="divide-y divide-border">
            {activities.map(activity => (
              <li key={activity.id} className="py-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg grid place-items-center bg-bg-elev">
                  <TYPE_ICON[activity.type] className="w-5 h-5 text-text" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text truncate max-w-xs">
                        {activity.label}
                      </span>
                      <span className="badge-muted text-[10px] uppercase tracking-wider">
                        {TYPE_LABEL[activity.type]}
                      </span>
                    </div>
                    {activity.score !== null && (
                      <span className="font-display font-semibold tabular-nums text-text">
                        {activity.score}<span className="text-muted text-xs">%</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted">
                    {formatRelative(activity.createdAt)}
                  </div>
                </div>
                {activity.url && (
                  <Link
                    href={activity.url}
                    className="mt-2 btn-outline w-fit text-[12px]"
                  >
                    Voir les détails
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ACTIVITÉ PAR TYPE */}
      <section className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Cours et Quiz */}
        <div className="card-depth p-5 anim-rise anim-rise-2">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted" /> Cours terminés
          </h3>
          {courseActivities.length === 0 ? (
            <p className="text-sm text-muted">Aucun cours terminé pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {courseActivities
                .slice(0, 10)
                .map(a => (
                  <li key={a.id} className="flex items-center justify-between py-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.label}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted">
                        {formatRelative(a.createdAt)}
                      </div>
                    </div>
                    {a.score !== null && (
                      <span className="font-display font-semibold tabular-nums text-text">
                        {a.score}<span className="text-muted text-xs">%</span>
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Examens et Entretiens */}
        <div className="card-depth p-5 anim-rise anim-rise-3">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted" /> Examens et entretiens
          </h3>
          {examAndInterviewActivities.length === 0 ? (
            <p className="text-sm text-muted">Aucun examen ou entretien pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {examAndInterviewActivities
                .slice(0, 10)
                .map(a => (
                  <li key={a.id} className="flex items-center justify-between py-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.label}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted">
                        {formatRelative(a.createdAt)}
                      </div>
                    </div>
                    {a.score !== null && (
                      <span className="font-display font-semibold tabular-nums text-text">
                        {a.score}<span className="text-muted text-xs">%</span>
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Diagnostics et Configurations */}
        <div className="card-depth p-5 anim-rise anim-rise-1">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-muted" /> Diagnostics et configurations
          </h3>
          {diagAndBuildActivities.length === 0 ? (
            <p className="text-sm text-muted">Aucun diagnostic ou configuration pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {diagAndBuildActivities
                .slice(0, 10)
                .map(a => (
                  <li key={a.id} className="flex items-center justify-between py-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.label}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted">
                        {formatRelative(a.createdAt)}
                      </div>
                    </div>
                    {a.score !== null && (
                      <span className="font-display font-semibold tabular-nums text-text">
                        {a.score}<span className="text-muted text-xs">%</span>
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Badges */}
        <div className="card-depth p-5 anim-rise anim-rise-2">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted" /> Badges débloqués
          </h3>
          {badgeActivities.length === 0 ? (
            <p className="text-sm text-muted">Aucun badge débloqué pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {badgeActivities
                .slice(0, 10)
                .map(a => (
                  <li key={a.id} className="flex items-center justify-between py-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.label}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted">
                        {formatRelative(a.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </section>
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