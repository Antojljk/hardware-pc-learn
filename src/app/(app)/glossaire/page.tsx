import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Library } from 'lucide-react';
import { GlossarySearch } from './GlossarySearch';

export const dynamic = 'force-dynamic';

export default async function GlossaryPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

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

  return (
    <div className="space-y-6">
      <section className="module-hero">
        <div className="module-eyebrow">Référence</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Library className="w-6 h-6 text-text" /> Glossaire
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">{terms.length} termes techniques expliqués simplement et en détail.</p>
      </section>

      <GlossarySearch terms={formatted} initial={searchParams.q || ''} />
    </div>
  );
}
