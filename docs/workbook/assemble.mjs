import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(dir, 'workbook-source.html'), 'utf8');
const mandala = readFileSync(path.join(dir, 'calm-mandala.svg'), 'utf8');

const weekThemes = [
  'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8',
];

function placeholderPage(label) {
  return `
<div class="page page--white">
  <span class="week-badge">${label.toUpperCase()}</span>
  <span class="placeholder-tag">Content coming soon</span>
  <h1 class="page-title">Theme: <span class="blank-field"></span></h1>
  <div class="rule"></div>
  <p>Your facilitator will introduce this week's theme and vocabulary in session &mdash; space is reserved here for you to fill in as you go.</p>
  <table class="vocab">
    <tr><th>Spanish</th><th>English</th><th>Say it like this</th></tr>
    <tr><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td></tr>
    <tr><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td></tr>
    <tr><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td></tr>
    <tr><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td></tr>
    <tr><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td></tr>
    <tr><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td><td><span class="blank-field"></span></td></tr>
  </table>
  <div class="affirmation-box">
    <div class="label">This week's affirmation</div>
    <p><span class="blank-field" style="min-width:420pt;"></span></p>
  </div>
  <div class="notes-label">My notes</div>
  <div class="notes-lines"><div></div><div></div><div></div></div>
</div>`;
}

const placeholders = weekThemes.map(placeholderPage).join('\n');

let out = html
  .replace('<!--MANDALA_SVG_1-->', mandala)
  .replace('<!--MANDALA_SVG_2-->', mandala)
  .replace('<!--WEEK_PLACEHOLDERS-->', placeholders);

writeFileSync(path.join(dir, 'workbook-assembled.html'), out);
console.log('done, length:', out.length);
