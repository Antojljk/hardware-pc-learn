import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SCENARIO_STEPS } from '@/content/diagnostics';
import { DiagnosticRunner } from './DiagnosticRunner';

export default async function DiagnosticPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  const scenario = await prisma.diagnosticScenario.findUnique({ where: { slug: params.slug } });
  if (!scenario) notFound();

  let parsed: { idealSequence: string[]; optionalAcceptable: string[]; wrongMoves: string[]; rootCause: string; solution: string } = { idealSequence: [], optionalAcceptable: [], wrongMoves: [], rootCause: '', solution: '' };
  try { parsed = JSON.parse(scenario.steps); } catch { /* ignore */ }
  let symptoms: string[] = [];
  try { symptoms = JSON.parse(scenario.symptoms); } catch { /* ignore */ }

  return (
    <DiagnosticRunner
      slug={scenario.slug}
      title={scenario.title}
      symptoms={symptoms}
      steps={SCENARIO_STEPS}
      idealSequence={parsed.idealSequence}
      optionalAcceptable={parsed.optionalAcceptable}
      wrongMoves={parsed.wrongMoves}
      rootCause={parsed.rootCause}
      solution={parsed.solution}
    />
  );
}
