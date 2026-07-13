# Phase 2-3. Win/Lose Flow

> This is a draft. Details will be finalized after discussion.

## Goal

- HP decreases on ball-player collision, game over at HP 0
- Stage clear when all balls are removed
- Connect the play screen to the game over/clear result (see Phase 1 for the actual screen transition)

## Design

- Max HP 3, HP decreases by 1 on collision with a ball
- Grant 1.2 seconds of invulnerability after being hit (to prevent consecutive hits)
- Game over at HP 0, stage clear when all balls on screen are removed
- On the HUD, HP is shown as a filled gauge bar instead of a number
- To lower the barrier to entry, a controls/strategy hint panel is always shown beside the play screen (controls, split rules, combo, obstacles, invulnerability time, etc.)
