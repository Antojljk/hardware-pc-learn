'use client';
import React, { useState, useEffect } from 'react';
import { 
  Settings, BookOpen, Brain, Wrench, Library, Sparkles, 
  Users, UserPlus, MessageSquare, Trophy,
  TrendingUp, BarChart3, MousePointer2, Globe
} from 'lucide-react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminDashboardClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (e) {
        console.error('Failed to refresh stats:', e);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const {
    lessons, questions, exams, glossary, scenarios, components,
    userCount, planCounts, totalAiMessages, avgExamScore,
    newUsers24h, newUsers7d, newUsers30d, activeUsers24h,
    totalReviewCards, totalBadges, totalReviews, avgQuizScore,
    recentInterviews, recentDiagnostics,
    pv24h, uv24h, pv7d, uv7d, pv30d, uv30d, topPages
  } = data;

  const quickStats = [
    { label: 'Visites (24h)', value: pv24h, icon: MousePointer2, color: 'text-blue-500' },
    { label: 'Uniques (24h)', value: uv24h, icon: Users, color: 'text-green-500' },
    { label: 'Pages Vues (7j)', value: pv7d, icon: Globe, color: 'text-orange-500' },
    { label: 'Uniques (7j)', value: uv7d, icon: UserPlus, color: 'text-purple-500' },
  ];

  const contentItems = [
    { href: '/admin/cours',   icon: BookOpen, label: 'Cours', count: lessons, desc: 'Cours et parcours' },
    { href: '/admin/quiz',    icon: Brain,    label: 'Quiz', count: questions, desc: 'Banque de questions' },
    { href: '/admin/examens', icon: Sparkles, label: 'Examens', count: exams, desc: 'Examens blancs' },
    { href: '/admin/glossaire', icon: Library, label: 'Glossaire', count: glossary, desc: 'Termes techniques' },
    { href: '/admin/diagnostics', icon: Wrench, label: 'Diagnostics', count: scenarios, desc: 'Scénarios de panne' },
    { href: '/admin/composants', icon: Settings, label: 'Composants', count: components, desc: 'Catalogue composants' },
  ];

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Analytics & Fréquentation</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Settings className="w-6 h-6 text-text" /> Dashboard Administration
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Vue d&apos;ensemble en temps réel de l&apos;activité, du trafic et du contenu du site.</p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s, idx) => (
          <div key={s.label} className={`module-frame lift-3d anim-rise anim-rise-${(idx % 4) + 1} flex items-center gap-4 p-4`}>
            <div className={`w-12 h-12 rounded-2xl grid place-items-center bg-bg-elev border border-border ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="module-frame anim-rise anim-rise-1">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Fréquentation
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-bg-elev border border-border text-center">
                <div className="text-xs text-muted mb-1">Pages vues (30j)</div>
                <div className="text-xl font-display font-bold text-text">{pv30d}</div>
              </div>
               <div className="p-3 rounded-xl bg-bg-elev border border-border text-center">
                 <div className="text-xs text-muted mb-1">Uniques (30j)</div>
                 <div className="text-xl font-display font-bold text-text">{uv30d}</div>
               </div>
              <div className="p-3 rounded-xl bg-bg-elev border border-border text-center">
                <div className="text-xs text-muted mb-1">Moyenne / jour</div>
                <div className="text-xl font-display font-bold text-text">{(pv30d / 30).toFixed(1)}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Top 10 Pages Consultées</h3>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-bg-elev text-xs text-muted border-b border-border">
                    <tr>
                      <th className="p-2 font-medium">URL</th>
                      <th className="p-2 font-medium text-right">Vues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {topPages.map((p: { url: string; _count: { url: number } }) => (
                      <tr key={p.url} className="hover:bg-bg-elev/50">
                        <td className="p-2 font-mono text-xs">{p.url}</td>
                        <td className="p-2 text-right font-display font-semibold">{p._count.url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="module-frame anim-rise anim-rise-2">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Gestion du contenu
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {contentItems.map((i) => (
                <Link key={i.href} href={i.href} className="group p-3 rounded-xl border border-border hover:bg-bg-elev transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg grid place-items-center bg-bg-elev border border-border group-hover:border-text/30">
                      <i.icon className="w-4 h-4 text-text" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{i.label}</div>
                      <div className="text-[11px] text-muted">{i.desc}</div>
                    </div>
                  </div>
                  <div className="font-display text-lg font-bold tabular-nums">{i.count}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="module-frame anim-rise anim-rise-3">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Croissance
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-bg-elev border border-border">
                <span className="text-xs text-muted">Nouveaux (24h)</span>
                <span className="text-sm font-bold text-text">+{newUsers24h}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-bg-elev border border-border">
                <span className="text-xs text-muted">Nouveaux (7j)</span>
                <span className="text-sm font-bold text-text">+{newUsers7d}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-bg-elev border border-border">
                <span className="text-xs text-muted">Nouveaux (30j)</span>
                <span className="text-sm font-bold text-text">+{newUsers30d}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-bg-elev border border-border">
                <span className="text-xs text-muted">Actifs (24h)</span>
                <span className="text-sm font-bold text-text">{activeUsers24h}</span>
              </div>
            </div>
          </div>

          <section className="module-frame anim-rise anim-rise-4">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Performance
            </h2>
            <ul className="text-sm space-y-3 text-muted">
              <li className="flex justify-between">
                <span>Score moyen Examens</span>
                <strong className="text-text">{avgExamScore?._avg?.score?.toFixed(1) ?? '0'}%</strong>
              </li>
              <li className="flex justify-between">
                <span>Score moyen Quiz</span>
                <strong className="text-text">{avgQuizScore?._avg?.score?.toFixed(1) ?? '0'}%</strong>
              </li>
              <li className="flex justify-between">
                <span>Badges débloqués</span>
                <strong className="text-text">{totalBadges}</strong>
              </li>
              <li className="flex justify-between">
                <span>Cartes de révision</span>
                <strong className="text-text">{totalReviewCards}</strong>
              </li>
              <li className="flex justify-between">
                <span>Avis clients</span>
                <strong className="text-text">{totalReviews}</strong>
              </li>
            </ul>
          </section>

          <section className="module-frame anim-rise anim-rise-4">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Répartition Plans
            </h2>
            <div className="space-y-2">
               {planCounts.map((p: { plan: string; _count: { _all: number } }) => (
                <div key={p.plan} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-20">{p.plan}</span>
                  <div className="flex-1 h-2 bg-bg-elev rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full bg-text" 
                      style={{ width: `${(p._count._all / userCount) * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums w-8 text-right">{p._count._all}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="module-frame anim-rise anim-rise-1">
            <h2 className="section-title mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> IA & Support
            </h2>
            <div className="p-3 rounded-xl bg-bg-elev border border-border">
              <div className="text-xs text-muted mb-1">Messages Tuteur total</div>
              <div className="text-2xl font-display font-bold tabular-nums text-text">
                {totalAiMessages?._sum.count ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 rounded-lg border border-border text-center">
                <div className="text-[10px] text-muted">Entretiens (7j)</div>
                <div className="text-sm font-bold tabular-nums">{recentInterviews}</div>
              </div>
              <div className="p-2 rounded-lg border border-border text-center">
                <div className="text-[10px] text-muted">Diagnostics (7j)</div>
                <div className="text-sm font-bold tabular-nums">{recentDiagnostics}</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
