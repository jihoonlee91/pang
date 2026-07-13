# Mission 1 (Tutorial Stage)

## Purpose

As the first stage, it lets the player learn the basic controls (move/fire) and the ball-splitting rules.

## Composition

- Ball count: 1 (the starting ball count for stage n (0-indexed) is n+1, so the first stage has 1)
- Ball size: starts with 1 ball at the largest stage (level 2)
- Difficulty: lowest. Under the per-stage speed multiplier formula = 1 + n * 0.15, the first stage has a
  multiplier of 1x, the slowest
- Background theme: Mt. Fuji (Japan)

See `docs/design/phase3_1.md` and `docs/design/phase3_2.md` for the detailed stage composition/difficulty formula.

## Clear Condition

- Cleared when all balls in the stage are removed
