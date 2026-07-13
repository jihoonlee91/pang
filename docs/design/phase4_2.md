# Phase 4-2. Record Storage

## Goal

- Store play records (score, stage reached, timestamp) locally

## Design

- Store an array of play records as JSON under the `pang_scores` key in `localStorage`. Each record has the shape `{ score, stageReached, result, playedAt }`
  - `stageReached`: which stage was reached (the stage the player died on for game over, or the last stage for a clear)
  - `result`: `'clear' | 'gameover'`
  - `playedAt`: the time the game ended (ISO string)
- Keep at most 50 records (sort by score descending and keep the top 50); older, lower records are automatically trimmed
- Compute the high score from the record array instead of the old single `pang_high_score` value (no backward compatibility needed; migration is skipped since this hasn't been released yet)
