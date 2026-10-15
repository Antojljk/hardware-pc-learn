"""HardwarePC 30s soundtrack: Mixkit 'Corporate Technology' (120 BPM). Sky flood at 7.0s.
SFX by measured peak placement. Fade last 0.9s. Two-pass loudnorm -14 LUFS."""
import json, subprocess
from pathlib import Path
import numpy as np
import imageio_ffmpeg

HERE = Path(__file__).parent
FF = imageio_ffmpeg.get_ffmpeg_exe()
SR, T = 48000, 30.0
N = int(round(T * SR))

# Mixkit Corporate Technology (ID: 4361) - 120 BPM
# Big hit in original at ~? We align so a strong downbeat lands on sky flood at 7.0s
# Track is ~2:00 long. We'll take a 30s window starting around 0:30-0:45
START = 30.0  # adjust after probe listen


def load(p):
    raw = subprocess.run([FF, "-v", "quiet", "-i", str(p), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


mix = load(HERE / "assets/audio/corporate-technology.mp3")[int(START * SR):][:N].copy()
fi = int(0.25 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None]

# SFX from Mixkit (free) - download to assets/sfx/
# Using IDs: soft=1117, pop=2357, rise=w1489, impact=1143, whoosh=w1490, success=2865, sparkle=3083, click=1125, key=2568
S = {k: load(HERE / f"assets/sfx/{v}.mp3") for k, v in dict(
    soft=1117, key=2568, click=1125, pop=2357, rise="w1489",
    impact=1143, whoosh="w1490", success=2865, sparkle=3083
).items()}

# Events aligned to 120 BPM grid (0.5s per beat)
# Beat 0 = t=0. Hook cuts at 2.0, 4.0, Drop at 7.0, Modules 11.0, Diff 15.0, Stats 19.0, CTA 23.0, Loop 27.0
EV = [
    # Hook 0-2.0
    (0.1, "soft", .08), (0.35, "soft", .08),
    (0.5 + i * .05, "pop", .04) for i in range(8)
] + [(1.35, "soft", .08)] + [
    # Tagline 2.0-4.0
    (2.5, "whoosh", .05),
    (2.8 + i * .054, "key", .05) for i in range(13)
] + [(3.85, "click", .2)] + [
    # Problem 4.0-7.0
    (4.55, "whoosh", .05),
    (4.7 + i * .06, "pop", .06) for i in range(5)
] + [(5.3 + i * .09, "soft", .04) for i in range(8)] + [
    # Pre-drop builds
    (6.6 + i * .08, "pop", .05) for i in range(5)
] + [(7.0 + i * .08, "soft", .05) for i in range(5)] + [(7.2, "rise", .12)] + [
    # DROP at 7.0 - sky flood
    (7.0, "impact", .2), (7.45, "sparkle", .09),
    (7.45 + i * .1, "pop", .06) for i in range(3)
] + [
    # Modules 11.0-15.0
    (10.05, "whoosh", .05),
    (10.45 + i * .07, "pop", .035) for i in range(6)
] + [(12.05, "whoosh", .05)] + [
    (12.35 + i * .05, "pop", .035) for i in range(6)
] + [(14.05, "whoosh", .05)] + [
    (14.3 + i * .08, "soft", .05) for i in range(5)
] + [
    # Diff 15.0-19.0
    (16.05, "whoosh", .05),
    (16.3 + i * .04, "key", .045) for i in range(16)
] + [(17.2, "click", .2), (17.35, "success", .12)] + [
    # Stats 19.0-23.0
    (18.1, "whoosh", .05),
    (18.15 + i * .06, "pop", .05) for i in range(9)
] + [
    # CTA 23.0-27.0
    (20.1, "sparkle", .11), (21.1, "pop", .09), (22.35, "click", .2)
] + [
    # Loop tail 27.0-30.0
    (27.0, "whoosh", .05),
    (27.2 + i * .1, "soft", .04) for i in range(8)
] + [(29.1, "click", .15)]


for t, name, gain in EV:
    s = S[name] / (np.abs(S[name]).max() + 1e-9) * gain
    i0 = int(round(t * SR)) - int(np.abs(s).sum(1).argmax())
    lo, hi = max(0, i0), min(N, i0 + len(s))
    if hi > lo:
        mix[lo:hi] += s[lo - i0:hi - i0]

# Fade last 0.9s
f0 = int((T - 0.9) * SR)
mix[f0:] *= np.linspace(1, 0, N - f0)[:, None] ** 1.3

rawp = HERE / "out/raw.wav"
rawp.parent.mkdir(exist_ok=True)
subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(rawp)], input=mix.astype(np.float32).tobytes(), check=True)

# Two-pass loudnorm
m = subprocess.run([FF, "-hide_banner", "-i", str(rawp), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
      f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run([FF, "-v", "error", "-y", "-i", str(rawp), "-af", af, "-ar", str(SR), str(HERE / "out/audio.wav")], check=True)
print("audio ->", HERE / "out/audio.wav")