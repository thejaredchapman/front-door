#!/usr/bin/env node
/**
 * Render docs/banner/banner.html → docs/banner/front-door-banner.png (1280×400 at 2x) for the README.
 *   npm run banner
 * Uses Google Chrome headless (set CHROME_PATH if it's installed elsewhere).
 */
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = join(ROOT, 'docs', 'banner', 'front-door-banner.png');
execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=2', '--window-size=1280,400', '--virtual-time-budget=4000', `--screenshot=${out}`, pathToFileURL(join(ROOT, 'docs', 'banner', 'banner.html')).href], { stdio: 'ignore' });
console.log(`Saved ${out.replace(`${ROOT}/`, '')}`);
