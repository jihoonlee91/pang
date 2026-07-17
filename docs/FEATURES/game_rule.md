# Game Rules

This document is an overview of the game rules. Numeric values and detailed formulas are managed in
`docs/design/phase2_*.md`, `phase3_*.md`, and `phase4_*.md`, so if this document and those disagree,
treat the design docs as authoritative.

## Basic Rules

- The player fires a harpoon to hit the balls on screen, splitting them and eventually removing them.
- Removing all the balls on screen clears the stage and progresses to the next one. There are 50 stages
  total, escalating through several distinct environmental hazards across the run: a vertical ladder
  section (stages 6-10), dimension-warp portals (stages 21-30), undersea currents (stages 31-40, see
  `docs/design/phase5_1.md`), and gravity wells (stages 41-50, see `docs/design/phase5_2.md`).
- Getting hit by a ball doesn't cause instant death — HP decreases by 1, and after being hit you become
  invulnerable for a set period (1.2 seconds). Game over occurs when HP reaches 0. HP is shown on the HUD
  as a filled gauge (segmented bar) plus a "current/max" number, for colorblind/screen-reader accessibility
  (see `docs/design/phase2_3.md`).

## Harpoon

- When fired, it extends in a straight line from the player's position to the screen's ceiling.
- It disappears when it touches a ball or the ceiling.
- If blocked by the striped platform obstacle fixed at the center of the screen, the harpoon despawns.
  Balls bounce off the top/bottom faces of this obstacle (see `docs/design/phase3_3.md`).
- Only 1 harpoon can be on screen at a time by default (2 with the double-wire power-up); you cannot fire
  again until a slot is free.

## Ball Splitting

- Balls have 3 size stages (small/medium/large). When hit by a harpoon, they're removed, and if not
  already the smallest stage, split into two balls one size smaller. If the smallest-stage ball is hit,
  it disappears completely without splitting (see `docs/design/phase2_2.md`).
- Balls are affected by gravity and fall, bounce off walls/floor/ceiling, always at a minimum visible
  bounce speed so they never settle into a non-bouncing roll (see `docs/design/phase2_4.md`, `phase2_5.md`).

## Power-ups

- Hitting a ball has a small chance of dropping an item (double wire, clock, hourglass, barrier, 1UP, or
  dynamite) that falls under gravity; touching it applies its effect immediately, with a popup announcing
  which effect triggered (see `docs/design/phase3_4.md`).

## Controls

- Keyboard: ←/→ or A/D to move, Space to fire.
- Touch: drag on the canvas to move (capped at the same max speed as keyboard, for fairness), tap to fire
  (see `docs/design/phase2_1.md`).

## Score

- Removing a ball (including via splitting) awards a base score that varies by size (smaller balls are
  worth more).
- Hitting balls consecutively within a short time builds up a combo, increasing the score multiplier
  (see `docs/design/phase4_1.md`).
- Local play records (score, stage reached, timestamp, player name) are stored in the browser; the end
  screen shows this run's rank among all past local records (see `docs/design/phase4_2.md`, `phase4_3.md`).

## Other Screens

- **Stage Map**: a read-only screen (from the main menu) showing all 50 stages with live background
  previews (see `docs/design/phase1_5.md`).
- **Demo Mode**: a "Watch Demo" option that runs an AI-controlled, invulnerable playthrough on loop, with
  on-screen indicators of the AI's inputs (see `docs/design/phase1_6.md`).

## End Conditions

- Game over: when HP reaches 0
- Clear: when all 50 stages are cleared
