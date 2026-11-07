#!/usr/bin/env node
/**
 * Step 2 of the 30-second video: generate the voiceover with ElevenLabs (uses your ElevenLabs credits).
 *
 *   npm run video:voice
 *
 * Needs ELEVENLABS_API_KEY, read from the environment or from .env.local (which git ignores).
 * Optional: ELEVENLABS_VOICE_ID (default: "Rachel", a free premade voice), ELEVENLABS_MODEL
 * (default eleven_multilingual_v2), ELEVENLABS_SPEED (0.7–1.2, default 1.0).
 * Text: video/voiceover.txt. Output: video/voiceover.mp3. ElevenLabs bills about 1 credit per character;
 * each run is logged to docs/voiceover-log.jsonl.
 * The key is never printed or written anywhere.
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fromEnvLocal(name) {
  const file = join(ROOT, '.env.local');
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, 'utf8').split('\n').find((l) => l.trim().startsWith(`${name}=`));
  return line ? line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : undefined;
}
const env = (name, fallback) => process.env[name] || fromEnvLocal(name) || fallback;

const KEY = env('ELEVENLABS_API_KEY');
const VOICE = env('ELEVENLABS_VOICE_ID', '21m00Tcm4TlvDq8ikWAM'); // "Rachel" premade voice
const MODEL = env('ELEVENLABS_MODEL', 'eleven_multilingual_v2');
const SPEED = Number(env('ELEVENLABS_SPEED', '1'));
const text = readFileSync(join(ROOT, 'video', 'voiceover.txt'), 'utf8').trim();

console.log(`Voiceover: ${text.split(/\s+/).length} words, ${text.length} characters (≈${text.length} ElevenLabs credits).`);
if (!KEY) {
  console.error('Missing ELEVENLABS_API_KEY. Add a line ELEVENLABS_API_KEY=your-key to .env.local (git ignores it), then run again.');
  process.exit(1);
}

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: { 'xi-api-key': KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
  body: JSON.stringify({
    text,
    model_id: MODEL,
    voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true, speed: SPEED },
  }),
});
if (!res.ok) {
  console.error(`ElevenLabs error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const audio = Buffer.from(await res.arrayBuffer());
writeFileSync(join(ROOT, 'video', 'voiceover.mp3'), audio);
appendFileSync(join(ROOT, 'docs', 'voiceover-log.jsonl'), `${JSON.stringify({ at: new Date().toISOString(), voice: VOICE, model: MODEL, characters: text.length, bytes: audio.length })}\n`);
console.log(`Saved video/voiceover.mp3 (${(audio.length / 1024).toFixed(0)} KB). Logged to docs/voiceover-log.jsonl.`);
