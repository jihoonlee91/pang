# Phase 1-6. Attract/Demo Mode

## Goal

- A "Watch Demo" option on the main screen that runs an AI-controlled playthrough (godmode, so it always looks like a flawless clear), with an on-screen indicator of which inputs the AI is "pressing"

## Design

- Main screen gets a second button, "Watch Demo", alongside "Start". Clicking it goes straight into gameplay (skipping the countdown) with `demo` mode active
- In demo mode:
  - A simple heuristic AI controls the player every frame instead of reading keyboard/touch input: it targets the ball closest to the floor (most urgent), moves toward that ball's x position (within a small deadzone), and fires when roughly aligned and a harpoon slot is free
  - The player is invulnerable to ball damage (HP never decreases) so the demo always looks like a clean, flawless run — this is a deliberate "attract mode" trick (real arcade cabinets do the same), not meant to represent normal difficulty
  - When a stage clears, it loops to the next stage; after the last stage, it loops back to stage 1 and keeps playing indefinitely until the player exits
  - Demo runs are never recorded to the local score history (`phase4_2.md`) — it isn't a real play session
  - A small on-screen "DEMO" badge is shown, plus a row of key indicators (←, →, Space) that light up in sync with whatever the AI is currently "pressing", so viewers can see the input driving the play
  - An "Exit Demo" control returns to the main screen at any time
