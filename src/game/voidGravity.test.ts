import { describe, expect, it } from 'vitest'
import {
  VOID_START_STAGE,
  VOID_STAGE_COUNT,
  getStageGravityScale,
} from './voidGravity'

describe('getStageGravityScale', () => {
  it('is 1 (unchanged) outside the Void stage range', () => {
    expect(getStageGravityScale(VOID_START_STAGE - 1)).toBe(1)
    expect(getStageGravityScale(VOID_START_STAGE + VOID_STAGE_COUNT)).toBe(1)
  })

  it('is well below 1 and keeps getting weaker across the block', () => {
    const first = getStageGravityScale(VOID_START_STAGE)
    const last = getStageGravityScale(VOID_START_STAGE + VOID_STAGE_COUNT - 1)
    expect(first).toBeLessThan(1)
    expect(last).toBeLessThan(first)
    expect(last).toBeGreaterThan(0)
  })
})
