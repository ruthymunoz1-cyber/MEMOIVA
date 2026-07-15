# MEMOIVA App Documentation

This folder is the documentation home for the MEMOIVA web app (the code in
`/app`). It replaces the docs that previously lived only in another Claude
session.

## What's here (rebuilt from the actual code — accurate as of v1)

| File | What it covers |
|---|---|
| `app-architecture.md` | Tech stack, routes, roles, data layer, planned Supabase schema, i18n, accessibility rules |
| `program-state.md` | Living inventory of what's built vs. mocked vs. not started. **Check this first, update it last** in every work session. |
| `deployment-and-hosting.md` | Hosting decision (Netlify vs Supabase vs Vercel), PIN-gate option, and the path to iOS/Android apps |

## ⚠️ Docs that still need to be re-uploaded

These reference documents were shared with a *different* Claude session and
were never pushed to GitHub, so they could not be transferred automatically.
They exist only on your computer (and possibly in a claude.ai Project's
knowledge). To get them into this repo permanently, attach them in a Claude
Code session and ask for them to be committed here:

- `MEMOIVA_Implementation_Specification.docx` — full program spec, cohort/block model, language expansion strategy
- `MEMOIVA_WebApp_Architecture_Spec.docx` — original architecture spec (superseded in part by `app-architecture.md`, but keep the original)
- `SKILL.md` — the callable curriculum builder skill (five build workflows)
- `pedagogy.md` — research basis for structural decisions
- `character-system.md` — story universe rules, locked vs. configurable elements
- `assessment-design.md` — pre/post instrument design, placement test guidance
- `short-movie-talks.md` — locked design for the silent-video TPRS activity
- `file-structure.md` — technical build pattern, shared code library
- `MEMOIVA_Claude_Project_Instructions` — the project instructions file itself

Once uploaded, they should live in this folder (convert .docx content to
markdown alongside the originals so future sessions can read them without
Word).

## Related docs elsewhere in the repo

- `/docs/project-brief.md` — canonical brand/pricing/IP spec for the public site. **Section 3 lists proprietary curriculum details that must never appear in public pages.** That rule applies to the app's marketing surfaces too.
- `/app/README.md` — how to run and build the app.
