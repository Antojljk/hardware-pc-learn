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
      <section className="module-hero">
        <div className="module-eyebrow">Pilotage</div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-2 mt-2">
          <Settings className="w-6 h-6 text-text" /> Administration
        </h1>
        <p className="text-muted text-[15px] mt-2 max-w-xl">Pilotage du contenu pédagogique (lecture seule — édition via fichiers <code className="text-xs">src/content/*</code>).</p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((i, idx) => (
          <Link key={i.href} href={i.href} className={`module-frame lift-3d group anim-rise anim-rise-${(idx % 4) + 1}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl grid place-items-center bg-bg-elev border border-border">
                <i.icon className="w-4 h-4 text-text" />
              </div>
              <h2 className="font-semibold">{i.label}</h2>
            </div>
            <div className="font-display text-2xl font-semibold tabular-nums mb-1">{i.count}</div>
            <p className="text-xs text-muted">{i.desc}</p>
          </Link>
        ))}
      </section>

      <section className="module-frame anim-rise anim-rise-4">
        <h2 className="section-title mb-3">Statistiques globales</h2>
        <ul className="text-sm space-y-1.5 text-muted">
          <li>Parcours : <strong className="text-text">{tracks}</strong></li>
          <li>Cours : <strong className="text-text">{lessons}</strong></li>
          <li>Questions : <strong className="text-text">{questions}</strong></li>
          <li>Examens : <strong className="text-text">{exams}</strong></li>
          <li>Termes : <strong className="text-text">{glossary}</strong></li>
          <li>Scénarios : <strong className="text-text">{scenarios}</strong></li>
          <li>Composants : <strong className="text-text">{components}</strong></li>
        </ul>
      </section>
    </div>
  );
}
