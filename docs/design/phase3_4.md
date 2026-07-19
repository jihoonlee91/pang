# Phase 3-4. Power-ups

## Goal

- Review and introduce power-up/item elements

## Design

- (Reference) Items from the original Pang: Vulcan missile, double wire, power wire, clock (stop), hourglass (slow), barrier (single-use defense), dynamite (a hazard that splits all balls to their smallest size), 1UP
- The scope of this implementation (the 4 core items plus 1UP/dynamite) is simplified into an "apply an effect" model rather than weapon swapping
  - Double wire: allows keeping 2 harpoons active at once for 12 seconds (`DOUBLE_WIRE_DURATION_MS`)
  - Clock: stops all balls' movement for 6 seconds (no damage even if touched) (`CLOCK_DURATION_MS`). The stage timer stops right along with the balls — it wouldn't make sense for a frozen screen to still burn down the clock — and resumes at the normal rate once Clock ends.
  - Hourglass: slows all balls' speed to 0.4x for 8 seconds (`HOURGLASS_DURATION_MS`, `HOURGLASS_SLOW_FACTOR`). The stage timer slows to the same 0.4x rate while it's active, for the same reason.
  - Barrier: negates the next hit once (consumed on use; stacks as a count if multiple are held)
  - 1UP: immediately restores 1 HP (the original grants an extra life, but since this project has no lives concept, it's replaced with an HP restore, capped at MAX_HP)
  - Dynamite: a hazard — on pickup, all balls on screen recursively split down to the smallest size (level 0) instantly (`explodeToSmallest`), and awards no score
- Items have a small chance of dropping randomly when a ball is split/removed by a hit (`ITEM_DROP_CHANCE` = 14%), then fall under gravity and despawn if they go off-screen. Touching one as the player applies its effect immediately and plays a sound effect
- The dropped item's type is decided via a weighted draw (`ITEM_WEIGHTS`): double wire/clock/hourglass/barrier appear relatively often (20-22 each), while 1UP and dynamite appear rarely (9 each)
- Vulcan missile and power wire were later implemented too (see "Vulcan and Power Harpoon tuning" below) — the "excluded from this scope" note above no longer applies
- When an item is picked up, a short-lived popup announces which effect just triggered (e.g. "Double Wire!", "Barrier!") at the pickup location, using the same popup mechanism as score-gain text (`phase4_1.md`), so the effect is never a mystery to the player

## Vulcan and Power Harpoon tuning

- **Vulcan** (rapid-fire, `MAX_VULCAN_SHOTS`/`VULCAN_DURATION_MS`) trivialized the early-mid game once picked up, so it's capped to only drop through stage 30 (0-indexed, `VULCAN_END_STAGE` in `getItemWeights`) — the same range World Tour II covers — and steps out of the pool for every stage after.
- **Power Harpoon** (`powerWire`, pierces through balls for `POWER_WIRE_DURATION_MS`) had its duration halved (12s → 6s) and its drop weight doubled (10 → 20, now the second-most-common item after Double Wire) — shows up much more often but each pickup is a shorter, punchier burst rather than a long stretch of trivial clearing.

## Late-stage item: Stabilizer

- Stages 41-70 (The Trench / Stellar Forge / Cosmic Frontier, see `phase5_1.md`/`phase5_2.md`/`phase5_6.md`) and stages 71-80 (Vortex Frontier, see `phase5_5.md`) introduce their own hazard on top of gravity — a lateral current, a gravity well, a nebula field (two weaker wells), or a spinning vortex well. Stabilizer briefly neutralizes whichever is active for 8 seconds (`STABILIZER_DURATION_MS`), giving the player a clean breather from the extra push/pull without touching the base physics.
- Only rolled into the item pool from stage 41 onward (`getItemWeights`, `STABILIZER_START_STAGE`) — it would do nothing in earlier stages, so it never appears there.
- Weight 12 among that pool's items (same tier as clock/hourglass/barrier).
- Does not neutralize the Hell (`phase5_7.md`) fire zones or Void (`phase5_8.md`) low gravity — those aren't a push-toward-a-point hazard to cancel, they're a direct damage mechanic and a baseline physics change respectively.

## Cosmic Frontier item: Nova Surge

- Rolled into the item pool from stage 61 onward (`NOVA_SURGE_START_STAGE`), staying in the pool for every later stage, same pattern as Stabilizer.
- Doubles the score gained from hitting balls for 10 seconds (`NOVA_SURGE_DURATION_MS`, `NOVA_SURGE_MULTIPLIER`) — does not affect scoreBonus/timePlus or other flat bonuses.
- Weight 9 among that pool's items (same tier as oneUp/dynamite).

## Hell item: Fireproof, Void item: Anchor

- The two hazards Stabilizer explicitly doesn't cover (fire zones, low
  gravity — see `phase3_4.md`'s Stabilizer section above) each get their
  own dedicated item instead, so every hazard block still pairs with
  something new per rule "테마가 바뀌면 새로운 아이템이나 맵 장치같은게
  등장해야한다" (a theme change should bring a new item or map device).
- **Fireproof** (`FIREPROOF_START_STAGE`, stage 81 onward): 8 seconds
  (`FIREPROOF_DURATION_MS`) of immunity to Hell's fire-zone damage
  specifically — touching an active zone while Fireproof is up does
  nothing. Weight 10.
- **Anchor** (`ANCHOR_START_STAGE`, stage 91 onward): 8 seconds
  (`ANCHOR_DURATION_MS`) of restored normal gravity in Void — balls fall
  predictably again instead of drifting, letting the player briefly read
  landing spots the normal way. Weight 10.

## New general-purpose items: Magnet, Combo Lock, Shockwave

Three items rolled into the base pool from stage 1 onward (not tied to any
specific hazard block), rounding out the roster with effects distinct from
every existing item:

- **Magnet** (`MAGNET_DURATION_MS` = 8s): for the duration, every dropped
  item on screen steers toward the player instead of falling straight down.
  Implemented as an exponential horizontal approach in `stepItem`
  (`engine.ts`) — a `magnetTargetX` parameter that, when given, closes a
  fraction (`MAGNET_PULL_RATE` = 4/sec) of the remaining gap each frame, so
  nearby items snap in fast while far ones still take a moment. Weight 10
  (same tier as barrier/speedBoost).
- **Combo Lock** (`COMBO_LOCK_DURATION_MS` = 10s): the combo counter no
  longer resets from missing the `COMBO_WINDOW_MS` timing gap while active
  — every hit increments it regardless of pacing. Pure QoL/scoring item,
  no interaction with any hazard. Weight 8 (same tier as timePlus/scoreBonus).
- **Shockwave**: an instant "positive Dynamite" — every ball currently on
  screen splits down exactly one level (not recursively to the smallest,
  unlike Dynamite), each split awarding the same per-ball score a normal
  harpoon hit would (combo multiplier and Nova Surge included). A burst of
  score at the cost of leaving more (smaller) balls to clear. Weight 6
  (same tier as invincible — a powerful effect, kept rarer).

All three follow the same "apply an effect" model and popup-announcement
pattern as every other item; Magnet and Combo Lock are timed buffs shown
in the HUD buff list, Shockwave is instant like Dynamite/1UP/Score Bonus.
