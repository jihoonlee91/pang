# Orbit Game PRD

## 1. Overview

- **Project name**: Orbit
- **Genre**: Casual arcade (classic "Pang"-style game where you split and remove balls by hitting them)

## 2. Core Gameplay

- The player fires a harpoon to hit the balls on screen, splitting them and eventually removing them.
- Removing all the balls clears the stage and progresses to the next one, across 150 stages total, escalating through several distinct environmental hazards (ladders, a second world-tour arc, dimension portals, undersea currents, gravity wells, a spinning "vortex" gravity-well arc, a "nebula field" flight toward a blazing stellar core, periodic damage "fire zones" through a hellscape, near-zero gravity through an emptying void, telegraphed acid rain through a toxic marsh, player-pushing ice gusts through a frozen summit, a screen-wide slowing solar flare, ball-jittering quantum rift instability, and polarity-flipping twin gravity wells through the finale Overdrive Nexus).
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
