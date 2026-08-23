import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { InterviewRunner } from './InterviewRunner';

export default async function InterviewSessionPage({ params }: { params: { role: string; level: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  return <InterviewRunner role={params.role} level={params.level} />;
}
