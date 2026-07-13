---
name: add-power-up-item
description: Recipe for adding a new power-up/item type to the PANG game (drop, pickup, effect, HUD, rendering). Use this instead of re-deriving the pattern from scratch each time.
---

# Adding a new power-up item

Follow this checklist when adding a new item type to PANG (e.g. a future
"double damage" or "shield refill" item). It mirrors how the existing items
(double wire, clock, hourglass, barrier, 1UP, dynamite) were implemented.

1. **Design first.** Add the new item to `docs/design/phase3_4.md`: what it
   does, duration (if timed), and roughly how common it should be relative
   to existing items.
2. **Type.** Add the new item's key to the `ItemType` union in
   `src/game/types.ts`.
3. **Constants.** In `src/game/constants.ts`:
   - Add it to `ITEM_WEIGHTS` with a relative weight (common effects ~20,
     risk/reward effects like dynamite/1UP ~9).
   - Add any duration/magnitude constants it needs (e.g. `_DURATION_MS`).
4. **Effect logic.** In `src/GamePlay.tsx`, where item pickups are handled:
   - Add a `useRef` for the effect's active-until timestamp (or a counter,
     for stackable effects like the barrier).
   - Apply the effect in the game loop where it belongs (e.g. timed effects
     gate a `time < xUntilRef.current` check; instant effects like 1UP just
     mutate state once on pickup).
5. **Rendering.** Give the item a distinct single-letter label and color in
   the item-drawing code, consistent with the existing items' style
   (small circle/label, not a photorealistic icon).
6. **HUD.** If the effect is timed or stackable, surface it in the
   `buffs`/hint-panel state so the player can see it's active.
7. **Verify.** `npx tsc --noEmit -p tsconfig.app.json`, `npm run build`,
   `npm run lint` must all pass.
8. **Commit.** Docs commit first, then a `feat:` commit, per
   `CLAUDE.md`'s commit convention.
