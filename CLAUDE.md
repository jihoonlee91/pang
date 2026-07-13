# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **React 19** + **TypeScript** (on **Vite 8**)
- Build/dev server: **Vite**
- Linter: **Oxlint** (not ESLint)
- Package manager: npm

## Key Commands

```bash
npm install       # install dependencies
npm run dev       # run the dev server (default port 5173)
npm run build     # type-check (tsc -b), then produce a production build with vite build
npm run preview   # preview the built output locally
npm run lint      # run oxlint
```

To only run a type check:

```bash
npx tsc --noEmit -p tsconfig.app.json
```

## Testing

No test framework (Vitest/Jest, etc.) is currently installed. If a test-related request comes in, first let the user know that a test runner needs to be introduced. Right now, quality is only verified via `npm run lint` (Oxlint) and `npm run build` (which includes type checking).

## Architecture

- The entry point is `src/main.tsx` → `src/App.tsx`.
- `src/App.tsx`: the top-level component that manages the 4 screen transitions (main/game select/play/end), stage progression, and high-score (localStorage) state.
- `src/GamePlay.tsx`: the actual gameplay screen. Draws the background (per-stage theme), obstacles, balls, harpoons, player, and particles on Canvas 2D, and in a `requestAnimationFrame`-based game loop handles input, physics updates, collision detection, and score/combo/HP updates.
- `src/game/constants.ts`: game constants — canvas size, player/harpoon speed, gravity/restitution coefficients, HP, per-ball-size score, combo window, stage count, obstacle position, etc.
- `src/game/types.ts`: game domain types such as `Ball`, `Harpoon`, `StageResult`.
- `src/game/engine.ts`: pure logic — stage generation (`createStage`), ball gravity/bounce physics (`stepBall`), splitting (`splitBall`), harpoon-ball/harpoon-obstacle/ball-player collision detection, etc.
- `src/game/audio.ts`: sound effects synthesized with Web Audio API oscillators (ball hit, player hit, clear, game over) plus BGM playback/stop.
- The root `tsconfig.json` is split into two project references: `tsconfig.app.json` (for app source) and `tsconfig.node.json` (for the Node environment, e.g. Vite config).
- `vite.config.ts` is a basic config that only uses the `@vitejs/plugin-react` plugin.
- The Oxlint config lives in `.oxlintrc.json`, with type-aware lint rules (typeAware) disabled by default.

## Working Style

- When a new requirement comes in, don't modify code right away — first update the relevant design docs (`docs/PRD.md`, `docs/PLAN.md`, `docs/design/*.md`), then implement.
- Split commits into small, feature-sized units, and push to the remote (`origin master`) immediately after every commit.

## Commit Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format.

```
<type>: <description (English, imperative mood, lowercase start)>
```

- `feat`: add a new feature/gameplay element
- `fix`: bug fix
- `docs`: changes to design docs under `docs/` (no code changes)
- `style`: visual/styling changes (no behavior change, e.g. color/font/layout)
- `refactor`: code structure improvements with no behavior change
- `chore`: build config, dependencies, and other miscellaneous chores

Example: `feat: add power-up drops and effects`, `docs: design phase3-4 power-ups`

If a body is needed, leave a blank line after the subject and add the description there. End the commit message with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.

## Design Docs

- `docs/PRD.md` — overview of the game's overall requirements
- `docs/FEATURES/main.md` — main screen features
- `docs/FEATURES/game_rule.md` — game rules
- `docs/FEATURES/mission1.md` — mission 1 (tutorial stage)
- `docs/PLAN.md` — file laying out the goals for each phase
- `docs/design/` — detailed design docs for each phase in PLAN.md (1-1 to 1-4, 2-1 to 2-7, 3-1 to 3-4, 4-1 to 4-4)
