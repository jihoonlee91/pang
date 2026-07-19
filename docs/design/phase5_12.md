# Phase 5-12. Quantum Rift (Stages 131-140)

## Goal

- Add a hazard that breaks the _predictability_ of a ball's arc
  itself, rather than pushing/pulling it with a continuous force —
  every earlier ball hazard (current, wells, void gravity) still
  leaves `stepBall`'s trajectory smooth and readable once you know the
  rule. This one doesn't.

## New mechanic: Quantum Jitter

- `getQuantumJitterStrength` (`quantumRifts.ts`) returns an escalating
  per-stage magnitude. `applyQuantumJitter(ball, strength, rand)` is a
  pure, seedable function (defaults to `Math.random`, same convention
  as `rollItemDrop`) that rolls a small, low (2%) per-tick chance to
  nudge a ball's velocity by a random amount in each axis — a "phase
  jump" that pops the ball onto a new trajectory instead of continuously
  bending its existing one.
- Applied in `GamePlay.tsx`'s per-ball `stepBall` map, immediately
  before the physics step, so a jittered ball's _new_ velocity is what
  actually gets integrated that frame. A small purple particle burst
  marks the moment a jump happens (non-demo only), so the discontinuity
  reads as an intentional event rather than a physics glitch.
- Neutralized by the new Lock-On item (forces jitter strength to `null`
  while active, suppressing all jumps).

## Theme

- Ten glitchy sci-fi compositions (a fractured lab, a phase corridor, a
  superposition hall with ghosted double-images, an entangled chamber,
  a probability-well particle funnel, an RGB-split decoherence zone, a
  parallel-fold seam, collapsing wavefunction rings, dense quantum
  foam, and a torn rift core), Canvas-2D only, using chromatic-split
  double-strokes for the glitch look rather than any image manipulation.

## Files

- `src/game/quantumRifts.ts` — new file: `QUANTUM_RIFT_START_STAGE`,
  `QUANTUM_RIFT_STAGE_COUNT`, `getQuantumJitterStrength`,
  `applyQuantumJitter`
- `src/game/quantumRifts.test.ts` — new file
- `src/GamePlay.tsx` — jitter applied before each `stepBall` call,
  jitter-trigger particle burst, "QUANTUM JITTER" HUD badge, Lock-On
  item wiring
- `src/StageMap.tsx` — "QUANTUM JITTER" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES` entries
- `src/game/constants.ts` — 10 new `STAGE_OBSTACLES` entries,
  `LOCK_ON_START_STAGE`/`LOCK_ON_DURATION_MS` (see `phase3_4.md`)
- `src/game/hazardCatalog.ts` — `quantumRift` entry
