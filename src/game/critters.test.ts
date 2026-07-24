import { describe, expect, it } from 'vitest'
import {
  CRITTER_START_STAGE,
  critterHitsPlayer,
  getCritterX,
  getStageCritters,
} from './critters'
import { PLAYER_Y } from './constants'

describe('getStageCritters', () => {
  it('has no critters before the start stage', () => {
    for (let stage = 0; stage < CRITTER_START_STAGE; stage += 1) {
      expect(getStageCritters(stage)).toBeNull()
    }
  })

  it('appears roughly one stage in three from the start stage on', () => {
    expect(getStageCritters(CRITTER_START_STAGE)).not.toBeNull()
    expect(getStageCritters(CRITTER_START_STAGE + 1)).toBeNull()
    expect(getStageCritters(CRITTER_START_STAGE + 2)).toBeNull()
    expect(getStageCritters(CRITTER_START_STAGE + 3)).not.toBeNull()
  })

  it('is deterministic for a given stage', () => {
    const stage = CRITTER_START_STAGE + 3
    expect(getStageCritters(stage)).toEqual(getStageCritters(stage))
  })
})

describe('getCritterX', () => {
  it('ping-pongs between minX and maxX over one period', () => {
    const critter = { minX: 100, maxX: 300, periodMs: 2000, phaseMs: 0 }
    expect(getCritterX(critter, 0)).toBeCloseTo(100)
    expect(getCritterX(critter, 1000)).toBeCloseTo(300)
    expect(getCritterX(critter, 2000)).toBeCloseTo(100)
  })
})

describe('critterHitsPlayer', () => {
  it('detects contact when the critter overlaps the player box', () => {
    expect(critterHitsPlayer(400, 400, PLAYER_Y)).toBe(true)
  })

  it('misses when the critter is far from the player', () => {
    expect(critterHitsPlayer(400, 700, PLAYER_Y)).toBe(false)
  })
})
