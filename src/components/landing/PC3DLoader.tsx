'use client';
import dynamic from 'next/dynamic';

const PC3DSection = dynamic(
  () => import('./PC3DSection').then((m) => ({ default: m.PC3DSection })),
  {
    ssr: false,
    loading: () => <div className="l-s3d-placeholder" aria-hidden="true" />,
  }
);

export function PC3DLoader() {
  return <PC3DSection />;
}
