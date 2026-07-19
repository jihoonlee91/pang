# Phase 1-5. Stage Map

## Goal

- A read-only "Stage Map" screen reachable from the main screen, showing all 10 stages as small preview thumbnails with their theme name and number

## Design

- Accessed via a "Stage Map" button on the main screen; a "Back" button returns to the main screen
- Shows all 10 stages (the 5 world-tour themes from `phase3_3.md`, repeating for stages 6-10) as a grid of cards, each with:
  - Stage number
  - Theme name
  - A small preview thumbnail rendered by calling the same background-drawing function used in actual gameplay — extracted into `src/game/backgrounds.ts` and shared by both `GamePlay.tsx` and the stage map, so the map can never drift out of sync with the real in-game background
- This screen is purely informational (no stage-select/jump-to-stage functionality); stages are still played in order from Mission 1

## Jump-to-stage quick nav (150-stage update)

- With the roster now at 150 stages (`phase5_9.md` through
  `phase5_13.md`), scrolling to find a specific stage card got
  tedious. Added a small "Jump to stage" number input + Go button
  above the grid (`StageMap.tsx`) — submitting scrolls the matching
  card (`id="stage-map-card-{index}"`) into view with
  `scrollIntoView({ block: 'center', behavior: 'smooth' })`. Out-of-range
  or non-integer input is a silent no-op rather than an error state.
- Purely a scroll-position convenience; it doesn't select or start a
  stage on its own — the existing card click/select flow (in
  `onStartStage` mode) is unchanged.
