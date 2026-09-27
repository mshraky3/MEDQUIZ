// Renders ad.html frame by frame, then encodes to MP4.
// usage: node render.mjs <variant> <outDir> [fps] [onlyTimes,comma,separated]
const { chromium } = require('playwright');
const { mkdirSync } = require('fs');
const path = require('path');
(async () => {
const [variant = 'offer', out = 'frames', fpsArg = '30', only] = process.argv.slice(2);
const fps = +fpsArg, DUR = 21;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.resolve('ad.html') + '?v=' + variant, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const times = only ? only.split(',').map(Number) : Array.from({ length: DUR * fps }, (_, i) => i / fps);
for (let i = 0; i < times.length; i++) {
  await page.evaluate(t => window.render(t), times[i]);
  const name = only ? `t${times[i]}.png` : `f${String(i).padStart(4, "0")}.jpg`;
  await page.screenshot({ path: path.join(out, name), type: only ? 'png' : 'jpeg', ...(only ? {} : { quality: 92 }) });
}
await browser.close();
})();
