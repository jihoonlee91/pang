import { beforeEach, describe, expect, it } from 'vitest'
import { hasSeenHazard, markHazardSeen } from './seenHazards'

const storage = new Map<string, string>()

beforeEach(() => {
  storage.clear()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  })
})

describe('seenHazards', () => {
  it('reports unseen hazards as not seen', () => {
    expect(hasSeenHazard('fireZones')).toBe(false)
  })

  it('remembers a hazard once marked seen', () => {
    markHazardSeen('fireZones')
    expect(hasSeenHazard('fireZones')).toBe(true)
  })

  it('keeps other hazards unseen after marking one', () => {
    markHazardSeen('fireZones')
    expect(hasSeenHazard('lowGravity')).toBe(false)
  })

  it('tracks multiple seen hazards independently', () => {
    markHazardSeen('fireZones')
    markHazardSeen('lowGravity')
    expect(hasSeenHazard('fireZones')).toBe(true)
    expect(hasSeenHazard('lowGravity')).toBe(true)
  })
})
