// src/lib/rate-limit.ts
//
// Rate limiter en mémoire — première couche de protection.
//
// AVERTISSEMENT
// Cette implémentation repose sur une `Map` en mémoire du processus Node.js.
// Elle ne partage donc aucun état entre :
//   - plusieurs instances / pods du serveur,
//   - plusieurs régions,
//   - plusieurs exécutions serverless (ex. Vercel : chaque lambda a sa propre mémoire,
//     et la mémoire est détruite à chaque cold start).
//
// En conséquence, en environnement serverless / multi-instance (Vercel, AWS Lambda,
// Kubernetes avec HPA, etc.), cette protection est uniquement indicative et peut
// être contournée en distribuant les requêtes entre instances.
//
// Pour une protection robuste en production, faire évoluer ce module vers un
// rate limiter distribué (Redis + `@upstash/ratelimit`, Redis classique, ou
// équivalent). L'interface publique `checkRateLimit` est volontairement simple
// pour permettre cette migration sans modifier le code appelant.

export interface RateLimitOptions {
  /** Nombre maximal de tentatives autorisées dans la fenêtre. */
  limit: number;
  /** Taille de la fenêtre glissante, en millisecondes. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Tentatives restantes dans la fenêtre courante. */
  remaining: number;
  /** Secondes à attendre avant de pouvoir réessayer (0 si ok). */
  retryAfterSeconds: number;
}

interface BucketEntry {
  /** Timestamps (ms) des tentatives, dans la fenêtre courante. */
  hits: number[];
}

/**
 * Buckets en mémoire, indexés par clé (ex. `${ip}:${action}`).
 * Volontairement non exporté : l'accès passe par `checkRateLimit` / `resetRateLimit`.
 */
const buckets = new Map<string, BucketEntry>();

// Nettoyage opportuniste des buckets expirés, déclenché à la demande depuis
// `checkRateLimit()`. Pas de timer global : évite tout travail inutile dans
// les environnements serverless (Vercel, AWS Lambda) où le module est importé
// à chaque cold start. Aucune valeur sensible n'est loguée.
let lastCleanupAt = 0;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function cleanupIfDue(now: number): void {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  lastCleanupAt = now;
  for (const [key, entry] of buckets) {
    // Si tous les hits sont expirés, on peut supprimer l'entrée.
    if (entry.hits.every((t) => now - t > 0)) {
      buckets.delete(key);
    }
  }
}

/**
 * Vérifie et incrémente le compteur pour la clé donnée.
 *
 * - Si la limite est dépassée, retourne `{ ok: false, retryAfterSeconds > 0 }`.
 * - Sinon, enregistre le hit et retourne `{ ok: true, remaining }`.
 *
 * Le calcul repose sur une fenêtre glissante : on compte les hits dont le
 * timestamp est encore dans `[now - windowMs, now]`.
 */
export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  cleanupIfDue(now);
  const windowStart = now - opts.windowMs;

  const entry = buckets.get(key) ?? { hits: [] };

  // On retire les hits hors fenêtre.
  entry.hits = entry.hits.filter((t) => t > windowStart);

  if (entry.hits.length >= opts.limit) {
    // Le plus ancien hit dans la fenêtre détermine quand la limite se libère.
    const oldest = entry.hits[0];
    const retryAfterMs = Math.max(0, oldest + opts.windowMs - now);
    buckets.set(key, entry);
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  entry.hits.push(now);
  buckets.set(key, entry);

  return {
    ok: true,
    remaining: opts.limit - entry.hits.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Réinitialise le compteur associé à une clé (ex. après une connexion réussie).
 * À utiliser avec parcimonie — ne reset que les compteurs explicitement nommés.
 */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
