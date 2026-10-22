'use client';
import dynamic from 'next/dynamic';

export const PC3DLoader = dynamic(
  () => import('./PC3DSection').then((m) => ({ default: m.PC3DSection })),
  { ssr: false }
);
