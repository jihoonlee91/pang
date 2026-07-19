import { describe, expect, it } from 'vitest'
import {
  QUANTUM_RIFT_START_STAGE,
  QUANTUM_RIFT_STAGE_COUNT,
  applyQuantumJitter,
  getQuantumJitterStrength,
} from './quantumRifts'

describe('getQuantumJitterStrength', () => {
  it('returns null outside the Quantum Rift stage range', () => {
    expect(getQuantumJitterStrength(QUANTUM_RIFT_START_STAGE - 1)).toBeNull()
    expect(
      getQuantumJitterStrength(
        QUANTUM_RIFT_START_STAGE + QUANTUM_RIFT_STAGE_COUNT,
      ),
    ).toBeNull()
  })

  it('escalates strength with depth', () => {
    const first = getQuantumJitterStrength(QUANTUM_RIFT_START_STAGE)
    const last = getQuantumJitterStrength(
      QUANTUM_RIFT_START_STAGE + QUANTUM_RIFT_STAGE_COUNT - 1,
    )
    expect(first).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!).toBeGreaterThan(first!)
  })
})

describe('applyQuantumJitter', () => {
  const ball = { id: 0, x: 100, y: 100, vx: 50, vy: -20, level: 2 as const }

  it('leaves the ball unchanged when strength is null', () => {
    expect(applyQuantumJitter(ball, null, () => 0)).toEqual(ball)
  })

  it('leaves the ball unchanged when the roll misses the jitter chance', () => {
    // First rand() call is the chance roll — anything above the ~2% chance skips.
    expect(applyQuantumJitter(ball, 80, () => 0.5)).toEqual(ball)
  })

  it('nudges velocity when the roll hits the jitter chance', () => {
    const result = applyQuantumJitter(ball, 80, () => 0)
    expect(result.vx).not.toBe(ball.vx)
    expect(result.vy).not.toBe(ball.vy)
    expect(result.x).toBe(ball.x)
    expect(result.y).toBe(ball.y)
  })

  it('keeps the jitter within +/- strength', () => {
    const result = applyQuantumJitter(ball, 80, () => 0.999)
    expect(Math.abs(result.vx - ball.vx)).toBeLessThanOrEqual(80)
    expect(Math.abs(result.vy - ball.vy)).toBeLessThanOrEqual(80)
  })
})
