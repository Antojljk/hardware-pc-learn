import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserActivities, ActivityType } from '@/lib/history';
import React from 'react';
import {
  Activity,
  BookOpen,
  Target,
  Layers,
  MessageSquareQuote,
  Wrench,
  Sparkles,
  Trophy,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const metadata = { title: 'Historique — HardwarePC' };

const TYPE_ICON: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  course: BookOpen,
  quiz: Target,
  exam: Layers,
  interview: MessageSquareQuote,
  diagnostic: Wrench,
  build: Sparkles,
  badge: Trophy,
};

const TYPE_LABEL: Record<ActivityType, string> = {
  course: 'Cours terminé',
  quiz: 'Quiz passé',
  exam: 'Examen passé',
  interview: 'Entretien réalisé',
  diagnostic: 'Diagnostic réalisé',
  build: 'Configuration créée',
  badge: 'Badge débloqué',
};

export default async function HistoriquePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');

  const activities = await getUserActivities(user.id);

  return (
    <div className="space-y-6 max-w-4xl">
      <h1>Test</h1>
    </div>
  );
}