#!/usr/bin/env node
/**
 * Step 3 of the 30-second video: assemble video/frames/scene-1..6.png into a 30-second MP4 with
 * gentle zooms and crossfades, plus video/voiceover.mp3 if it exists (otherwise a silent track).
 *
 *   npm run video:build      → video/front-door-30s.mp4 (1920×1080, 30 fps, H.264 + AAC)
 *
 * Needs ffmpeg (brew install ffmpeg).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const SCENES = 6;
const TOTAL = 30;
const FADE = 0.5;
const SCENE_SEC = (TOTAL + (SCENES - 1) * FADE) / SCENES; // ≈5.42 s each so the total is 30 s
const FRAMES = Math.ceil(SCENE_SEC * FPS);

const frames = Array.from({ length: SCENES }, (_, i) => join(ROOT, 'video', 'frames', `scene-${i + 1}.png`));
const missing = frames.filter((f) => !existsSync(f));
if (missing.length) { console.error('Missing scene frames. Run `npm run video:shots` first.'); process.exit(1); }

const voice = join(ROOT, 'video', 'voiceover.mp3');
const hasVoice = existsSync(voice);
const out = join(ROOT, 'video', 'front-door-30s.mp4');

// Each still → a slow zoom clip (alternating zoom in / out), then crossfade the clips.
const parts = frames.map((_, i) => {
  const zoom = i % 2 === 0 ? `min(1+0.045*on/${FRAMES},1.045)` : `max(1.045-0.045*on/${FRAMES},1)`;
  return `[${i}:v]scale=2304:1296,zoompan=z='${zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FRAMES}:s=1920x1080:fps=${FPS},setsar=1,format=yuv420p[v${i}]`;
});
let last = 'v0';
for (let i = 1; i < SCENES; i++) {
  const offset = (i * (SCENE_SEC - FADE)).toFixed(3);
  parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset}[x${i}]`);
  last = `x${i}`;
}
const audioIndex = SCENES;
parts.push(hasVoice
  ? `[${audioIndex}:a]apad,atrim=0:${TOTAL},afade=t=out:st=${TOTAL - 0.6}:d=0.6[a]`
  : `anullsrc=r=44100:cl=stereo,atrim=0:${TOTAL}[a]`);

const args = ['-y', ...frames.flatMap((f) => ['-i', f])];
if (hasVoice) args.push('-i', voice);
args.push('-filter_complex', parts.join(';'), '-map', `[${last}]`, '-map', '[a]', '-t', String(TOTAL),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out);

console.log(`Building ${TOTAL}s video from ${SCENES} scenes${hasVoice ? ' with voiceover' : ' (no voiceover yet: silent track)'}…`);
execFileSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
console.log(`Saved ${out.replace(`${ROOT}/`, '')}`);
