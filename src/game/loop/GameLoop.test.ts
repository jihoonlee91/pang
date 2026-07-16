import { describe, expect, it } from 'vitest'
import { advanceFixedStep, FIXED_DELTA_SECONDS } from './GameLoop'

describe('fixed timestep accumulator', () => {
  it('produces the same update count for equivalent elapsed time', () => {
    const oneFrame = advanceFixedStep(0, FIXED_DELTA_SECONDS * 3)
    let accumulator = 0
    let updates = 0
    for (let i = 0; i < 3; i += 1) {
      const result = advanceFixedStep(accumulator, FIXED_DELTA_SECONDS)
      accumulator = result.accumulator
      updates += result.updates
    }
    expect(updates).toBe(oneFrame.updates)
  })

  it('clamps background-tab deltas and caps catch-up work', () => {
    expect(advanceFixedStep(0, 10).updates).toBeLessThanOrEqual(6)
  })

  it('does not update while no time has elapsed', () => {
    expect(advanceFixedStep(0, 0)).toEqual({ updates: 0, accumulator: 0 })
  })
})
