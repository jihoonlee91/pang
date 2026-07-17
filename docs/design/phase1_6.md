# Phase 1-6. Attract/AI Mode

## Goal

- A "Watch AI Play" option on the main screen that runs an AI-controlled playthrough with real stakes (it takes damage and can lose a run like a real player), with an on-screen indicator of which inputs the AI is "pressing"

## Design

- Main screen gets a second button, "Watch AI Play", alongside "Start". Clicking it goes straight into gameplay (skipping the countdown) with `demo` mode active
- In AI mode:
  - The AI has full knowledge of the game's physics: for each ball, it forward-simulates the exact same `stepBall` physics function used by real gameplay (not an approximation) to find the ball's next low point — the x position it will be at when it's closest to the player's row — and picks the ball whose low point arrives soonest as its shooting target. This is why it looks like it "knows" the trajectories rather than reactively chasing balls (`predictLandingSpot` in `src/game/engine.ts`)
    - The same per-ball predictions double as a danger map: `chooseSafeX` (`src/game/engine.ts`) treats a threat as relevant only if the AI could actually be standing there when it resolves (reachable in time at its current speed, and not already past) — a distant ball that will have landed and gone before the AI could ever reach that x isn't avoided for no reason. Among the reachable threats, it searches outward from the desired position for the nearest fully-clear spot (falling back to whichever spot has the most margin, in tight quarters), and overrides everything for an immediate reflex escape if something is about to land on its _current_ spot right now. This is genuine reactive avoidance, not scripted invulnerability
    - Actively seeks any falling power-up item on screen (items fall straight down, so no prediction needed beyond their current x), prioritizing item pickup over ball-popping — but still routed through the same danger-avoidance as a ball target, since grabbing an item is no longer risk-free
    - Fires only when roughly aligned with the ball target, settled (not mid-dodge), and a harpoon slot is actually free (so the on-screen SPACE indicator doesn't flash as if firing when no shot would actually happen)
  - The player takes real damage on contact, gets the same post-hit invulnerability window as normal play, and can lose all 3 HP and trigger a real game over — the run is a genuine (if AI-piloted) playthrough, not a scripted flawless clear
  - When a stage clears, it loops to the next stage; after the last stage, it loops back to stage 1. A game over also loops back to stage 1, so the attract loop keeps running indefinitely either way until the player exits
  - AI runs are never recorded to the local score history (`phase4_2.md`) — it isn't a real play session
  - A small on-screen "AI" badge is shown, plus a row of key indicators (←, →, Space) that light up in sync with whatever the AI is currently "pressing", so viewers can see the input driving the play
  - An "Exit AI Mode" control returns to the main screen at any time
