import { Sidebar } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { MobileNav } from '@/components/shell/MobileNav';
import { SessionProvider } from '@/components/shell/SessionProvider';
import { getCurrentUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <SessionProvider username={user?.username ?? null} userId={user?.id ?? null}>
      <div className="min-h-screen flex bg-bg text-text">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
          <TopBar />
          <main className="flex-1 px-6 sm:px-10 py-10 pb-28 lg:pb-12 max-w-7xl w-full mx-auto">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </SessionProvider>
  );
}
