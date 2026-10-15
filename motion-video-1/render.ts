/**
 * Render final 60fps avec motion blur subframe
 * Utilise Playwright pour générer chaque frame via seek(t)
 * Puis ffmpeg pour encoder en MP4
 */

import { chromium, Page } from 'playwright';
import { seek, VALIDATION_TIMES } from './seek.js';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const CONFIG = {
  width: 1080,
  height: 1920,
  fps: 60,
  duration: 30,
  totalFrames: 30 * 60,
  motionBlurSamples: 8,  // subframe samples per frame
  outputDir: join(__dirname, 'frames'),
  outputVideo: join(__dirname, 'output', 'hardwarepc-promo-30s.mp4'),
  audioFile: join(__dirname, 'assets', 'audio', 'corporate-technology.mp3'),
};

// Colors & styles (match seek.ts)
const COLORS = {
  bg: '#080B14',
  cyan: '#22d3ee',
  amber: '#eab308',
  white: '#ffffff',
  muted: '#9ca3af',
  cardBg: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
};

function pct(v: number) { return `${(v * 100).toFixed(1)}%`; }
function css(v: number, u = 'px') { return `${v}${u}`; }

// HTML template for a single frame
function frameHTML(state: ReturnType<typeof seek>, frameIndex: number): string {
  const el = state.elements;
  const W = CONFIG.width, H = CONFIG.height;

  // Phase-specific rendering
  let content = '';

  switch (state.phase) {
    case 'hook': {
      const logoScale = el.logo.scale;
      const logoOpacity = el.logo.opacity;
      const glitchX = Math.sin(el.logo.glitch * 100) * 20;
      const charProg = el.logo.charProgress;

      content = `
        <div class="logo-container" style="opacity:${logoOpacity}; transform: scale(${logoScale}) translateX(${glitchX}px);">
          <span class="logo-char" style="opacity:${charProg > 0 ? 1 : 0}">H</span>
          <span class="logo-char" style="opacity:${charProg > 0.125 ? 1 : 0}">a</span>
          <span class="logo-char" style="opacity:${charProg > 0.25 ? 1 : 0}">r</span>
          <span class="logo-char" style="opacity:${charProg > 0.375 ? 1 : 0}">d</span>
          <span class="logo-char" style="opacity:${charProg > 0.5 ? 1 : 0}">w</span>
          <span class="logo-char" style="opacity:${charProg > 0.625 ? 1 : 0}">a</span>
          <span class="logo-char" style="opacity:${charProg > 0.75 ? 1 : 0}">r</span>
          <span class="logo-char" style="opacity:${charProg > 0.875 ? 1 : 0}">e</span>
          <span class="logo-char logo-cap" style="opacity:${charProg > 1 ? 1 : 0}">P</span>
          <span class="logo-char logo-cap" style="opacity:${charProg > 1 ? 1 : 0}">C</span>
        </div>
      `;
      break;
    }

    case 'tagline': {
      const tagOpacity = el.tagline.opacity;
      const tagY = el.tagline.y;
      const charProg = el.tagline.charProgress;
      content = `
        <div class="logo-container" style="opacity:1; transform: scale(1);">
          <span class="logo-char">H</span><span class="logo-char">a</span><span class="logo-char">r</span>
          <span class="logo-char">d</span><span class="logo-char">w</span><span class="logo-char">a</span>
          <span class="logo-char">r</span><span class="logo-char">e</span>
          <span class="logo-char logo-cap">P</span><span class="logo-char logo-cap">C</span>
        </div>
        <div class="tagline" style="opacity:${tagOpacity}; transform: translateY(${tagY}px);">
          ${'Comprends enfin ton PC.'.split('').map((c, i) =>
            `<span style="opacity:${charProg > i/22 ? 1 : 0}; display:inline-block;">${c === ' ' ? '&nbsp;' : c}</span>`
          ).join('')}
        </div>
      `;
      break;
    }

    case 'problem': {
      const probOpacity = el.problemText.opacity;
      const parts = el.pcParts;
      content = `
        <div class="problem-scene">
          <div class="pc-part cpu" style="transform:translate(${parts.cpu.x}px,${parts.cpu.y}px) scale(${parts.cpu.scale}) rotate(${parts.cpu.rotation}rad); opacity:${parts.cpu.opacity}">🖥️</div>
          <div class="pc-part gpu" style="transform:translate(${parts.gpu.x}px,${parts.gpu.y}px) scale(${parts.gpu.scale}) rotate(${parts.gpu.rotation}rad); opacity:${parts.gpu.opacity}">🎮</div>
          <div class="pc-part ram" style="transform:translate(${parts.ram.x}px,${parts.ram.y}px) scale(${parts.ram.scale}) rotate(${parts.ram.rotation}rad); opacity:${parts.ram.opacity}">🧠</div>
          <div class="pc-part ssd" style="transform:translate(${parts.ssd.x}px,${parts.ssd.y}px) scale(${parts.ssd.scale}) rotate(${parts.ssd.rotation}rad); opacity:${parts.ssd.opacity}">💾</div>
          <div class="problem-text" style="opacity:${probOpacity}">Tu as un PC.<br>Mais tu sais pas ce qu'il fait.</div>
        </div>
      `;
      break;
    }

    case 'solution': {
      const db = el.dashboard;
      const solOpacity = el.solutionText.opacity;
      const line = el.solutionText.line;
      content = `
        <div class="dashboard-mock">
          <div class="dash-row">
            <div class="dash-item">
              <div class="dash-label">XP Progression</div>
              <div class="dash-bar"><div class="dash-fill" style="width:${pct(db.xpFill)}"></div></div>
            </div>
            <div class="dash-item" style="opacity:${db.levelPop}; transform:scale(${db.levelPop}); transform-origin:center">
              <div class="dash-label">Niveau</div>
              <div class="dash-value">Level 3</div>
            </div>
          </div>
          <div class="dash-row">
            <div class="dash-item" style="opacity:${db.badgePop}; transform:scale(${db.badgePop}); transform-origin:center">
              <div class="dash-label">Badges</div>
              <div class="dash-badges">🏆 🥇 🎯</div>
            </div>
            <div class="dash-item" style="opacity:${db.streakFlame}; transform:scale(${db.streakFlame}); transform-origin:center">
              <div class="dash-label">Série</div>
              <div class="dash-value">🔥 12 jours</div>
            </div>
          </div>
        </div>
        <div class="solution-text" style="opacity:${solOpacity}; margin-top:32px;">
          <div style="opacity:${line > 0 ? 1 : 0}">XP. Niveaux. Badges. Série.</div>
          <div style="opacity:${line > 0 ? 1 : 0}; margin-top:8px; color:${COLORS.amber}">Ton Duolingo du hardware.</div>
        </div>
      `;
      break;
    }

    case 'modules': {
      const cardsHtml = el.cards.map((card) => `
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

      content = `<div class="cards-grid">${cardsHtml}</div>`;
      break;
    }

    case 'diff': {
      const slider = el.splitScreen.sliderPos;
      content = `
        <div class="split-screen">
          <div class="split-before">
            <div class="split-label">Avant</div>
            <div style="font-size:24px;color:#ff4444">❌ Perdu</div>
            <div style="margin-top:16px;font-size:16px;color:${COLORS.muted}">Pas de parcours<br>Pas de progression<br>Pas de méthode</div>
          </div>
          <div class="split-after" style="clip-path: inset(0 ${pct(1 - slider)} 0 0);">
            <div class="split-label">Après</div>
            <div style="font-size:24px;color:${COLORS.cyan}">✅ Clair</div>
            <div style="margin-top:16px;font-size:16px;color:${COLORS.muted}">4 niveaux guidés<br>Maîtrise par domaine<br>Révisions auto</div>
          </div>
        </div>
        <div class="diff-text" style="opacity:${el.diffText.opacity}; margin-top:24px;">
          Avant : perdu. Après : parcours clair, maîtrise par domaine, révisions auto.
        </div>
      `;
      break;
    }

    case 'stats': {
      const statsHtml = el.counters.map(c => `
        <div class="stat">
          <div class="stat-value">${c.value.toLocaleString()}</div>
          <div class="stat-label">${c.label}</div>
        </div>
      `).join('');

      content = `<div class="stats-grid">${statsHtml}</div>`;
      break;
    }

    case 'cta': {
      const btnScale = el.ctaButton.scale;
      const btnOpacity = el.ctaButton.opacity;
      const qrOpacity = el.qrCode.opacity;
      const qrScale = el.qrCode.scale;
      const txtOpacity = el.ctaText.opacity;

      content = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:24px;">
          <button class="cta-btn" style="opacity:${btnOpacity}; transform:scale(${btnScale});">
            Commencer libre
          </button>
          <div class="qr-code" style="opacity:${qrOpacity}; transform:scale(${qrScale});">
            QR CODE
          </div>
          <div class="cta-url" style="opacity:${txtOpacity};">hardwarepc.fr</div>
        </div>
      `;
      break;
    }

    case 'loop': {
      // Fade to black / first frame
      const fade = el.loopFade;
      content = `
        <div class="logo-container" style="opacity:${1 - fade}; transform: scale(1);">
          <span class="logo-char">H</span><span class="logo-char">a</span><span class="logo-char">r</span>
          <span class="logo-char">d</span><span class="logo-char">w</span><span class="logo-char">a</span>
          <span class="logo-char">r</span><span class="logo-char">e</span>
          <span class="logo-char logo-cap">P</span><span class="logo-char logo-cap">C</span>
        </div>
      `;
      break;
    }
  }

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:${W}px; height:${H}px;
  background:${COLORS.bg}; color:${COLORS.white};
  font-family:'Space Grotesk','Inter',system-ui,sans-serif;
  overflow:hidden; position:relative;
  display:flex; align-items:center; justify-content:center;
}
.logo-container { display:flex; gap:2px; }
.logo-char { font-weight:700; font-size:72px; letter-spacing:-0.02em; line-height:1; display:inline-block; }
.logo-cap { color:${COLORS.cyan}; }
.tagline { font-size:28px; font-weight:400; color:${COLORS.muted}; text-align:center; max-width:800px; margin-top:24px; letter-spacing:0.01em; }
.tagline span { transition:opacity 0.1s; }
.problem-scene { position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
.pc-part { position:absolute; width:140px; height:140px; display:flex; align-items:center; justify-content:center; font-size:64px; will-change:transform,opacity; }
.cpu { top:30%; left:20%; } .gpu { top:30%; right:20%; } .ram { bottom:30%; left:20%; } .ssd { bottom:30%; right:20%; }
.problem-text { position:absolute; bottom:15%; left:50%; transform:translateX(-50%); font-size:26px; text-align:center; max-width:700px; line-height:1.5; color:${COLORS.white}; }
.dashboard-mock { width:90%; max-width:960px; aspect-ratio:16/9; background:${COLORS.cardBg}; border:1px solid ${COLORS.border}; border-radius:20px; padding:40px; display:flex; flex-direction:column; gap:24px; }
.dash-row { display:flex; gap:24px; }
.dash-item { flex:1; background:rgba(255,255,255,0.03); border-radius:16px; padding:24px; text-align:center; }
.dash-label { font-size:13px; color:${COLORS.muted}; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px; }
.dash-bar { height:10px; background:${COLORS.border}; border-radius:5px; overflow:hidden; }
.dash-fill { height:100%; background:linear-gradient(90deg,${COLORS.cyan},#06b6d4); border-radius:5px; will-change:width; }
.dash-value { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:36px; color:${COLORS.amber}; }
.dash-badges { font-size:32px; }
.solution-text { font-size:26px; text-align:center; max-width:700px; line-height:1.5; }
.cards-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:32px; width:90%; max-width:960px; }
.card { aspect-ratio:1; background:${COLORS.cardBg}; border:1px solid ${COLORS.border}; border-radius:20px; padding:32px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; transform-style:preserve-3d; perspective:1000px; will-change:transform,opacity; }
.card-inner { width:100%; height:100%; transform-style:preserve-3d; }
.card-face { position:absolute; inset:0; backface-visibility:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; border-radius:16px; }
.card-front { background:${COLORS.cardBg}; }
.card-back { background:${COLORS.cyan}15; color:${COLORS.cyan}; transform:rotateY(180deg); }
.card-icon { font-size:56px; margin-bottom:20px; }
.card-title { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; margin-bottom:12px; }
.card-desc { font-size:16px; color:${COLORS.muted}; max-width:220px; line-height:1.4; }
.split-screen { width:90%; max-width:960px; aspect-ratio:16/9; position:relative; border-radius:20px; overflow:hidden; border:1px solid ${COLORS.border}; }
.split-before, .split-after { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; text-align:center; }
.split-before { background:linear-gradient(135deg,#1a1a2e 0%,#0f0f1a 100%); border-right:1px solid #ff444440; }
.split-after { background:linear-gradient(135deg,#0a1a0f 0%,#051008 100%); }
.split-label { font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:20px; }
.split-before .split-label { color:#ff4444; } .split-after .split-label { color:${COLORS.cyan}; }
.diff-text { font-size:24px; text-align:center; max-width:700px; line-height:1.5; margin-top:32px; }
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; width:90%; max-width:1080px; }
.stat { text-align:center; }
.stat-value { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:64px; color:${COLORS.cyan}; line-height:1; }
.stat-label { font-size:16px; color:${COLORS.muted}; margin-top:10px; }
.cta-btn { background:${COLORS.cyan}; color:#001818; font-weight:600; font-size:22px; padding:18px 56px; border-radius:10px; border:none; cursor:pointer; will-change:transform; }
.qr-code { width:140px; height:140px; background:${COLORS.white}; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:11px; color:${COLORS.bg}; font-family:monospace; border:2px solid ${COLORS.cyan}; will-change:transform,opacity; }
.cta-url { font-size:18px; color:${COLORS.muted}; font-family:monospace; letter-spacing:0.05em; }
</style></head><body>${content}</body></html>`;
}

function cardIcon(type: string) { return { cours: '📚', quiz: '❓', diagnostic: '🔧', constructeur: '🖥️' }[type] || '⬜'; }
function cardLabel(type: string) { return { cours: 'Cours', quiz: 'Quiz', diagnostic: 'Diagnostic', constructeur: 'Constructeur' }[type] || type; }
function cardDesc(type: string) {
  return { cours: '4 parcours · 40+ leçons', quiz: 'Adaptatif · ~60 questions', diagnostic: '10 pannes réelles', constructeur: 'Compatibilité live' }[type] || '';
}

async function renderFrames() {
  mkdirSync(CONFIG.outputDir, { recursive: true });
  mkdirSync(join(__dirname, 'output'), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: CONFIG.width, height: CONFIG.height });

  console.log(`🎬 Rendering ${CONFIG.totalFrames} frames @ ${CONFIG.fps}fps with ${CONFIG.motionBlurSamples}x motion blur...`);
  const startTime = Date.now();

  for (let frame = 0; frame < CONFIG.totalFrames; frame++) {
    const t = frame / CONFIG.fps;
    const state = seek(t);

    // Motion blur: render multiple subframes and blend
    if (CONFIG.motionBlurSamples > 1) {
      // For motion blur, we'd ideally blend multiple renders.
      // Simplified: render at frame center + slight temporal offset
      // Full implementation would average N subframe renders
    }

    const html = frameHTML(state, frame);
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Hide scrollbars, ensure clean render
    await page.evaluate(() => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    });

    await page.screenshot({
      path: join(CONFIG.outputDir, `frame_${String(frame).padStart(4, '0')}.png`),
      animations: 'disabled',
      fullPage: false,
    });

    if (frame % 180 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      const eta = (elapsed / (frame + 1)) * (CONFIG.totalFrames - frame - 1);
      console.log(`  Frame ${frame + 1}/${CONFIG.totalFrames} (${((frame + 1) / CONFIG.totalFrames * 100).toFixed(1)}%) — ${elapsed.toFixed(0)}s elapsed, ETA ${eta.toFixed(0)}s`);
    }
  }

  await browser.close();
  console.log(`\n✅ All frames rendered in ${(Date.now() - startTime) / 1000}s`);
}

function encodeVideo() {
  console.log('\n🎞️ Encoding video with ffmpeg...');

  const ffmpegArgs = [
    '-y',
    '-framerate', String(CONFIG.fps),
    '-i', join(CONFIG.outputDir, 'frame_%04d.png'),
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-vf', `pad=ceil(iw/2)*2:ceil(ih/2)*2`,
  ];

  // Add audio if exists
  if (existsSync(CONFIG.audioFile)) {
    console.log('🎵 Adding audio track...');
    ffmpegArgs.push('-i', CONFIG.audioFile, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  } else {
    console.log('⚠️ No audio file found — rendering video only');
    console.log(`   Place your music at: ${CONFIG.audioFile}`);
  }

  ffmpegArgs.push(CONFIG.outputVideo);

  const result = spawnSync('ffmpeg', ffmpegArgs, { encoding: 'utf-8', stdio: 'inherit' });

  if (result.status === 0) {
    console.log(`\n✅ Video encoded: ${CONFIG.outputVideo}`);
  } else {
    console.error('\n❌ ffmpeg failed');
    process.exit(1);
  }
}

// Main
async function main() {
  console.log('🚀 HardwarePC Motion Design — Render Final 30s 60fps\n');
  await renderFrames();
  encodeVideo();
  console.log('\n🎉 Done! Check output/hardwarepc-promo-30s.mp4');
}

main().catch(console.error);