# Phase 2-7. Collision Precision

> This is a draft. Details will be finalized after discussion.

## Goal

- Improve precision of harpoon-ball and ball-ball collision detection
- Ensure frame independence via delta-time-based updates

## Design

- Harpoon-ball: determined by whether the harpoon's x is within the ball's radius range and whether the harpoon's y has passed the ball's center
- Ball-ball: pass through each other within this scope (ball-ball collisions are excluded; revisit in a later phase if needed)
- Ball-player: determined via an approximate circle-rectangle distance check
- requestAnimationFrame's delta time (ms) is multiplied into the velocity/position calculations every frame to keep updates frame-independent
