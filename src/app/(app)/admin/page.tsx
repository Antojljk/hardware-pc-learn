import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Settings, BookOpen, Brain, Wrench, Library, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Admin — HardwarePC' };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  // Mini interface admin : vue d'ensemble des contenus (lecture seule)
  const [tracks, lessons, questions, exams, glossary, scenarios, components] = await Promise.all([
    prisma.track.count(),
    prisma.lesson.count(),
    prisma.quizQuestion.count(),
    prisma.exam.count(),
    prisma.glossaryTerm.count(),
    prisma.diagnosticScenario.count(),
    prisma.component.count(),
  ]);

  const items = [
    { href: '/admin/cours',   icon: BookOpen,         label: 'Cours',           count: lessons,      desc: 'Cours et parcours' },
    { href: '/admin/quiz',    icon: Brain,            label: 'Quiz',            count: questions,    desc: 'Banque de questions' },
    { href: '/admin/examens', icon: Sparkles,         label: 'Examens',         count: exams,        desc: 'Examens blancs' },
    { href: '/admin/glossaire', icon: Library,        label: 'Glossaire',       count: glossary,     desc: 'Termes techniques' },
    { href: '/admin/diagnostics', icon: Wrench,       label: 'Diagnostics',     count: scenarios,    desc: 'Scénarios de panne' },
    { href: '/admin/composants',  icon: Settings,     label: 'Composants',      count: components,   desc: 'Catalogue composants' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-brand-blue" /> Administration</h1>
        <p className="text-text-soft text-sm">Pilotage du contenu pédagogique (lecture seule — édition via fichiers <code className="text-xs">src/content/*</code>).</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(i => (
          <Link key={i.href} href={i.href} className="card card-hover p-5">
            <div className="flex items-center gap-2 mb-1">
              <i.icon className="w-4 h-4 text-brand-blue" />
              <h2 className="font-semibold">{i.label}</h2>
            </div>
            <div className="text-2xl font-bold mb-1">{i.count}</div>
            <p className="text-xs text-text-soft">{i.desc}</p>
          </Link>
        ))}
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-3">Statistiques globales</h2>
        <ul className="text-sm space-y-1 text-text-soft">
          <li>Parcours : <strong>{tracks}</strong></li>
          <li>Cours : <strong>{lessons}</strong></li>
          <li>Questions : <strong>{questions}</strong></li>
          <li>Examens : <strong>{exams}</strong></li>
          <li>Termes : <strong>{glossary}</strong></li>
          <li>Scénarios : <strong>{scenarios}</strong></li>
          <li>Composants : <strong>{components}</strong></li>
        </ul>
      </section>
    </div>
  );
}
