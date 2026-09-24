import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import * as dataClient from '../../lib/dataClient';

/**
 * Coloring Studio — SVG fill-by-tap, one pattern at a time picked from a
 * tab row. Two patterns in v1:
 *   - "Home" — the Week 1 vocabulary scene (house, sun, tree, flower),
 *     unchanged from the original v1 build.
 *   - "Calm Pattern" — an adult, dignity-forward mandala for a calming/
 *     brain-health moment, not a cartoon scene. Added per founder
 *     direction: the app's coloring activity should read as suitable for
 *     an adult audience, not just a themed illustration. See
 *     docs/app/coloring-studio.md.
 *
 * The character-illustrated coloring BOOK is a separate, print-only
 * deliverable — not part of the app. See that doc for why.
 *
 * Save/Download work the same for either pattern; progress is keyed by
 * pattern (pageId), so switching patterns never loses the other one's work.
 */

const OUTLINE = '#1A2B4C';

// --- "Home" pattern: unchanged from v1 -------------------------------------
const HOME_REGIONS = [
  { id: 'ground', label: 'Ground', d: 'M 0 260 H 400 V 300 H 0 Z' },
  { id: 'sun', label: 'Sun', d: 'M 302 55 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0 Z' },
  { id: 'house', label: 'House wall', d: 'M 60 160 H 200 V 260 H 60 Z' },
  { id: 'roof', label: 'Roof', d: 'M 50 160 L 130 95 L 210 160 Z' },
  { id: 'door', label: 'Door', d: 'M 113 202 H 147 V 260 H 113 Z' },
  { id: 'window', label: 'Window', d: 'M 74 180 H 106 V 212 H 74 Z' },
  { id: 'trunk', label: 'Tree trunk', d: 'M 254 198 H 276 V 260 H 254 Z' },
  { id: 'crown', label: 'Tree top', d: 'M 225 162 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0 Z' },
  { id: 'petals', label: 'Flower petals', d: 'M 332 232 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 Z' },
  { id: 'center', label: 'Flower center', d: 'M 342 232 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z' },
];

// --- "Calm Pattern": a generated mandala (3 rings + center) ----------------
// Symmetric, geometric, no characters or scene — deliberately adult in
// register. Regions computed rather than hand-drawn so the pattern stays
// mathematically even.
function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function wedgePath(cx, cy, rInner, rOuter, startDeg, endDeg) {
  const [x1, y1] = polar(cx, cy, rOuter, startDeg);
  const [x2, y2] = polar(cx, cy, rOuter, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  if (rInner === 0) {
    return `M ${cx} ${cy} L ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} Z`;
  }
  const [x3, y3] = polar(cx, cy, rInner, endDeg);
  const [x4, y4] = polar(cx, cy, rInner, startDeg);
  return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
}

function circlePath(cx, cy, r) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

function buildMandalaRegions() {
  const cx = 200;
  const cy = 200;
  const regions = [{ id: 'center', label: 'Center', d: circlePath(cx, cy, 30) }];
  const rings = [
    { name: 'inner', count: 8, rInner: 30, rOuter: 90 },
    { name: 'middle', count: 12, rInner: 90, rOuter: 150 },
    { name: 'outer', count: 16, rInner: 150, rOuter: 195 },
  ];
  rings.forEach(({ name, count, rInner, rOuter }) => {
    for (let i = 0; i < count; i++) {
      const startDeg = (360 / count) * i;
      const endDeg = (360 / count) * (i + 1);
      regions.push({
        id: `${name}-${i}`,
        label: `${name} segment ${i + 1}`,
        d: wedgePath(cx, cy, rInner, rOuter, startDeg, endDeg),
      });
    }
  });
  return regions;
}

const PATTERNS = [
  {
    id: 'home',
    pageId: 'week-1',
    labelKey: 'coloringPatternHome',
    ariaLabel: 'Coloring picture: a house with a sun, a tree, and a flower',
    viewBox: '0 0 400 300',
    regions: HOME_REGIONS,
  },
  {
    id: 'calm',
    pageId: 'calm-mandala',
    labelKey: 'coloringPatternCalm',
    ariaLabel: 'Coloring picture: a calming circular mandala pattern',
    viewBox: '0 0 400 400',
    regions: buildMandalaRegions(),
  },
];

const PALETTE = [
  { hex: '#C0392B', name: 'Red' },
  { hex: '#E67E22', name: 'Orange' },
  { hex: '#F1C40F', name: 'Yellow' },
  { hex: '#27AE60', name: 'Green' },
  { hex: '#0E7C7B', name: 'Teal' },
  { hex: '#2980B9', name: 'Blue' },
  { hex: '#8E44AD', name: 'Purple' },
  { hex: '#8B5A2B', name: 'Brown' },
];

export default function ColoringStudio() {
  const { user, t } = useApp();
  const { loading, cohort } = useParticipantData();
  const [patternId, setPatternId] = useState('home');
  const [fills, setFills] = useState({});
  const [selected, setSelected] = useState(PALETTE[4].hex);
  const [saved, setSaved] = useState(false);
  const svgRef = useRef(null);
  const week = cohort?.current_week ?? 1;

  const pattern = useMemo(() => PATTERNS.find((p) => p.id === patternId), [patternId]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setSaved(false);
    dataClient.getColoringProgress(user.id, pattern.pageId).then((row) => {
      if (alive) setFills(row?.image_data ?? {});
    });
    return () => {
      alive = false;
    };
  }, [user, pattern]);

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  function fillRegion(id) {
    setSaved(false);
    setFills((f) => ({ ...f, [id]: selected }));
  }

  async function save() {
    await dataClient.saveColoringProgress({
      participantId: user.id,
      pageId: pattern.pageId,
      weekNumber: pattern.id === 'home' ? week : null,
      imageData: fills,
    });
    setSaved(true);
  }

  function downloadPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `memoiva-coloring-${pattern.pageId}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    };
    img.src = url;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-navy">{t('coloringTitle')}</h1>
        <p className="mt-2 text-lg text-body/80">
          {pattern.id === 'calm' ? t('coloringHintCalm') : t('coloringHint')}
        </p>
      </div>

      <div className="flex justify-center gap-3" role="tablist" aria-label={t('coloringTitle')}>
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={patternId === p.id}
            onClick={() => setPatternId(p.id)}
            className={`min-h-tap rounded-xl border-2 px-5 text-lg font-semibold ${
              patternId === p.id
                ? 'border-teal bg-teal text-white'
                : 'border-teal bg-white text-teal hover:bg-teal-light'
            }`}
          >
            {t(p.labelKey)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-4 shadow">
        <svg
          ref={svgRef}
          viewBox={pattern.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          role="img"
          aria-label={pattern.ariaLabel}
          data-testid="coloring-svg"
        >
          <rect x="0" y="0" width="400" height="400" fill="#FFFFFF" />
          {pattern.regions.map((r) => (
            <path
              key={r.id}
              d={r.d}
              fill={fills[r.id] ?? '#FFFFFF'}
              stroke={OUTLINE}
              strokeWidth={pattern.id === 'calm' ? '1.5' : '3'}
              strokeLinejoin="round"
              tabIndex={0}
              role="button"
              aria-label={r.label}
              data-testid={`region-${r.id}`}
              onClick={() => fillRegion(r.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fillRegion(r.id);
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>
      </div>

      {/* Palette: large swatches (min 48x48), thumb-reachable along the bottom */}
      <div
        role="radiogroup"
        aria-label="Color palette"
        className="flex flex-wrap justify-center gap-3"
      >
        {PALETTE.map((c) => (
          <button
            key={c.hex}
            type="button"
            role="radio"
            aria-checked={selected === c.hex}
            aria-label={c.name}
            onClick={() => setSelected(c.hex)}
            data-testid={`swatch-${c.name.toLowerCase()}`}
            className={`h-14 w-14 rounded-xl border-4 ${
              selected === c.hex ? 'border-navy ring-4 ring-gold' : 'border-white shadow'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={save}
          className="min-h-tap rounded-xl bg-teal px-8 text-xl font-bold text-white hover:bg-teal-dark"
          data-testid="coloring-save"
        >
          {t('saveColoring')}
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="min-h-tap rounded-xl border-2 border-teal bg-white px-8 text-xl font-bold text-teal hover:bg-teal-light"
        >
          {t('downloadPng')}
        </button>
      </div>
      <p aria-live="polite" className="min-h-[1.5rem] text-center text-xl font-bold text-teal">
        {saved && t('savedOk')}
      </p>
    </div>
  );
}
