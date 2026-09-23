# MEMOIVA Song Library — Design Note

**Status:** v1 built and working (`SongLibrary.jsx`, `SongPlayer.jsx`,
`supabase/schema.sql`'s `songs` table). Real audio content is the
remaining gap — see §4.

## 1. What it is

Two kinds of songs, both browsable from a "Songs" tab in the participant
app:

- **Signature songs** — MEMOIVA's own, one per week (`is_signature: true`,
  linked from `weekly_content.signature_song_id`). Original lyrics
  written by RAMP, recorded to a public-domain melody, per your
  direction. "Songs every session" is a locked brand decision
  (`project-brief.md`), so every week has a reserved slot, whether or not
  the recording exists yet.
- **Catalog songs** — a browsable library of well-known public-domain
  songs, in English and Spanish, available anytime (not tied to a
  specific week).

## 2. Follow-along lyrics

Line-by-line highlight with auto-scroll, as you asked for — the current
line highlights and the view scrolls to it as the audio plays (jumps
instead of animating if the viewer has motion-reduction turned on).
Lyrics display in large text (24–30px), well above the app's 18px
baseline, for readability during singing.

## 3. Legal note on "public domain," worth having on record

A song's **composition** (melody + lyrics) can be public domain while a
specific **recording** of it is not — a modern studio recording of an old
folk song is usually still copyrighted as a performance, even though
anyone can legally use the underlying song itself. Your plan — RAMP
records its own vocal performances, for both the signature songs and the
catalog — sidesteps this entirely: every recording in the app will be
your own original performance, fully owned, regardless of how old the
underlying melody is. Worth confirming this is the actual plan (no
third-party recordings planned), since it's what makes the whole catalog
legally clean.

## 4. What's real vs. placeholder right now

- **Real:** the whole mechanism — database schema, the weekly signature-
  song slot, the catalog list, the synced-lyrics player. All working.
- **Placeholder, clearly labeled in the code and UI:** one catalog
  example per language ("Home on the Range" in English, "Cielito Lindo"
  in Spanish) — both genuinely public domain, used only to prove the
  lyrics-sync UI works, not a decision about what belongs in the real
  catalog. No audio exists for anything yet (`audio_url: null`
  everywhere) — the player shows "Recording coming soon" and still
  displays full lyrics, rather than breaking.
- **Reserved but empty:** the Week 1 signature song slot — title "(Coming
  soon)," no lyrics, no audio, waiting on your actual song.

## 5. What happens once real recordings exist

Add the recording's URL and, once someone times the lines against that
specific recording, the per-line timestamps — both go on the `songs` row
in Supabase (or in `seedData.js` for local demo mode). No code changes
needed; the player already handles real audio the moment it's there.
There's no admin UI to do this yet — for beta 1, it's a direct database
edit (same as everything else in the "Blocked / needs Ruthy" list in
`program-state.md`).

## 6. Open items

1. Confirm §3 — all recordings will be RAMP's own, nothing third-party
2. Supply the Week 1 signature song (or whichever song comes first)
3. Decide what belongs in the real public-domain catalog (the two
   examples here are placeholders, not a proposal)
