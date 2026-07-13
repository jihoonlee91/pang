# Phase 3-4. Power-ups

## Goal

- Review and introduce power-up/item elements

## Design

- (Reference) Items from the original Pang: Vulcan missile, double wire, power wire, clock (stop), hourglass (slow), barrier (single-use defense), dynamite (a hazard that splits all balls to their smallest size), 1UP
- The scope of this implementation (the 4 core items plus 1UP/dynamite) is simplified into an "apply an effect" model rather than weapon swapping
  - Double wire: allows keeping 2 harpoons active at once for 12 seconds (`DOUBLE_WIRE_DURATION_MS`)
  - Clock: stops all balls' movement for 6 seconds (no damage even if touched) (`CLOCK_DURATION_MS`)
  - Hourglass: slows all balls' speed to 0.4x for 8 seconds (`HOURGLASS_DURATION_MS`, `HOURGLASS_SLOW_FACTOR`)
  - Barrier: negates the next hit once (consumed on use; stacks as a count if multiple are held)
  - 1UP: immediately restores 1 HP (the original grants an extra life, but since this project has no lives concept, it's replaced with an HP restore, capped at MAX_HP)
  - Dynamite: a hazard — on pickup, all balls on screen recursively split down to the smallest size (level 0) instantly (`explodeToSmallest`), and awards no score
- Items have a small chance of dropping randomly when a ball is split/removed by a hit (`ITEM_DROP_CHANCE` = 14%), then fall under gravity and despawn if they go off-screen. Touching one as the player applies its effect immediately and plays a sound effect
- The dropped item's type is decided via a weighted draw (`ITEM_WEIGHTS`): double wire/clock/hourglass/barrier appear relatively often (20-22 each), while 1UP and dynamite appear rarely (9 each)
- The Vulcan missile/power wire (weapon-swap types) are excluded from this scope
