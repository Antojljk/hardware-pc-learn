'use client';
import React, { useEffect } from 'react';
// @ts-expect-error: animejs default export issue
import anime from 'animejs';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    anime({
      targets: '.page-transition-wrapper',
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutQuad',
    });
  }, [pathname]);

  return (
    <div className="page-transition-wrapper" style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
