import { prisma } from '@/lib/prisma';
import { TechnicienModeClient } from './TechnicienModeClient';
import { getCurrentUser } from '@/lib/auth';

export default async function TechnicienModePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const scenarios = await prisma.diagnosticScenario.findMany();
  
  const difficultyCount = {
    facile: await prisma.diagnosticScenario.count({ where: { difficulty: 'facile' } }),
    moyen: await prisma.diagnosticScenario.count({ where: { difficulty: 'moyen' } }),
    difficile: await prisma.diagnosticScenario.count({ where: { difficulty: 'difficile' } }),
  };

  return (
    <TechnicienModeClient 
      scenarios={scenarios} 
      difficultyCount={difficultyCount} 
    />
  );
}
