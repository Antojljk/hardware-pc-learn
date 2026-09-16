'use client';
import { useEffect, useState } from 'react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === null) setVisible(true);
  }, []);

  const handleConsent = (choice: 'accepted' | 'refused') => {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] max-w-4xl mx-auto">
      <div className="bg-bg-elev border border-border p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted text-center sm:text-left">
          Nous utilisons des cookies pour améliorer votre expérience. 
          En cliquant sur &quot;Accepter&quot;, vous consentez à leur utilisation.
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => handleConsent('refused')} className="px-4 py-2 text-xs font-medium text-muted hover:text-text transition-colors">
            Refuser
          </button>
          <button onClick={() => handleConsent('accepted')} className="btn-primary px-4 py-2 text-xs">
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
