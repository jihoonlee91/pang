import { describe, expect, it } from 'vitest'
import {
  CRITTER_START_STAGE,
  critterHitsPlayer,
  getCritterX,
  getStageCritters,
  harpoonHitsCritter,
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

  it('thins to one stage in four from stage 80 on (hazard-dense back half)', () => {
    // Below 80: cadence 3, stage % 3 === 2 (e.g. 77, 80 would both hit
    // under the old flat cadence, but 80 % 3 !== 2 so this pair already
    // demonstrates nothing by itself — assert the new cadence directly.
    expect(getStageCritters(80)).toBeNull() // 80 % 4 === 0
    expect(getStageCritters(81)).toBeNull() // 80 % 4 === 1
    expect(getStageCritters(82)).not.toBeNull() // 80 % 4 === 2
    expect(getStageCritters(83)).toBeNull()
    expect(getStageCritters(86)).not.toBeNull()
  })

  it('slows its fastest crawl during the icy floor (Frozen Summit)', () => {
    // Find whichever Frozen Summit stage (110-119) spawns a critter under
    // the 1-in-4 cadence, and check its period is floored at 2800ms
    // instead of the normal (post-depth-ramp) 2200ms floor.
    const icyStage = [...Array(10).keys()]
      .map((i) => 110 + i)
      .find((stage) => getStageCritters(stage) != null)
    expect(icyStage).toBeDefined()
    const critters = getStageCritters(icyStage!)!
    for (const critter of critters) {
      expect(critter.periodMs).toBeGreaterThanOrEqual(2800)
    }
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

describe('harpoonHitsCritter', () => {
  it('hits when a rising harpoon sweeps through the critter at ground level', () => {
    // Harpoon fired from the ground (baseY=PLAYER_Y) up to some tip above
    // it — the segment from tip to base passes through the critter's
    // ground-level hitbox even though the tip itself is well above it.
    expect(harpoonHitsCritter(400, PLAYER_Y - 200, 400, PLAYER_Y)).toBe(true)
  })

  it('misses when the harpoon is far to the side', () => {
    expect(harpoonHitsCritter(100, PLAYER_Y - 200, 700, PLAYER_Y)).toBe(false)
  })
})
