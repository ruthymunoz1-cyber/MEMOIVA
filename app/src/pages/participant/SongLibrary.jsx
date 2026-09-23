import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/**
 * Song Library — this week's signature song (MEMOIVA's own, one per week —
 * "songs every session" is a locked brand decision, see project-brief.md)
 * plus a browsable public-domain catalog in the current UI language.
 */
export default function SongLibrary() {
  const { language, t } = useApp();
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    let alive = true;
    dataClient.getSongs(language).then((rows) => {
      if (alive) setSongs(rows);
    });
    return () => {
      alive = false;
    };
  }, [language]);

  if (!songs) return <p className="text-xl text-navy">{t('loading')}</p>;

  const signature = songs.filter((s) => s.is_signature);
  const catalog = songs.filter((s) => !s.is_signature);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{t('songLibraryTitle')}</h1>
        <p className="mt-2 text-lg text-body/80">{t('songLibraryIntro')}</p>
      </div>

      {signature.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-navy">{t('thisWeeksSong')}</h2>
          <ul className="mt-3 space-y-3">
            {signature.map((song) => (
              <SongRow key={song.id} song={song} t={t} />
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold text-navy">{t('songCatalogTitle')}</h2>
        <ul className="mt-3 space-y-3">
          {catalog.map((song) => (
            <SongRow key={song.id} song={song} t={t} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function SongRow({ song, t }) {
  return (
    <li>
      <Link
        to={`/app/songs/${song.id}`}
        className="flex min-h-tap items-center justify-between rounded-xl border-2 border-teal bg-card px-5 py-3 hover:bg-teal-light"
      >
        <span className="text-xl font-bold text-navy">{song.title}</span>
        <span className="text-lg text-body/70">
          {song.audio_url ? t('songReady') : t('songComingSoon')}
        </span>
      </Link>
    </li>
  );
}
