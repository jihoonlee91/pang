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
- Touch/mobile controls: direct touch on the canvas, no on-screen buttons
  - Drag (touch + move): sets a target x position (current ship position + finger's horizontal delta since touch start), but the ship still only moves toward that target at the same max speed as keyboard movement (300px/s) — this keeps drag from being an unfair "teleport dodge" compared to keyboard/on-screen controls
  - Tap (touch down and up without dragging past a small threshold): fires once, equivalent to a single Space press
  - Implemented as pointer events on the canvas itself (`touch-action: none` to prevent page scroll while dragging)

### Drag-to-move outside the canvas (portrait)

- In portrait, the canvas keeps its 16:9 aspect ratio inside a narrow,
  tall viewport (`#root` centers the whole play area), so there's real
  dead space above/below the canvas — swiping there previously did
  nothing, forcing a thumb reach back onto the (letterboxed, often
  visually small) canvas itself to steer.
- A second, identical drag listener is attached to `window` (not the
  canvas), sharing the exact same `dragRef`/`dragTargetXRef` state and
  clamp/scale math as the canvas's own handler. It's a no-op for any
  touch that starts on the canvas itself, an HUD control, a
  touch-control button, or the hint panel (`target.closest('.gameplay-hud,
.touch-controls, .hint-panel, canvas, button')`) — those keep working
  exactly as before, handled solely by their own element. Every other
  touch on the play screen (the dead space around/below the canvas,
  including in landscape/desktop) now drags the ship the same way, and
  a tap-without-drag there fires a harpoon too, for consistency with
  tapping the canvas directly.
