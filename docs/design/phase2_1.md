# Phase 2-1. Player Controls & Harpoon

> This is a draft. Details will be finalized after discussion.

## Goal

- Implement left/right movement
- Handle fire input
- Implement the harpoon traveling in a straight line up to the ceiling
- Implement despawning on ball/ceiling contact and firing restrictions

## Design

- Canvas size: 960x540 (widescreen aspect ratio)
- Player: fixed y at the bottom, a rectangle that can move left/right, movement speed 300px/s (keyboard ←/→ or A/D)
- Fire: Space key, only 1 harpoon can exist at a time by default (the existing harpoon must disappear before firing again; the double-wire power-up raises this to 2)
- The harpoon moves upward from the player's x position at 700px/s, and despawns on reaching the ceiling or colliding with a ball
- Touch/mobile controls: on-screen Left/Right/Fire buttons (`TouchControls`) are the primary input; direct drag anywhere on the play screen is a secondary, equivalent way to move
  - Drag (touch/mouse + move): the pointer's clientX maps directly (absolute, not relative to where the drag started — see "Absolute drag mapping" below) to a target x position, but the ship still only moves toward that target at the same max speed as keyboard movement (300px/s) — this keeps drag from being an unfair "teleport dodge" compared to keyboard/on-screen controls
  - Firing is exclusively the dedicated Fire button (and Space on keyboard) — a plain tap/click with no drag does **not** fire. This used to be a canvas-only tap gesture, but a tap-to-fire dead reckoning on _any_ part of the drag region (see below) made accidental fires from a quick reposition too easy, and conflicted with holding Fire in one hand while steering with the other, so tap-to-fire was dropped entirely in favor of button-only firing.
  - Implemented as a single `window`-level pointer listener (not scoped to the canvas), `touch-action: none` on the canvas to prevent page scroll while dragging on it

### Drag-to-move outside the canvas (portrait)

- In portrait, the canvas keeps its 16:9 aspect ratio inside a narrow,
  tall viewport (`#root` centers the whole play area), so there's real
  dead space above/below the canvas — swiping there previously did
  nothing, forcing a thumb reach back onto the (letterboxed, often
  visually small) canvas itself to steer.
- The drag listener lives on `window`, not the canvas, so it already
  covers the whole play screen — canvas and dead space alike — with one
  code path (`dragRef`/`dragTargetXRef`, clamp/scale math against the
  canvas's own bounding rect for coordinate conversion). It's a no-op
  for any touch that starts on an HUD control, a touch-control button,
  or the hint panel (`target.closest('.gameplay-hud, .touch-controls,
.hint-panel, button')`) — those keep working exactly as before,
  handled solely by their own element's own handlers.
- The drag state is `pointerId`-scoped (`dragRef.current.pointerId`,
  checked on every move/up event) so a second, simultaneous touch —
  most notably holding the Fire button with one finger while dragging
  to move with another — can never hijack or corrupt an in-progress
  drag's start position. Combined with dropping tap-to-fire (above),
  moving and firing are now fully independent gestures that can happen
  at the same time without interfering with each other.

### Dead-zone drag silently not registering (single touch)

- Found after shipping the above: a **single** touch dragging in the
  dead zone did nothing, but the exact same drag worked fine if a
  second finger was already holding the Fire button. Root cause:
  `body` sets `touch-action: manipulation` globally (`index.css`, so
  the menu/map/settings screens can still scroll). That permits the
  browser's own pan-gesture recognizer to compete with our
  `pointermove` listener for a touch that starts outside the canvas —
  on a lone touch the browser can win and start a native pan before our
  handler's `preventDefault()` (itself gated behind a 4px-moved
  threshold) ever runs, which can end the pointer sequence early. A
  second touch already in progress (e.g. holding Fire) happened to
  avoid this because the browser doesn't start a _new_ pan gesture
  once one touch is already claimed — which is what made it look
  Fire-button-dependent rather than what it actually was.
- Fixed by locking `document.body.style.touchAction = 'none'` for the
  lifetime of the `GamePlay` screen (a `useEffect` that restores the
  previous value on unmount), removing the competition entirely rather
  than just reacting to it after the fact.

### Absolute drag mapping (edges hard to reach)

- The original drag was relative: the target moved by the pointer's
  delta from wherever the drag _started_, joystick-style. That made
  the screen edges hard to reach — how far the target could travel was
  capped by how much physical screen room was left between the drag's
  start point and the edge, so starting a drag already near an edge
  (a natural thing to do when you specifically want to go there) left
  little or no room to push further, and reaching the far edge from a
  central start point could require more physical drag distance than
  the screen had.
- Switched to an absolute mapping instead: `dragTargetXRef` is
  recomputed on every `pointerdown`/`pointermove` as
  `((clientX - canvasRect.left) / canvasRect.width) * CANVAS_WIDTH`,
  clamped to the ship's valid range — using the _canvas's_ bounding
  rect as the horizontal reference even for touches in the dead zone
  above/below it, so the mapping is consistent regardless of where
  vertically the touch lands. Holding the pointer at the physical
  left/right edge of the canvas (or the dead zone directly below/above
  it) now always corresponds to the ship's leftmost/rightmost position,
  and the existing per-frame speed cap (unchanged) still stops this
  from being a "teleport dodge" — it just means holding near an edge
  now reliably _walks_ the ship there, the same way holding the
  Left/Right button does.
- `dragRef` no longer needs to remember where the drag started
  (`startClientX`/`startPlayerX`) or whether it moved (`moved`, which
  only existed to gate the now-removed tap-to-fire) — it's just the
  owning `pointerId`.
