# PLAN

A file laying out the goals for each phase.

## Phase 1. Basic Game Loop (menu/screen flow)

### Phase 1-1. Main Screen

- Show the main screen when the game loads

### Phase 1-2. Game Selection

- Implement the flow for selecting the game/mission to play from the main screen

### Phase 1-3. Start Button

- Transition to the gameplay screen when the start button is clicked

### Phase 1-4. Game End

- Show the end screen on game over/clear, and implement the restart/return-to-main flow

### Phase 1-5. Stage Map

- A read-only "Stage Map" screen reachable from the main screen, showing all 10 stages as small preview thumbnails with their theme name and number

### Phase 1-6. Attract/Demo Mode

- A "Watch Demo" option on the main screen that runs an AI-controlled playthrough (godmode, so it always looks like a flawless clear), with an on-screen indicator of which inputs the AI is "pressing"

## Phase 2. Realistic Physics

### Phase 2-1. Player Controls & Harpoon

- Handle left/right movement and fire input
- Implement the harpoon traveling in a straight line up to the ceiling
- Implement despawning on ball/ceiling contact and firing restrictions

### Phase 2-2. Ball Split Logic

- Ball-harpoon collision detection
- Split handling and removal of smallest-size balls

### Phase 2-3. Win/Lose Flow

- HP decreases on ball-player collision, game over at HP 0
- Stage clear when all balls are removed

### Phase 2-4. Gravity & Falling

- Apply gravity to balls

### Phase 2-5. Bouncing

- Implement wall/floor/ceiling bounce behavior

### Phase 2-6. Split Physics

- Tune the velocity/angle distribution of split balls

### Phase 2-7. Collision Precision

- Improve precision of harpoon-ball and ball-ball collision detection
- Ensure frame independence via delta-time-based updates

## Phase 3. Difficulty & Strategy

### Phase 3-1. Stage Balance

- Design ball count/size/speed per stage

### Phase 3-2. Difficulty Curve

- Build the difficulty escalation curve across stage progression

### Phase 3-3. Layout Patterns

- Design various ball layout patterns to encourage strategic play

### Phase 3-4. Power-ups (optional)

- Review and introduce power-up/item elements

## Phase 4. Competitive Elements

### Phase 4-1. Scoring System

- Enhance the scoring system with combos, bonuses, etc.

### Phase 4-2. Record Storage

- Store the high score locally

### Phase 4-3. Ranking (optional)

- Review a ranking/leaderboard-style competitive element

### Phase 4-4. Polish

- Finish up polish with sound/effects and other presentation elements

## Phase 5. World Expansion II

### Phase 5-1. The Trench (Stages 41-50)

- Add 10 more stages themed as a deep-sea trench, with a new periodic
  "current" hazard that pushes balls laterally

### Phase 5-2. Stellar Forge (Stages 51-60)

- Add 10 more stages themed as deep space, with a new "gravity well"
  hazard that pulls balls toward a fixed point

### Phase 5-3. Cosmic Frontier (Stages 61-70)

- Add 10 more stages, escalating outward in scale — solar system, then
  galaxy, then deep space — ending on a distinct Hellfire finale stage.
  Pure content/theme expansion, no new hazard mechanic

### Phase 5-4. World Tour II (Stages 21-30)

- Insert 10 more real-landmark stages between the original World Tour
  (1-20) and Dimension X, pushing every later block (Dimension X, The
  Trench, Stellar Forge, Cosmic Frontier) down by 10 stages. Pure
  content expansion with bespoke hand-drawn backgrounds, no new hazard
  mechanic

### Phase 5-5. Vortex Frontier (Stages 71-80)

- Add 10 more stages with a new "vortex" hazard — a spinning gravity
  well that curves balls into an orbit instead of a straight pull —
  plus 10 visually distinct space compositions rather than one
  recolored template

### Phase 5-6. Cosmic Frontier Rework: Nebula Field (Stages 61-70)

- Rework Cosmic Frontier from four disconnected sub-arcs into one
  unified "flight into a nebula" theme, with a new "nebula field"
  hazard (two simultaneous weaker gravity wells) and a new item, Nova
  Surge (temporary score multiplier)

### Phase 5-7. Hell (Stages 81-90)

- Add 10 more stages themed as a hellscape, with a new "fire zones"
  hazard — periodic lava-burst floor zones that damage the player
  directly on contact, distinct from every earlier ball-only hazard

### Phase 5-8. Void (Stages 91-100)

- Add 10 more stages themed as an emptying void, with near-zero
  gravity — balls drift instead of falling predictably, changing how
  landing spots have to be read

### Phase 5-9. Toxic Marsh (Stages 101-110)

- Add 10 more stages themed as a toxic swamp, with a new "acid rain"
  hazard — telegraphed falling-rain columns that damage the player
  directly on contact, the same dormant/warning/active pattern as Hell's
  fire zones but falling from above instead of erupting from the floor

### Phase 5-10. Frozen Summit (Stages 111-120)

- Add 10 more stages themed as a glacier ascent, with a new "ice wind"
  hazard — periodic gusts that push the _player_ sideways instead of
  the balls, inverting the Trench's current

### Phase 5-11. Solar Storm (Stages 121-130)

- Add 10 more stages themed as a blazing star, with a new "solar flare"
  hazard — a screen-wide (not positional) dormant/warning/active glare
  cycle that slows player move speed while active

### Phase 5-12. Quantum Rift (Stages 131-140)

- Add 10 more stages themed as a fracturing lab/dimension, with a new
  "quantum jitter" hazard — balls occasionally phase-jump to a new
  velocity, breaking the read a player built up watching their arc

### Phase 5-13. Overdrive Nexus (Stages 141-150)

- Add the final 10 stages as a finale, with a new "polarity wells"
  hazard — twin gravity wells whose pull flips to a push and back on a
  fast cycle, plus the capstone Overdrive item (full hazard immunity +
  score multiplier)

## Phase 6. Live Ops & Post-Launch Polish

### Phase 6-1. Release Notes

- Show a "What's New" screen from Settings summarizing recent version
  changes, since the version number is already surfaced in-game

### Phase 6-2. Glossary and First-Encounter Hazard Intro

- Add a reference Glossary screen for items/hazards, and proactively
  explain a hazard the first time a player actually reaches it

### Phase 6-3. Update Highlight & Session Encouragement

- Automatically surface the What's New screen the first time a player
  encounters a newly-deployed version, instead of requiring a manual
  Settings visit
- Add a personal-best encouragement message to the periodic milestone
  screen to nudge continued play mid-session
