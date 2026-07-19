import { describe, expect, it } from 'vitest'
import { ITEM_WEIGHTS, getItemWeights } from './constants'

describe('getItemWeights', () => {
  it('includes vulcan through stage 30 (0-indexed 29)', () => {
    expect(getItemWeights(0).some(([type]) => type === 'vulcan')).toBe(true)
    expect(getItemWeights(29).some(([type]) => type === 'vulcan')).toBe(true)
  })

  it('excludes vulcan from stage 31 (0-indexed 30) onward', () => {
    expect(getItemWeights(30).some(([type]) => type === 'vulcan')).toBe(false)
    expect(getItemWeights(99).some(([type]) => type === 'vulcan')).toBe(false)
  })

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

  it('includes magnet, comboLock, and shockwave from stage 1 onward', () => {
    const weights = getItemWeights(0)
    expect(weights.some(([type]) => type === 'magnet')).toBe(true)
    expect(weights.some(([type]) => type === 'comboLock')).toBe(true)
    expect(weights.some(([type]) => type === 'shockwave')).toBe(true)
  })

  it('excludes umbrella before Toxic Marsh starts', () => {
    expect(getItemWeights(99).some(([type]) => type === 'umbrella')).toBe(false)
  })

  it('includes umbrella from stage 101 (0-indexed 100) onward', () => {
    const weights = getItemWeights(100)
    expect(weights.some(([type]) => type === 'umbrella')).toBe(true)
    expect(weights.some(([type]) => type === 'anchor')).toBe(true)
  })

  it('excludes gripBoots before Frozen Summit starts', () => {
    expect(getItemWeights(109).some(([type]) => type === 'gripBoots')).toBe(
      false,
    )
  })

  it('includes gripBoots from stage 111 (0-indexed 110) onward', () => {
    const weights = getItemWeights(110)
    expect(weights.some(([type]) => type === 'gripBoots')).toBe(true)
    expect(weights.some(([type]) => type === 'umbrella')).toBe(true)
  })

  it('excludes visor before Solar Storm starts', () => {
    expect(getItemWeights(119).some(([type]) => type === 'visor')).toBe(false)
  })

  it('includes visor from stage 121 (0-indexed 120) onward', () => {
    const weights = getItemWeights(120)
    expect(weights.some(([type]) => type === 'visor')).toBe(true)
    expect(weights.some(([type]) => type === 'gripBoots')).toBe(true)
  })

  it('excludes lockOn before Quantum Rift starts', () => {
    expect(getItemWeights(129).some(([type]) => type === 'lockOn')).toBe(false)
  })

  it('includes lockOn from stage 131 (0-indexed 130) onward', () => {
    const weights = getItemWeights(130)
    expect(weights.some(([type]) => type === 'lockOn')).toBe(true)
    expect(weights.some(([type]) => type === 'visor')).toBe(true)
  })

  it('excludes overdrive before Overdrive Nexus starts', () => {
    expect(getItemWeights(139).some(([type]) => type === 'overdrive')).toBe(
      false,
    )
  })

  it('includes overdrive from stage 141 (0-indexed 140) onward', () => {
    const weights = getItemWeights(140)
    expect(weights.some(([type]) => type === 'overdrive')).toBe(true)
    expect(weights.some(([type]) => type === 'lockOn')).toBe(true)
  })
})
