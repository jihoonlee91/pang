import { describe, expect, it } from 'vitest'
import { ITEM_WEIGHTS, getItemWeights } from './constants'

describe('getItemWeights', () => {
  it('excludes stabilizer before the current/gravity-well stages start', () => {
    expect(getItemWeights(29)).toEqual(ITEM_WEIGHTS)
  })

  it('includes stabilizer from stage 31 (0-indexed 30) onward', () => {
    const weights = getItemWeights(30)
    expect(weights).toEqual([...ITEM_WEIGHTS, ['stabilizer', 12]])
  })

  it('keeps stabilizer in the pool for later stages too', () => {
    const weights = getItemWeights(49)
    expect(weights.some(([type]) => type === 'stabilizer')).toBe(true)
  })
})
