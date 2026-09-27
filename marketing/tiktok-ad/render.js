// Renders an ad page frame by frame (the page exposes window.render(t) and window.DUR).
// usage: node render.js <page.html> <variant> <outDir> [fps] [previewTimes,comma,separated]
const { chromium } = require('playwright');
const { mkdirSync } = require('fs');
const path = require('path');
(async () => {
const [file = 'ad.html', variant = 'offer', out = 'frames', fpsArg = '30', only] = process.argv.slice(2);
const fps = +fpsArg;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.resolve(file) + '?v=' + variant, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const DUR = await page.evaluate(() => window.DUR || 21);
const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(DUR * fps) }, (_, i) => i / fps);
for (let i = 0; i < times.length; i++) {
  await page.evaluate(t => window.render(t), times[i]);
  const name = only ? `t${times[i]}.png` : `f${String(i).padStart(4, '0')}.jpg`;
  await page.screenshot({ path: path.join(out, name), type: only ? 'png' : 'jpeg', ...(only ? {} : { quality: 92 }) });
}
await browser.close();
})();
