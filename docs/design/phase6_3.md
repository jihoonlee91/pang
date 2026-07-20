# Phase 6-3. Update Highlight & Session Encouragement

## Goal

- The app already detects a newly-deployed version (`isUpdateAvailable`,
  polling + auto-reload when the player is back at the main menu) and
  already has a full "What's New" screen (`WhatsNewDialog` /
  `RELEASE_NOTES`), but the two are never connected — a player who was
  just silently updated has no way to know anything changed short of
  manually opening Settings → What's New. Surface it to them
  automatically, once, the first time they land on the just-updated
  build.
- Separately, give the player a periodic, low-effort nudge to keep
  playing rather than stopping — something that shows up "in the
  middle" of a session (not just at the very end, where it's too late)
  and frames continuing as worthwhile.

## Design

### Auto-surfaced What's New on update

- New `src/game/versionSeen.ts`, localStorage-backed the same way as
  `seenHazards.ts`/`progress.ts` (`pang.last_seen_version.v1`):
  `getLastSeenVersion(): string | null` and
  `setLastSeenVersion(version: string): void`.
- In `App.tsx`, a mount-only effect compares `__APP_VERSION__` (already
  used for the version display and the update-poll comparison) against
  the stored value:
  - No stored value at all (a brand-new player, or the first load after
    this feature itself ships) → just silently store the current
    version. A new player has no "before" to compare to, so a changelog
    on their very first screen would be noise, not news.
  - Stored value present and different from the current version → the
    app was updated since this browser/device last recorded a version
    (covers both the existing auto-reload-at-main-menu path and a plain
    page reload after a redeploy). Route straight to the What's New
    screen once, then store the current version so it doesn't repeat on
    the next load.
  - Stored value present and equal → nothing to show, no-op.
- The What's New screen already supports one entry point (Settings →
  What's New, "Back" returns to Settings). Reused for the auto-surfaced
  case too, but "Back" needs to return to the main screen instead when
  it was opened this way — tracked with a small `whatsNewReturnTo`
  screen ref/state set right before navigating in, rather than adding a
  second dialog component.

### Milestone-screen personal-best encouragement

- "중간중간" (periodically, mid-session) is already naturally served by
  the existing milestone screen (every 10 stages, `MILESTONE_INTERVAL`)
  — frequent enough to matter, not so frequent it becomes noise the way
  a message on every single stage clear would.
- `scoreHistory.ts` gains `getBestScore(): number`, the max `score`
  across the player's stored history (0 if there's no history yet). The
  milestone screen compares the current run's `finalScore` (the run is
  still in progress at this point — `recordScore` hasn't run yet, so
  this is a fair "in-progress vs. all-time-best" comparison, not
  comparing a run against itself) against `getBestScore()` and shows one
  framing:
  - No history yet → first-ever-run framing ("every stage from here
    sets your first record").
  - Already ahead of the best → celebratory, reinforcing continuing.
  - Behind, but within a reachable margin → "closing in" framing that
    names the exact point gap, to make the goal concrete.
  - Behind by a lot → generic "keep pushing" framing, so a very high old
    best doesn't turn into a discouraging number thrown at the player.
- Pure display addition to the existing milestone screen — no new
  screen, no new timers, no change to scoring/progression logic itself.

## Files

- `src/game/versionSeen.ts` — new file: `getLastSeenVersion`,
  `setLastSeenVersion`
- `src/App.tsx` — update-detection-to-What's-New routing,
  `whatsNewReturnTo` handling
- `src/game/scoreHistory.ts` — `getBestScore`
- `src/App.tsx` — milestone screen encouragement line
