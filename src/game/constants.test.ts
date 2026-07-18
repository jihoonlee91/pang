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

  it('excludes novaSurge before Cosmic Frontier starts', () => {
    const weights = getItemWeights(59)
    expect(weights.some(([type]) => type === 'novaSurge')).toBe(false)
  })

  it('includes novaSurge from stage 61 (0-indexed 60) onward', () => {
    const weights = getItemWeights(60)
    expect(weights.some(([type]) => type === 'novaSurge')).toBe(true)
    expect(weights.some(([type]) => type === 'stabilizer')).toBe(true)
  })

  it('excludes fireproof before Hell starts', () => {
    const weights = getItemWeights(79)
    expect(weights.some(([type]) => type === 'fireproof')).toBe(false)
  })

  it('includes fireproof from stage 81 (0-indexed 80) onward', () => {
    const weights = getItemWeights(80)
    expect(weights.some(([type]) => type === 'fireproof')).toBe(true)
    expect(weights.some(([type]) => type === 'novaSurge')).toBe(true)
  })

  it('excludes anchor before Void starts', () => {
    const weights = getItemWeights(89)
    expect(weights.some(([type]) => type === 'anchor')).toBe(false)
  })

  it('includes anchor from stage 91 (0-indexed 90) onward', () => {
    const weights = getItemWeights(90)
    expect(weights.some(([type]) => type === 'anchor')).toBe(true)
    expect(weights.some(([type]) => type === 'fireproof')).toBe(true)
  })
})
