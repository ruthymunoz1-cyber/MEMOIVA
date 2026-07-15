import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import * as dataClient from './dataClient';

/**
 * Loads the signed-in participant's cohort, current-week content, progress
 * rows, and game scores through the adapter. Re-fetches when the language
 * changes (the demo cohort's track follows the language pick).
 */
export default function useParticipantData() {
  const { user, language } = useApp();
  const [state, setState] = useState({
    loading: true,
    cohort: null,
    content: null,
    progress: [],
    scores: [],
  });

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const cohort = await dataClient.getCohortForParticipant(user.id);
      const [content, progress, scores] = await Promise.all([
        cohort ? dataClient.getWeeklyContent(cohort.id, cohort.current_week) : null,
        dataClient.getParticipantProgress(user.id),
        dataClient.getGameScores(user.id),
      ]);
      if (alive) setState({ loading: false, cohort, content, progress, scores });
    })();
    return () => {
      alive = false;
    };
  }, [user, language]);

  return state;
}
