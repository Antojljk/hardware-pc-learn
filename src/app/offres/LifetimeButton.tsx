'use client'

import React from 'react';

export default function LifetimeButton() {
  return (
    <button
      onClick={async () => {
        const res = await fetch('/api/stripe/lifetime', { method: 'POST' });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }}
      className="btn-primary w-full text-center bg-yellow-600 hover:bg-yellow-500 border-none text-black font-bold"
    >
      Acheter a vie - 499EUR
    </button>
  );
}
