# Phase 1-5. Stage Map

## Goal

- A read-only "Stage Map" screen reachable from the main screen, showing all 10 stages as small preview thumbnails with their theme name and number

## Design

- Accessed via a "Stage Map" button on the main screen; a "Back" button returns to the main screen
- Shows all 10 stages (the 5 world-tour themes from `phase3_3.md`, repeating for stages 6-10) as a grid of cards, each with:
  - Stage number
  - Theme name
  - A small preview thumbnail rendered by calling the same `draw*Background` function used in actual gameplay (`GamePlay.tsx`), at a reduced canvas size — not a separate hand-drawn image, so it never drifts out of sync with the real in-game background
- This screen is purely informational (no stage-select/jump-to-stage functionality); stages are still played in order from Mission 1
