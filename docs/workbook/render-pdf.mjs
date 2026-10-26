// Renders workbook-assembled.html (produced by assemble.mjs) to a
// print-ready PDF. Run: node assemble.mjs && node render-pdf.mjs
//
// Note: cover/closing/coloring pages intentionally avoid CSS flexbox for
// vertical centering (padding-based centering instead) — flexbox combined
// with multi-page print pagination produced unreliable, shrunk page boxes
// in this Chromium print engine. Keep new full-bleed pages block-flow, not
// flex, unless that's independently re-verified fixed.
import { fileURLToPath } from 'url';
import path from 'path';
import pkg from 'playwright';
const { chromium } = pkg;

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
await page.goto(`file://${path.join(dir, 'workbook-assembled.html')}`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.pdf({
  path: path.join(dir, 'MEMOIVA-Circle-Student-Workbook.pdf'),
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
process.exit(0);
