'use client';
import { createContext, useContext } from 'react';

const Ctx = createContext<{ username: string | null; userId: string | null }>({ username: null, userId: null });

export function SessionProvider({ children, username, userId }: { children: React.ReactNode; username?: string | null; userId?: string | null }) {
  return <Ctx.Provider value={{ username: username ?? null, userId: userId ?? null }}>{children}</Ctx.Provider>;
}
export const useSession = () => useContext(Ctx);
