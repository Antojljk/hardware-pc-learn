'use client';

import { useEffect, useState } from 'react';

interface MobileNavProps {
  /** Sélecteur CSS de la liste de liens à ouvrir/fermer. */
  linksSelector?: string;
}

/**
 * Implémentation React du menu mobile issu du HTML 8B.
 * - Toggle aria-expanded sur le bouton hamburger
 * - Ajout/retrait de la classe `is-open` sur la liste
 * - Body scroll lock quand ouvert
 * - Fermeture au clic sur un lien de la liste
 * - Fermeture à Escape
 */
export function MobileNav({ linksSelector = '#l-nav-links' }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const links = document.querySelector(linksSelector);
    if (!links) return;

    links.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    const onLinkClick = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', onLinkClick);
    });
    document.addEventListener('keydown', onKey);

    return () => {
      links.querySelectorAll('a').forEach((a) => {
        a.removeEventListener('click', onLinkClick);
      });
      document.removeEventListener('keydown', onKey);
    };
  }, [open, linksSelector]);

  return (
    <button
      type="button"
      className="l-nav-toggle"
      aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-controls="l-nav-links"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      {open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )}
    </button>
  );
}
