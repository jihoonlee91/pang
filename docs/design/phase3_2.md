# Phase 3-2. Difficulty Curve

> This is a draft. Details will be finalized after discussion.

## Goal

- Build the difficulty escalation curve across stage progression

## Design

- Speed multiplier for stage n (0-indexed) = `1 + min(n, 79) * 0.08`
  (`createStage`, `engine.ts`) — capped at the value stage 80 already
  reached under the original 80-stage design, added when `STAGE_COUNT`
  grew past 80 so stages 81-100 (Hell, Void) differentiate through their
  own hazard (fire zones, near-zero gravity) instead of raw ball speed
  climbing unbounded into unplayable territory.
- Mission 1 (Stage 1) serves as a tutorial, with 1 ball and slow speed
- Ball count for stage n (0-indexed) = `min(floor((n - 5) / 2) + 3, 8)` —
  caps at 8 balls from stage 16 onward.
- Time budget for stage n (0-indexed) = `STAGE_TIME_SECONDS - n`, floored at
  12 seconds (`getStageTimeSeconds`, `constants.ts`) — added when `STAGE_COUNT`
  grew past 90, since the unfloored formula went to zero/negative and ended
  the run the instant it started for every stage from 91 onward.
