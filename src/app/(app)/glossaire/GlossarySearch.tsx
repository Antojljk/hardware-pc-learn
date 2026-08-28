'use client';

import { useMemo, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';

type Term = {
  slug: string;
  term: string;
  simple: string;
  technical: string;
  example: string | null;
  level: string;
  categories: string;
};

export function GlossarySearch({ terms, initial }: { terms: Term[]; initial: string }) {
  const [q, setQ] = useState(initial);
  const [level, setLevel] = useState<string>('all');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return terms.filter(t => {
      if (level !== 'all' && t.level !== level) return false;
      if (!needle) return true;
      return (
        t.term.toLowerCase().includes(needle) ||
        t.simple.toLowerCase().includes(needle) ||
        t.technical.toLowerCase().includes(needle) ||
        t.categories.toLowerCase().includes(needle)
      );
    });
  }, [terms, q, level]);

  const groups = useMemo(() => {
    const m: Record<string, Term[]> = {};
    for (const t of filtered) {
      const c = t.categories.split(',')[0] || 'Autre';
      (m[c] ||= []).push(t);
    }
    return Object.entries(m).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <>
      <div className="module-frame anim-rise anim-rise-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un terme (ex : VRM, DDR5, NVMe)"
              className="input pl-9"
            />
          </div>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="input max-w-[180px]">
            <option value="all">Tous niveaux</option>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
            <option value="expert">Expert</option>
          </select>
          <span className="badge-muted tabular-nums">
            {filtered.length} terme{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="module-frame text-center text-muted anim-rise">
          Aucun terme ne correspond à ta recherche.
        </div>
      ) : (
        groups.map(([cat, list]) => (
          <section key={cat} className="space-y-3 anim-rise anim-rise-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted" /> {cat}
              </h2>
              <span className="badge-muted tabular-nums">{list.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {list.map(t => (
                <details key={t.slug} className="card-depth relative overflow-hidden lift-3d group p-5">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-3xl"
                    style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)' }}
                  />
                  <summary className="relative cursor-pointer flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-text">{t.term}</span>
                    <span className="badge-muted capitalize shrink-0">{t.level}</span>
                  </summary>
                  <div className="relative mt-3 space-y-2.5 text-sm">
                    <div className="rounded-xl border border-border bg-bg-elev/60 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Simple</div>
                      <p className="text-text">{t.simple}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-bg-elev/60 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Technique</div>
                      <p className="text-text-soft">{t.technical}</p>
                    </div>
                    {t.example && (
                      <div className="rounded-xl border border-border bg-bg-elev/40 p-3 italic text-muted">
                        « {t.example} »
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
