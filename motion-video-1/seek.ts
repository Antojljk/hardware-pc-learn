/**
 * seek(t) — Fonction déterministe qui retourne l'état complet de la vidéo à l'instant t
 * Basé sur beatmap.json (120 BPM, 30s, 9 phases)
 * Utilisé pour : validation stills + render final 60fps
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const BEATMAP = JSON.parse(readFileSync(join(__dirname, 'beatmap.json'), 'utf-8'));

export type PhaseId =
  | 'hook' | 'tagline' | 'problem' | 'solution'
  | 'modules' | 'diff' | 'stats' | 'cta' | 'loop';

export interface SeekState {
  t: number;
  phase: PhaseId;
  phaseProgress: number;      // 0-1 dans la phase courante
  globalProgress: number;     // 0-1 sur toute la vidéo
  beat: number;               // beat courant (0-60)
  elements: {
    // Hook phase
    logo: { scale: number; opacity: number; charProgress: number; glitch: number };
    tagline: { opacity: number; y: number; charProgress: number };
    // Problem phase
    pcParts: { cpu: PartState; gpu: PartState; ram: PartState; ssd: PartState };
    problemText: { opacity: number };
    // Solution phase
    dashboard: { xpFill: number; levelPop: number; badgePop: number; streakFlame: number };
    solutionText: { opacity: number; line: number };
    // Modules phase (4 flip cards)
    cards: Array<{ rotationY: number; opacity: number; content: string }>;
    // Diff phase
    splitScreen: { sliderPos: number; beforeOpacity: number; afterOpacity: number };
    diffText: { opacity: number };
    // Stats phase
    counters: Array<{ value: number; target: number; label: string }>;
    // CTA phase
    ctaButton: { scale: number; pulse: number; opacity: number };
    qrCode: { opacity: number; scale: number };
    ctaText: { opacity: number; charProgress: number };
    // Loop phase
    loopFade: number;
  };
}

interface PartState {
  x: number; y: number; scale: number; rotation: number; opacity: number;
}

// Easing functions
const ease = {
  expoOut: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  expoIn: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  backOut: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  cubicOut: (t: number) => 1 - Math.pow(1 - t, 3),
  elasticOut: (t: number) => {
    if (t === 0) return 0; if (t === 1) return 1;
    const p = 0.3; return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  }
};

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(t: number) { return t * t * (3 - 2 * t); }

function getPhase(t: number): { phase: PhaseId; progress: number; beat: number } {
  const totalDuration = BEATMAP.totalDuration;
  const clampedT = clamp(t, 0, totalDuration);
  const beat = clampedT / BEATMAP.beatDuration;

  for (const p of BEATMAP.phases) {
    if (clampedT >= p.startTime && clampedT < p.endTime) {
      const progress = (clampedT - p.startTime) / (p.endTime - p.startTime);
      return { phase: p.id as PhaseId, progress: clamp(progress, 0, 1), beat };
    }
  }
  // Last frame = loop phase end
  const lastPhase = BEATMAP.phases[BEATMAP.phases.length - 1];
  return { phase: lastPhase.id as PhaseId, progress: 1, beat };
}

export function seek(t: number): SeekState {
  const { phase, phaseProgress, beat } = getPhase(t);
  const globalProgress = clamp(t / BEATMAP.totalDuration, 0, 1);

  // Default element states
  const elements: SeekState['elements'] = {
    logo: { scale: 0, opacity: 0, charProgress: 0, glitch: 0 },
    tagline: { opacity: 0, y: 30, charProgress: 0 },
    pcParts: {
      cpu: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      gpu: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      ram: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      ssd: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
    },
    problemText: { opacity: 0 },
    dashboard: { xpFill: 0, levelPop: 0, badgePop: 0, streakFlame: 0 },
    solutionText: { opacity: 0, line: 0 },
    cards: [
      { rotationY: 90, opacity: 0, content: 'cours' },
      { rotationY: 90, opacity: 0, content: 'quiz' },
      { rotationY: 90, opacity: 0, content: 'diagnostic' },
      { rotationY: 90, opacity: 0, content: 'constructeur' },
    ],
    splitScreen: { sliderPos: 0, beforeOpacity: 1, afterOpacity: 0 },
    diffText: { opacity: 0 },
    counters: [
      { value: 0, target: 2400, label: 'apprenants' },
      { value: 0, target: 130, label: 'termes' },
      { value: 0, target: 10, label: 'scénarios' },
      { value: 0, target: 4, label: 'niveaux' },
    ],
    ctaButton: { scale: 1, pulse: 0, opacity: 0 },
    qrCode: { opacity: 0, scale: 0.8 },
    ctaText: { opacity: 0, charProgress: 0 },
    loopFade: 0,
  };

  // Phase-specific animations
  switch (phase) {
    case 'hook': {
      // 0-2s : Logo kinetic type + glitch
      const p = ease.expoOut(phaseProgress);
      elements.logo.scale = lerp(0.5, 1, p);
      elements.logo.opacity = p;
      elements.logo.charProgress = p;
      elements.logo.glitch = Math.sin(phaseProgress * Math.PI * 8) * 0.1 * (1 - p);
      break;
    }

    case 'tagline': {
      // 2-4s : Tagline reveal
      elements.logo.scale = 1;
      elements.logo.opacity = 1;
      elements.logo.charProgress = 1;
      elements.logo.glitch = 0;

      const p = ease.expoOut(phaseProgress);
      elements.tagline.opacity = p;
      elements.tagline.y = lerp(30, 0, p);
      elements.tagline.charProgress = p;
      break;
    }

    case 'problem': {
      // 4-7s : PC parts float & disassemble
      elements.logo.opacity = lerp(1, 0, phaseProgress);
      elements.tagline.opacity = lerp(1, 0, phaseProgress);

      const p = ease.expoOut(phaseProgress);
      elements.problemText.opacity = p;

      // Parts explode from center
      const explode = ease.expoIn(phaseProgress);
      const float = Math.sin(t * 2) * 0.05;
      elements.pcParts.cpu = {
        x: -120 * explode + float, y: -80 * explode,
        scale: lerp(1, 0.6, explode), rotation: -0.3 * explode, opacity: 1
      };
      elements.pcParts.gpu = {
        x: 120 * explode + float, y: -80 * explode,
        scale: lerp(1, 0.6, explode), rotation: 0.3 * explode, opacity: 1
      };
      elements.pcParts.ram = {
        x: -100 * explode + float, y: 80 * explode,
        scale: lerp(1, 0.6, explode), rotation: -0.2 * explode, opacity: 1
      };
      elements.pcParts.ssd = {
        x: 100 * explode + float, y: 80 * explode,
        scale: lerp(1, 0.6, explode), rotation: 0.2 * explode, opacity: 1
      };
      break;
    }

    case 'solution': {
      // 7-11s : Dashboard animate in
      elements.problemText.opacity = lerp(1, 0, phaseProgress);
      // Parts fade out
      const fadeOut = ease.expoIn(phaseProgress);
      Object.keys(elements.pcParts).forEach(k => elements.pcParts[k as keyof typeof elements.pcParts].opacity = 1 - fadeOut);

      const p = ease.expoOut(phaseProgress);
      elements.dashboard.xpFill = p;
      elements.dashboard.levelPop = ease.backOut(clamp((phaseProgress - 0.3) / 0.7, 0, 1));
      elements.dashboard.badgePop = ease.backOut(clamp((phaseProgress - 0.5) / 0.5, 0, 1));
      elements.dashboard.streakFlame = ease.elasticOut(clamp((phaseProgress - 0.7) / 0.3, 0, 1));

      elements.solutionText.opacity = p;
      elements.solutionText.line = phaseProgress > 0.5 ? 1 : 0;
      break;
    }

    case 'modules': {
      // 11-17s : 4 flip cards staggered
      elements.solutionText.opacity = lerp(1, 0, phaseProgress);

      // Each card flips in sequence (1.5s each)
      const cardDuration = 1.5;
      const stagger = 0; // We handle stagger via keyframes timing

      elements.cards.forEach((card, i) => {
        const cardStart = 11 + i * 1.5; // 11, 12.5, 14, 15.5
        const cardEnd = cardStart + 1.5;
        if (t >= cardStart && t < cardEnd) {
          const cp = ease.cubicOut((t - cardStart) / cardDuration);
          card.rotationY = lerp(90, 0, cp);
          card.opacity = cp;
        } else if (t >= cardEnd) {
          card.rotationY = 0;
          card.opacity = 1;
          // Subtle hover animation
          card.rotationY = Math.sin(t * 3) * 3;
        }
      });
      break;
    }

    case 'diff': {
      // 17-21s : Split screen before/after
      const p = ease.expoOut(phaseProgress);
      elements.splitScreen.sliderPos = p; // 0 = full before, 1 = full after
      elements.splitScreen.beforeOpacity = 1;
      elements.splitScreen.afterOpacity = 1;
      elements.diffText.opacity = p;
      break;
    }

    case 'stats': {
      // 21-25s : Counters count up
      const p = ease.expoOut(phaseProgress);
      elements.diffText.opacity = lerp(1, 0, phaseProgress);

      elements.counters.forEach(c => {
        c.value = Math.round(lerp(0, c.target, p));
      });
      break;
    }

    case 'cta': {
      // 25-28s : Button pulse + QR code
      const p = ease.expoOut(phaseProgress);
      elements.ctaButton.opacity = p;
      elements.ctaButton.scale = 1 + Math.sin(t * 8) * 0.05 * p; // Pulse
      elements.ctaButton.pulse = Math.sin(t * 8) * 0.5 + 0.5;

      elements.qrCode.opacity = p;
      elements.qrCode.scale = lerp(0.8, 1, ease.backOut(p));

      elements.ctaText.opacity = p;
      elements.ctaText.charProgress = p;
      break;
    }

    case 'loop': {
      // 28-30s : Fade to first frame (loop)
      const p = ease.expoIn(phaseProgress);
      elements.loopFade = p;
      // Fade everything out
      Object.keys(elements).forEach(k => {
        if (typeof elements[k as keyof typeof elements] === 'object' && elements[k as keyof typeof elements] !== null) {
          const el = elements[k as keyof typeof elements] as Record<string, number>;
          if (el.opacity !== undefined) el.opacity *= (1 - p);
        }
      });
      break;
    }
  }

  return {
    t,
    phase,
    phaseProgress,
    globalProgress,
    beat,
    elements,
  };
}

// Helper pour générer les stills de validation
export const VALIDATION_TIMES = [0, 7, 15, 25]; // Hook, Solution, Modules, CTA

export function generateValidationFrames(): Array<{ time: number; state: SeekState }> {
  return VALIDATION_TIMES.map(time => ({ time, state: seek(time) }));
}

// Export pour Node/Playwright
if (require.main === module) {
  const frames = generateValidationFrames();
  console.log('Validation frames:');
  frames.forEach(f => {
    console.log(`\n=== t=${f.time}s (phase: ${f.state.phase}, progress: ${(f.state.phaseProgress*100).toFixed(0)}%) ===`);
    console.log(JSON.stringify(f.state.elements, null, 2));
  });
}