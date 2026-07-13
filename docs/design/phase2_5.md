# Phase 2-5. Bouncing

> This is a draft. Details will be finalized after discussion.

## Goal

- Implement wall/floor/ceiling bounce behavior

## Design

- Left/right walls: reverse x velocity
- Floor/ceiling: reverse y velocity, with a restitution coefficient of 0.995 — slightly below perfectly elastic — so it decays naturally over time (bounces at a nearly constant rate like classic Pang, but with a slight decay for a sense of physical stability)
- The same restitution coefficient is applied to left/right wall bounces too, so horizontal velocity decays slightly as well
- Ceiling: balls only bounce off the ceiling and don't disappear (only the harpoon despawns at the ceiling)
- Bug fix: accumulated restitution decay caused vertical velocity to converge to nearly 0 on the floor/obstacle, making balls look like they were "rolling along the floor without bouncing." A minimum bounce speed floor, `MIN_BOUNCE_SPEED` (220px/s), is applied to all bounces (wall/floor/ceiling/obstacle) so they always bounce at a visibly noticeable speed (the `reflect`/`reflectAway` helpers in `engine.ts`)
