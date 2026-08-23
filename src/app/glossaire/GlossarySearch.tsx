'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

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
      <div className="card p-3 flex flex-wrap gap-2 items-center">
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
        <span className="text-xs text-text-mute ml-auto">{filtered.length} terme{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {groups.length === 0 ? (
        <div className="card p-6 text-center text-text-soft">Aucun terme ne correspond.</div>
      ) : (
        groups.map(([cat, list]) => (
          <section key={cat} className="space-y-2">
            <h2 className="section-title">{cat}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {list.map(t => (
                <details key={t.slug} className="card p-4 group">
                  <summary className="cursor-pointer flex items-center justify-between gap-2">
                    <span className="font-semibold">{t.term}</span>
                    <span className="badge bg-bg-elev border-border text-text-soft">{t.level}</span>
                  </summary>
                  <div className="mt-3 space-y-2 text-sm">
                    <p><span className="text-brand-cyan">Simple :</span> {t.simple}</p>
                    <p className="text-text-soft"><span className="text-brand-blue">Technique :</span> {t.technical}</p>
                    {t.example && <p className="text-text-mute italic">« {t.example} »</p>}
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
