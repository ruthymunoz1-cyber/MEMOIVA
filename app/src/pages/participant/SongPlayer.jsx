import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/**
 * Song Player — audio plus big-font, line-by-line synced lyrics. The
 * active line highlights and the view auto-scrolls to it as the song
 * plays (respects prefers-reduced-motion — jumps instead of animating).
 * If no recording exists yet (audio_url is null), shows the full lyric
 * text with no timing, so the song is still usable to read/sing along
 * with live, and never shows a broken player.
 */
export default function SongPlayer() {
  const { songId } = useParams();
  const { t } = useApp();
  const [song, setSong] = useState(null);
  const [activeLine, setActiveLine] = useState(-1);
  const audioRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    let alive = true;
    dataClient.getSong(songId).then((s) => {
      if (alive) setSong(s);
    });
    return () => {
      alive = false;
    };
  }, [songId]);

  useEffect(() => {
    if (activeLine < 0) return;
    const el = lineRefs.current[activeLine];
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }, [activeLine]);

  function handleTimeUpdate() {
    const t = audioRef.current?.currentTime ?? 0;
    const lines = song?.lyrics ?? [];
    const idx = lines.findIndex(
      (line) => t >= (line.start_seconds ?? 0) && t < (line.end_seconds ?? Infinity)
    );
    if (idx !== activeLine) setActiveLine(idx);
  }

  if (!song) return <p className="text-xl text-navy">{t('loading')}</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/app/songs" className="text-lg font-semibold text-teal hover:underline">
        {t('backToSongs')}
      </Link>

      <h1 className="text-3xl font-extrabold text-navy">{song.title}</h1>

      {song.audio_url ? (
        <audio
          ref={audioRef}
          src={song.audio_url}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="w-full"
        />
      ) : (
        <p className="rounded-xl border-2 border-gold bg-gold-light/20 px-4 py-3 text-lg text-navy">
          {t('songComingSoon')}
        </p>
      )}

      {song.lyrics.length > 0 ? (
        <ul className="space-y-3">
          {song.lyrics.map((line, i) => (
            <li
              key={i}
              ref={(el) => (lineRefs.current[i] = el)}
              className={`rounded-xl px-4 py-3 text-2xl font-semibold leading-relaxed sm:text-3xl ${
                i === activeLine ? 'bg-teal text-white' : 'text-navy'
              }`}
            >
              {line.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg text-body/70">{t('lyricsComingSoon')}</p>
      )}
    </div>
  );
}
