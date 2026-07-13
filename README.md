# PANG

A classic "Pang" / Buster Bros-style arcade game. Hit the balls on screen with your harpoon to keep splitting them into smaller balls, and clear the stage once they're all gone.

## Play Now

**<a href="https://jihoonlee91.github.io/PANG-23020975/" target="_blank" rel="noopener noreferrer">Play in your browser</a>** — no install required. The site is built and deployed automatically from `master` via GitHub Actions (see `.github/workflows/deploy-pages.yml`).

## Gameplay

- The player moves left and right along the bottom of the screen, firing a harpoon upward.
- Only one harpoon can exist at a time, and you can't fire again while it's still on screen.
- When a harpoon hits a ball, that ball is removed; if it isn't already the smallest size, it splits into two balls one size smaller. The smallest-size ball disappears completely without splitting when hit.
- Getting hit by a ball doesn't kill you instantly — it reduces HP by 1 and grants a brief period of invulnerability. Game over occurs when HP reaches 0.
- Clearing all the balls on screen clears the stage. Clear all 5 stages in order (Mt. Fuji → Guilin → Emerald Temple → Angkor Wat → Ayers Rock themes) to clear the game.
- Hitting balls consecutively within a short time builds up a combo, increasing your score multiplier.
- The striped platform obstacle in the center of the screen blocks harpoons and bounces balls off of it.
- Your high score is saved in the browser's `localStorage` and shown on the game-end screen.

## Controls

| Key                | Action                                        |
| ------------------ | --------------------------------------------- |
| `←` `→` or `A` `D` | Move left/right                               |
| `Space`            | Fire (only 1 harpoon can be active at a time) |

## Development

### Requirements

- Node.js, npm

### Commands

```bash
npm install       # install dependencies
npm run dev       # run the dev server (default port 5173)
npm run build     # type-check (tsc -b), then produce a production build
npm run lint      # run oxlint
npm run preview   # preview the built output locally
```

## Tech Stack

- **React 19** + **TypeScript**, built on **Vite 8**
- Game rendering/loop: Canvas 2D API (`src/GamePlay.tsx`)
- Physics/collision/split logic: `src/game/engine.ts`
- Sound effects & BGM: synthesized directly with **Web Audio API** oscillators, no external audio files (`src/game/audio.ts`)
- Font: **Galmuri11** (a retro pixel font with Korean support, OFL license, loaded via CDN)
- Linter: **Oxlint**

## Project Structure

```
src/
  App.tsx        manages screen-transition state (main -> play -> end)
  GamePlay.tsx   game canvas rendering, input handling, game loop
  game/
    constants.ts game constants: canvas/physics/scoring, etc.
    types.ts     type definitions for balls/harpoons, etc.
    engine.ts    stage generation, ball physics, collision detection, split logic
    audio.ts     Web Audio-based sound effects/BGM
docs/
  PRD.md         overview of game requirements
  PLAN.md        development plan by phase
  design/        detailed design docs per phase
  FEATURES/      feature specs by screen/rule
```

The principle is to reflect design changes in the `docs/` documentation before the code. See `CLAUDE.md` for detailed development rules.
