import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import * as dataClient from '../../lib/dataClient';

/**
 * Coloring Studio — SVG fill-by-tap. One demo illustration (house, sun,
 * tree, flower) with 10 fillable <path> regions. Pick a swatch, tap a
 * region to fill it. Save persists fill state via the adapter (localStorage
 * in v1); Download renders the SVG to canvas and exports a PNG.
 */

const OUTLINE = '#1A2B4C';

// Region ids + path data. Order matters (later paths draw on top).
const REGIONS = [
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
  const [fills, setFills] = useState({});
  const [selected, setSelected] = useState(PALETTE[4].hex);
  const [saved, setSaved] = useState(false);
  const svgRef = useRef(null);
  const week = cohort?.current_week ?? 1;

  useEffect(() => {
    if (!user) return;
    let alive = true;
    dataClient.getColoringProgress(user.id, week).then((row) => {
      if (alive && row?.image_data) setFills(row.image_data);
    });
    return () => {
      alive = false;
    };
  }, [user, week]);

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  function fillRegion(id) {
    setSaved(false);
    setFills((f) => ({ ...f, [id]: selected }));
  }

  async function save() {
    await dataClient.saveColoringProgress({
      participantId: user.id,
      weekNumber: week,
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
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `memoiva-coloring-week-${week}.png`;
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
        <p className="mt-2 text-lg text-body/80">{t('coloringHint')}</p>
      </div>

      <div className="rounded-2xl bg-card p-4 shadow">
        <svg
          ref={svgRef}
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          role="img"
          aria-label="Coloring picture: a house with a sun, a tree, and a flower"
          data-testid="coloring-svg"
        >
          <rect x="0" y="0" width="400" height="300" fill="#FFFFFF" />
          {REGIONS.map((r) => (
            <path
              key={r.id}
              d={r.d}
              fill={fills[r.id] ?? '#FFFFFF'}
              stroke={OUTLINE}
              strokeWidth="3"
              strokeLinejoin="round"
              tabIndex={0}
              role="button"
              aria-label={`${r.label}`}
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
