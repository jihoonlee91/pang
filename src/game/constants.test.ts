import { describe, expect, it } from 'vitest'
import { ITEM_WEIGHTS, getItemWeights } from './constants'

describe('getItemWeights', () => {
  it('excludes stabilizer before the current/gravity-well stages start', () => {
    expect(getItemWeights(39)).toEqual(ITEM_WEIGHTS)
  })

  it('includes stabilizer from stage 41 (0-indexed 40) onward', () => {
    const weights = getItemWeights(40)
    expect(weights).toEqual([...ITEM_WEIGHTS, ['stabilizer', 12]])
  })

  it('keeps stabilizer in the pool for later stages too', () => {
    const weights = getItemWeights(59)
    expect(weights.some(([type]) => type === 'stabilizer')).toBe(true)
  })
})
