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
