'use client';
import { createContext, useContext } from 'react';

const Ctx = createContext<{ username: string | null }>({ username: null });

export function SessionProvider({ children, username }: { children: React.ReactNode; username?: string | null }) {
  return <Ctx.Provider value={{ username: username ?? null }}>{children}</Ctx.Provider>;
}
export const useSession = () => useContext(Ctx);
