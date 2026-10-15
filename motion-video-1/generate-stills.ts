/**
 * Génère 4 fichiers HTML statiques pour validation visuelle
 * t=0s (Hook), t=7s (Solution), t=15s (Modules), t=25s (CTA)
 */

import { seek, generateValidationFrames } from './seek.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(__dirname, 'stills');
mkdirSync(OUTPUT_DIR, { recursive: true });

// Couleurs brand
const COLORS = {
  bg: '#080B14',
  cyan: '#22d3ee',
  amber: '#eab308',
  white: '#ffffff',
  muted: '#9ca3af',
  cardBg: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
};

function css(value: number, unit = 'px') { return `${value}${unit}`; }
function pct(value: number) { return `${(value * 100).toFixed(1)}%`; }

function renderFrame(frame: { time: number; state: ReturnType<typeof seek> }): string {
  const { time, state } = frame;
  const el = state.elements;

  // Canvas 9:16 = 1080x1920
  const W = 1080, H = 1920;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>HardwarePC Motion - Still t=${time}s</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${W}px; height: ${H}px;
      background: ${COLORS.bg};
      color: ${COLORS.white};
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      overflow: hidden;
      position: relative;
    }
    .frame { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(48px, 8vw, 96px); letter-spacing: -0.02em; line-height: 1; }
    .tagline { font-size: clamp(20px, 3.5vw, 32px); font-weight: 400; color: ${COLORS.muted}; text-align: center; max-width: 800px; }
    .problem-text { font-size: clamp(18px, 3vw, 28px); text-align: center; max-width: 700px; line-height: 1.4; }
    .solution-text { font-size: clamp(18px, 3vw, 28px); text-align: center; max-width: 700px; line-height: 1.5; color: ${COLORS.cyan}; }
    .diff-text { font-size: clamp(18px, 3vw, 28px); text-align: center; max-width: 700px; line-height: 1.5; }
    .stat { text-align: center; }
    .stat-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(48px, 8vw, 80px); color: ${COLORS.cyan}; line-height: 1; }
    .stat-label { font-size: clamp(14px, 2.5vw, 20px); color: ${COLORS.muted}; margin-top: 8px; }
    .cta-btn { background: ${COLORS.cyan}; color: #001818; font-weight: 600; font-size: clamp(16px, 3vw, 24px); padding: 16px 48px; border-radius: 8px; border: none; cursor: pointer; }
    .qr-code { width: 120px; height: 120px; background: ${COLORS.white}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: ${COLORS.bg}; }
    .cta-url { font-size: clamp(14px, 2.5vw, 18px); color: ${COLORS.muted}; margin-top: 16px; font-family: monospace; }
    .cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 90%; max-width: 900px; }
    .card { aspect-ratio: 1; background: ${COLORS.cardBg}; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transform-style: preserve-3d; perspective: 1000px; }
    .card-inner { width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
    .card-face { position: absolute; inset: 0; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card-front { background: ${COLORS.cardBg}; }
    .card-back { background: ${COLORS.cyan}15; color: ${COLORS.cyan}; transform: rotateY(180deg); }
    .card-icon { font-size: 48px; margin-bottom: 16px; }
    .card-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 24px; margin-bottom: 8px; }
    .card-desc { font-size: 14px; color: ${COLORS.muted}; max-width: 200px; }
    .pc-part { position: absolute; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; font-size: 48px; transition: transform 0.6s, opacity 0.6s; }
    .dashboard-mock { width: 90%; max-width: 900px; aspect-ratio: 16/9; background: ${COLORS.cardBg}; border: 1px solid ${COLORS.border}; border-radius: 16px; display: flex; flex-direction: column; padding: 32px; }
    .dash-row { display: flex; gap: 16px; margin-bottom: 16px; }
    .dash-item { flex: 1; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; }
    .dash-label { font-size: 12px; color: ${COLORS.muted}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .dash-bar { height: 8px; background: ${COLORS.border}; border-radius: 4px; overflow: hidden; }
    .dash-fill { height: 100%; background: ${COLORS.cyan}; border-radius: 4px; transition: width 0.6s ease-out; }
    .split-screen { width: 90%; max-width: 900px; aspect-ratio: 16/9; position: relative; border-radius: 16px; overflow: hidden; }
    .split-before, .split-after { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
    .split-before { background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); border: 1px solid #ff444440; }
    .split-after { background: linear-gradient(135deg, #0a1a0f 0%, #051008 100%); border: 1px solid ${COLORS.cyan}40; clip-path: inset(0 ${pct(1 - el.splitScreen?.sliderPos || 0)} 0 0); }
    .split-label { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
    .split-before .split-label { color: #ff4444; }
    .split-after .split-label { color: ${COLORS.cyan}; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 90%; max-width: 1000px; }
  </style>
</head>
<body>
  <div class="frame" id="frame">
    ${renderPhaseContent(time, el)}
  </div>
  <script>
    // Auto-refresh for live preview during dev
    console.log('Still t=${time}s - Phase: ${state.phase} (${(state.phaseProgress*100).toFixed(0)}%)');
  </script>
</body>
</html>`;
}

function renderPhaseContent(time: number, el: ReturnType<typeof seek>['elements']): string {
  switch (true) {
    case time === 0: // HOOK - Logo kinetic
      return `
        <div class="logo" style="opacity:${el.logo.opacity}; transform: scale(${el.logo.scale}) translateX(${Math.sin(el.logo.glitch * 100) * 20}px);">
          H<span style="opacity:${el.logo.charProgress}">a</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.1)}">r</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.2)}">d</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.3)}">w</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.4)}">a</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.5)}">r</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.6)}">e</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.7)}">P</span>
          <span style="opacity:${Math.max(0, el.logo.charProgress - 0.8)}">C</span>
        </div>
      `;

    case time === 7: // SOLUTION - Dashboard
      return `
        <div class="dashboard-mock">
          <div class="dash-row">
            <div class="dash-item">
              <div class="dash-label">XP Progression</div>
              <div class="dash-bar"><div class="dash-fill" style="width:${pct(el.dashboard.xpFill)}"></div></div>
            </div>
            <div class="dash-item" style="opacity:${el.dashboard.levelPop}; transform:scale(${el.dashboard.levelPop})">
              <div class="dash-label">Niveau</div>
              <div style="font-size:32px;font-weight:700;color:${COLORS.amber}">Level 3</div>
            </div>
          </div>
          <div class="dash-row">
            <div class="dash-item" style="opacity:${el.dashboard.badgePop}; transform:scale(${el.dashboard.badgePop})">
              <div class="dash-label">Badges</div>
              <div style="font-size:24px">🏆 🥇 🎯</div>
            </div>
            <div class="dash-item" style="opacity:${el.dashboard.streakFlame}; transform:scale(${el.dashboard.streakFlame})">
              <div class="dash-label">Série</div>
              <div style="font-size:24px">🔥 12 jours</div>
            </div>
          </div>
        </div>
        <div class="solution-text" style="opacity:${el.solutionText.opacity}; margin-top:32px;">
          <div style="opacity:${el.solutionText.line > 0 ? 1 : 0}">XP. Niveaux. Badges. Série.</div>
          <div style="opacity:${el.solutionText.line > 0 ? 1 : 0}; margin-top:8px; color:${COLORS.amber}">Ton Duolingo du hardware.</div>
        </div>
      `;

    case time === 15: // MODULES - 4 flip cards
      const cardsHtml = el.cards.map((card, i) => `
        <div class="card" style="opacity:${card.opacity}; transform: perspective(1000px) rotateY(${card.rotationY}deg);">
          <div class="card-inner">
            <div class="card-face card-front">
              <div class="card-icon">${cardIcon(card.content)}</div>
              <div class="card-title">${cardLabel(card.content)}</div>
              <div class="card-desc">${cardDesc(card.content)}</div>
            </div>
            <div class="card-face card-back">
              <div class="card-title">Clique pour explorer →</div>
            </div>
          </div>
        </div>
      `).join('');

      return `<div class="cards-grid">${cardsHtml}</div>`;

    case time === 25: // CTA - Button + QR
      return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:24px;">
          <button class="cta-btn" style="opacity:${el.ctaButton.opacity}; transform:scale(${el.ctaButton.scale});">
            Commencer libre
          </button>
          <div class="qr-code" style="opacity:${el.qrCode.opacity}; transform:scale(${el.qrCode.scale});">
            QR CODE
          </div>
          <div class="cta-url" style="opacity:${el.ctaText.opacity};">
            hardwarepc.fr
          </div>
        </div>
      `;

    default:
      return '';
  }
}

function cardIcon(type: string): string {
  const icons: Record<string, string> = {
    cours: '📚', quiz: '❓', diagnostic: '🔧', constructeur: '🖥️'
  };
  return icons[type] || '⬜';
}
function cardLabel(type: string): string {
  const labels: Record<string, string> = {
    cours: 'Cours', quiz: 'Quiz', diagnostic: 'Diagnostic', constructeur: 'Constructeur'
  };
  return labels[type] || type;
}
function cardDesc(type: string): string {
  const descs: Record<string, string> = {
    cours: '4 parcours · 40+ leçons',
    quiz: 'Adaptatif · ~60 questions',
    diagnostic: '10 pannes réelles',
    constructeur: 'Compatibilité live'
  };
  return descs[type] || '';
}

// Generate all frames
const frames = generateValidationFrames();
frames.forEach(frame => {
  const html = renderFrame(frame);
  writeFileSync(join(OUTPUT_DIR, `still-${frame.time}s.html`), html);
  console.log(`✅ Generated still-${frame.time}s.html`);
});

console.log('\n🎯 All validation stills generated in motion-video-1/stills/');
console.log('Open each .html in browser to validate visual design.');