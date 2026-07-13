# Phase 2-2. Ball Split Logic

> This is a draft. Details will be finalized after discussion.

## Goal

- Ball-harpoon collision detection
- Split handling and removal of smallest-size balls

## Design

- Ball size stages: level 0 (small, radius 14) to level 2 (large, radius 28), 3 stages total
- When a harpoon touches a ball, that ball is removed, and if level > 0, 2 balls with a radius one stage smaller are spawned moving in opposite directions
- A level 0 ball is fully removed with no split when hit
