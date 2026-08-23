import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Library, Search } from 'lucide-react';
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
        <h1 className="text-2xl font-bold flex items-center gap-2"><Library className="w-5 h-5 text-brand-blue" /> Glossaire</h1>
        <p className="text-text-soft text-sm">{terms.length} termes techniques expliqués simplement et en détail.</p>
      </header>

      <GlossarySearch terms={formatted} initial={searchParams.q || ''} />
    </div>
  );
}
