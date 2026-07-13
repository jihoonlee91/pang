# Game Rules

This document is an overview of the game rules. Numeric values and detailed formulas are managed in
`docs/design/phase2_*.md`, `phase3_*.md`, and `phase4_*.md`, so if this document and those disagree,
treat the design docs as authoritative.

## Basic Rules

- The player fires a harpoon to hit the balls on screen, splitting them and eventually removing them.
- Removing all the balls on screen clears the stage and progresses to the next one. There are 5 stages
  total, each with a different themed background (Mt. Fuji -> Guilin -> Emerald Temple -> Angkor Wat ->
  Ayers Rock) (see `docs/design/phase3_3.md`).
- Getting hit by a ball doesn't cause instant death — HP decreases by 1, and after being hit you become
  invulnerable for a set period (1.2 seconds). Game over occurs when HP reaches 0. HP is shown on the HUD
  as a filled gauge (segmented bar) rather than a number (see `docs/design/phase2_3.md`).

## Harpoon

- When fired, it extends in a straight line from the player's position to the screen's ceiling.
- It disappears when it touches a ball or the ceiling.
- If blocked by the striped platform obstacle fixed at the center of the screen, the harpoon despawns.
  Balls bounce off the top/bottom faces of this obstacle (see `docs/design/phase3_3.md`).
- You cannot fire again while a harpoon is still on screen.

## Ball Splitting

- Balls have 3 size stages (small/medium/large). When hit by a harpoon, they're removed, and if not
  already the smallest stage, split into two balls one size smaller. If the smallest-stage ball is hit,
  it disappears completely without splitting (see `docs/design/phase2_2.md`).
- Balls are affected by gravity and fall, bounce off walls/floor/ceiling, and decay slightly over time
  (see `docs/design/phase2_4.md`, `phase2_5.md`).

## Score

- Removing a ball (including via splitting) awards a base score that varies by size (smaller balls are
  worth more).
- Hitting balls consecutively within a short time builds up a combo, increasing the score multiplier
  (see `docs/design/phase4_1.md`).
- The high score is stored locally in the browser and shown on the end screen (see `docs/design/phase4_2.md`).

## End Conditions

- Game over: when HP reaches 0
- Clear: when all balls are removed through the final stage
