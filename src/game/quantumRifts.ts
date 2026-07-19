import type { Ball } from './types'

export const QUANTUM_RIFT_START_STAGE = 130
export const QUANTUM_RIFT_STAGE_COUNT = 10

// Chance per ball, per fixed-step tick, that the rift phase-jumps it —
// kept low and time-independent (a straight roll each ~1/60s tick) rather
// than a per-ball timer, so multiple balls jitter on their own independent
// schedules instead of all snapping in lockstep.
const JITTER_CHANCE_PER_TICK = 0.02

// A ball-trajectory hazard for the Quantum Rift stages (131-140, 0-indexed
// 130-139) — unlike every earlier hazard, nothing pushes or pulls
// continuously; instead, balls occasionally "phase" and pop to a new
// velocity, breaking the read a player built up watching its arc. Jump
// strength escalates with depth so late Rift stages phase harder.
export function getQuantumJitterStrength(stageIndex: number): number | null {
  if (
    stageIndex < QUANTUM_RIFT_START_STAGE ||
    stageIndex >= QUANTUM_RIFT_START_STAGE + QUANTUM_RIFT_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - QUANTUM_RIFT_START_STAGE
  return 70 + depth * 12
}

/**
 * Rolls whether this ball phase-jumps this tick and, if so, nudges its
 * velocity by a random amount up to `strength` in each axis. Pure and
 * seedable via `rand` for testing; real gameplay uses the `Math.random`
 * default, same convention as `rollItemDrop`.
 */
export function applyQuantumJitter(
  ball: Ball,
  strength: number | null,
  rand: () => number = Math.random,
): Ball {
  if (!strength) return ball
  if (rand() > JITTER_CHANCE_PER_TICK) return ball

  const jitterVx = (rand() * 2 - 1) * strength
  const jitterVy = (rand() * 2 - 1) * strength
  return { ...ball, vx: ball.vx + jitterVx, vy: ball.vy + jitterVy }
}
