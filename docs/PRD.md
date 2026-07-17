# PANG Game PRD

## 1. Overview

- **Project name**: PANG
- **Genre**: Casual arcade (classic "Pang"-style game where you split and remove balls by hitting them)

## 2. Core Gameplay

- The player fires a harpoon to hit the balls on screen, splitting them and eventually removing them.
- Removing all the balls clears the stage and progresses to the next one, across 50 stages total, escalating through several distinct environmental hazards (ladders, dimension portals, undersea currents, gravity wells).
- Getting hit by a ball doesn't cause instant death — it reduces HP by a set amount, and game over occurs when HP reaches 0.
- Power-ups occasionally drop from hit balls, applying a temporary effect (double wire, clock, hourglass, barrier, 1UP, or the risky dynamite).

## 3. Main Feature Scope

- Player controls and firing (keyboard and touch)
- Ball physics behavior and split logic
- Stage progression and difficulty escalation, with per-stage themed backgrounds and BGM
- Power-up items
- Score/HP display, game over and restart, with a local score history and rank
- Stage Map (preview of all stages) and an AI-controlled attract/demo mode

## 4. Non-Goals (excluded from this version)

- Multiplayer/online battles
- Server-based accounts/ranking system (only local, per-browser score history)
- Native mobile app build

See `docs/PLAN.md` and `docs/design/phase*.md` for the phase-by-phase breakdown and implementation details.
