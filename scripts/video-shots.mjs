#!/usr/bin/env node
/**
 * Step 1 of the 30-second video: capture app screenshots, then render the six 1920×1080 scene frames.
 *
 *   npm run dev                 # in another terminal (the app must be running)
 *   npm run video:shots         # defaults to http://localhost:5173 ; override with APP_URL=http://localhost:5199
 *
 * Uses Google Chrome headless through the DevTools protocol (Node's built-in WebSocket), no extra packages.
 * Output: video/shots/*.png (app screenshots) and video/frames/scene-1..6.png
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9334;
const SHOTS = join(ROOT, 'video', 'shots');
const FRAMES = join(ROOT, 'video', 'frames');
mkdirSync(SHOTS, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'frontdoor-video-'))}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });

let ws; let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const viewport = (width, height) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
const go = async (url, wait = 2200) => { await send('Page.navigate', { url }); await sleep(wait); };
async function shot(file) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(file, Buffer.from(r.result.data, 'base64'));
  console.log('saved', file.replace(`${ROOT}/`, ''));
}
const setState = (patch) => js(`(() => { const k = 'amortization-prefs-v3'; const v = JSON.parse(localStorage.getItem(k) || '{"state":{},"version":3}'); Object.assign(v.state, ${JSON.stringify(patch)}); localStorage.setItem(k, JSON.stringify(v)); })()`);

try {
  let wsUrl;
  for (let i = 0; i < 40 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl; } catch { /* starting */ }
    if (!wsUrl) await sleep(250);
  }
  if (!wsUrl) throw new Error('Chrome did not start. Set CHROME_PATH if Chrome is installed elsewhere.');
  ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
  await send('Page.enable');

  // App screenshots (1600×1000)
  await viewport(1600, 1000);
  await go(`${APP}/#/`);
  await setState({ lang: 'en', eli5: false, planSubmitted: true, planTouched: ['income', 'credit'] });
  await send('Page.reload'); await sleep(2500);
  await js('window.scrollTo(0,0)'); await sleep(300);
  await shot(join(SHOTS, 'a.png'));

  await go(`${APP}/#/learn/five-buyers`);
  await js(`document.querySelector('figure')?.scrollIntoView({ block: 'center' })`); await sleep(500);
  await shot(join(SHOTS, 'b.png'));

  await go(`${APP}/#/plan/1`);
  await js('window.scrollTo(0, 0)'); await sleep(400);
  await shot(join(SHOTS, 'c.png'));

  await go(`${APP}/#/results/plans`);
  await js('window.scrollTo(0, 120)'); await sleep(500);
  await shot(join(SHOTS, 'd.png'));

  await go(`${APP}/#/`);
  await js(`document.querySelector('.doorie-fab').click()`); await sleep(600);
  await js(`(() => { const i = document.getElementById('doorie-input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, 'Is there down payment help in Santa Ana?'); i.dispatchEvent(new Event('input', { bubbles: true })); i.form.requestSubmit(); })()`);
  await sleep(800);
  await shot(join(SHOTS, 'e.png'));

  // Scene frames (1920×1080) from video/scenes.html
  await viewport(1920, 1080);
  const scenes = pathToFileURL(join(ROOT, 'video', 'scenes.html')).href;
  for (let n = 1; n <= 6; n++) {
    await go(`${scenes}?scene=${n}`, 1200);
    await js('document.fonts.ready.then(() => true)'); await sleep(300);
    await shot(join(FRAMES, `scene-${n}.png`));
  }
} finally {
  ws?.close();
  chrome.kill();
}
