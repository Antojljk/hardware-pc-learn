import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { Library, BookOpen, ListChecks, History } from 'lucide-react';
import { GlossarySearch } from './GlossarySearch';

export const metadata: Metadata = {
  title: 'Glossaire Hardware PC — Définitions techniques',
  description: 'Le glossaire complet du hardware informatique : définitions simples et techniques pour maîtriser les composants PC.',
};

export const dynamic = 'force-dynamic';

export default async function GlossaryPage({ searchParams }: { searchParams: { q?: string } }) {
  const terms = await prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' } });
  const formatted = terms.map(t => ({
    slug: t.slug,
    term: t.term,
    simple: t.simple,
    technical: t.technical,
    example: t.example,
    level: t.level,
    categories: t.categories,
  }));

  const categoriesSet = new Set<string>();
  terms.forEach(t => t.categories.split(',').forEach(c => c.trim() && categoriesSet.add(c.trim())));
  const categories = Array.from(categoriesSet).sort();

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="module-eyebrow flex items-center gap-2">
              <Library className="w-3.5 h-3.5" /> Référence
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Glossaire
            </h1>
            <p className="text-muted text-[15px] max-w-xl leading-relaxed">
              Termes techniques expliqués simplement et en détail.
              Recherche par mot-clé ou filtre par niveau.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[360px]">
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <BookOpen className="w-3.5 h-3.5" /> Termes
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {terms.length}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elev/70 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ListChecks className="w-3.5 h-3.5" /> Catégories
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                {categories.length}
              </div>
            </div>
            <div className="rounded-2xl border border-text/30 bg-text/8 backdrop-blur p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <History className="w-3.5 h-3.5" /> Niveaux
              </div>
              <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-text">
                4
              </div>
            </div>
          </div>
        </div>
      </section>

      <GlossarySearch terms={formatted} initial={searchParams.q || ''} />
    </div>
  );
}
