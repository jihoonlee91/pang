# Phase 6-2. Glossary and First-Encounter Hazard Intro

## Goal

- With 19 items and 7 map hazards now in the game, a player has no way
  to look up what something does outside of the brief in-game pickup
  popup (which vanishes after ~2s) or the hint panel's live buff list
  (which only shows what's currently active). Give them a reference
  page, and proactively explain a hazard the first time they actually
  reach it.

## Design

### Shared item display data

- `ITEM_COLORS`, `ITEM_TITLES`, `ITEM_DESCRIPTIONS`, and the canvas icon
  renderer `drawFallingItemIcon` (plus its `traceShield`/`traceStar`
  helpers) were previously private to `GamePlay.tsx`. Extracted verbatim
  into `src/game/itemDisplay.ts` so both `GamePlay.tsx` and the new
  Glossary screen render the exact same icon a player sees in-game — no
  separate "glossary art" to keep in sync.
- `GamePlay.tsx`'s own `ITEM_LABELS` (single-letter badge shown on the
  falling item itself) stayed local — it's not needed outside gameplay.

### Hazard catalog

- `src/game/hazardCatalog.ts`: `HAZARD_CATALOG`, a static list of the 7
  map hazards (Dimension Portals, Undersea Current, Gravity Well, Nebula
  Field, Vortex, Fire Zones, Low Gravity), each with an id, display name,
  0-indexed start stage (imported from the hazard's own module —
  `PORTAL_START_STAGE`, `CURRENT_START_STAGE`, etc. — so the catalog can
  never drift out of sync with the actual stage ranges), and a Korean
  description matching `ITEM_DESCRIPTIONS`'s tone/length.
- `getHazardIntroForStage(stageIndex)` returns the hazard whose start
  stage exactly matches, or `null` — used to detect "the player just
  crossed into genuinely new territory," not "this hazard happens to be
  active on this stage" (which would fire on every stage in the block).

### Glossary screen

- New `src/Glossary.tsx`, reachable via a "Glossary" button on the main
  screen (same `.screen` full-page treatment as Stage Map/Settings/
  What's New). Two sections:
  - **Items**: every `ItemType`, each as a card with its actual in-game
    icon (rendered on a small `<canvas>` via `drawFallingItemIcon`),
    title, and description.
  - **Hazards**: every `HAZARD_CATALOG` entry, each as a card with a
    stage-number badge, name + starting stage, and description.
- Read-only, no gameplay side effects — purely a reference the player
  can open any time from the main menu.

### First-encounter hazard intro

- The first time a player's stage transitions into real gameplay
  (`isStarting` flips false, i.e. controls are live) on a hazard's exact
  start stage, and that hazard hasn't been seen before
  (`hasSeenHazard`/`markHazardSeen`, `src/game/seenHazards.ts`,
  localStorage-backed like `progress.ts`'s unlock tracking), `GamePlay`
  shows a blocking modal — reusing the existing `.pause-backdrop`/
  `.pause-panel` styling — with the hazard's name and description and a
  "Got It" button. The stage is paused (`setPaused(true)`) while it's
  shown, same as the existing pause menu, and only that hazard is
  suppressed from firing again once dismissed.
- Only checked when `!demo` (the AI attract loop never sees it) and
  tracked per-stage via a ref (`hazardIntroCheckedStageRef`) so it
  doesn't re-fire on every re-render of the same stage, only once per
  new `stageIndex`.
- Deliberately does _not_ trigger on the "get ready" `stageClear`
  countdown screen — that countdown auto-advances on its own timer
  regardless of the player, so a blocking modal there would either get
  silently dismissed by the screen change or desync from the timer. It
  fires once real gameplay begins instead, mirroring the same
  `isStarting`-transition timing the start-invulnerability re-arm fix
  (`phase5_7.md`) already uses.

## Files

- `src/game/itemDisplay.ts` — new file: `ITEM_COLORS`, `ITEM_TITLES`,
  `ITEM_DESCRIPTIONS`, `drawFallingItemIcon` (extracted from
  `GamePlay.tsx`)
- `src/game/hazardCatalog.ts` — new file: `HAZARD_CATALOG`,
  `getHazardIntroForStage`
- `src/game/seenHazards.ts` — new file: `hasSeenHazard`, `markHazardSeen`
- `src/Glossary.tsx` — new screen component
- `src/App.tsx` — `'glossary'` screen type, main-screen button, routing
- `src/GamePlay.tsx` — hazard-intro state/effect/modal
- `src/App.css` — `.glossary-*` and `.hazard-intro-desc` styles
