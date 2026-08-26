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
      <header>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-text flex items-center gap-3">
          <Library className="w-6 h-6 text-accent" /> Glossaire
        </h1>
        <p className="text-muted mt-2 text-[15px]">{terms.length} termes techniques expliqués simplement et en détail.</p>
      </header>

      <GlossarySearch terms={formatted} initial={searchParams.q || ''} />
    </div>
  );
}
