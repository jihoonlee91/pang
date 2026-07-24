import { describe, expect, it } from 'vitest'
import { PLAYER_Y, PUBLIC_STAGE_COUNT, STAGE_COUNT } from './constants'
import {
  getStageTerrain,
  isDestructiblePlatform,
  STAGE_TERRAINS,
  stepPlayerOnTerrain,
} from './terrain'

describe('stage terrain', () => {
  it('starts with open arenas and introduces terrain gradually', () => {
    expect(STAGE_TERRAINS).toHaveLength(STAGE_COUNT)
    expect(STAGE_TERRAINS[0]).toEqual({ platforms: [] })
    expect(STAGE_TERRAINS[1]).toEqual({ platforms: [] })
    expect(STAGE_TERRAINS[2].platforms).toHaveLength(1)
    expect(STAGE_TERRAINS[3].platforms).toHaveLength(1)

    const platformCounts = STAGE_TERRAINS.slice(0, PUBLIC_STAGE_COUNT).map(
      (terrain) => terrain.platforms.length,
    )
    for (let stage = 1; stage < platformCounts.length; stage += 1) {
      expect(platformCounts[stage]).toBeGreaterThanOrEqual(
        platformCounts[stage - 1],
      )
    }
    expect(platformCounts[5]).toBe(2)
    expect(platformCounts[10]).toBe(3)
    expect(platformCounts[15]).toBe(4)
  })

  it('uses a unique broken-crown arena for the hidden finale', () => {
    const hiddenTerrain = getStageTerrain(STAGE_COUNT - 1)

    expect(hiddenTerrain.platforms).toHaveLength(4)
    expect(hiddenTerrain).not.toEqual(getStageTerrain(PUBLIC_STAGE_COUNT - 1))
  })

  it('keeps the player on the ground while moving horizontally', () => {
    const terrain = getStageTerrain(2)
    const next = stepPlayerOnTerrain(
      480,
      PLAYER_Y,
      { left: false, right: true },
      0.1,
      300,
      terrain,
    )

    expect(next.x).toBe(510)
    expect(next.y).toBe(PLAYER_Y)
  })

  it('clamps horizontal movement to the arena bounds', () => {
    const terrain = getStageTerrain(2)
    const next = stepPlayerOnTerrain(
      30,
      PLAYER_Y,
      { left: true, right: false },
      2,
      300,
      terrain,
    )

    expect(next.x).toBe(20)
    expect(next.y).toBe(PLAYER_Y)
  })

  it('varies platform layouts across the 8 layout families from stage 21 onward', () => {
    // Stage 20 (0-indexed) is the first stage past the hand-placed
    // EXTRA_PLATFORMS range, where LAYOUT_FAMILIES takes over.
    const layouts = Array.from({ length: 8 }, (_, i) =>
      getStageTerrain(20 + i)
        .platforms.map((p) => `${p.x},${p.y}`)
        .join('|'),
    )
    const distinctLayouts = new Set(layouts)
    expect(distinctLayouts.size).toBe(8)
  })

  it('jitters the same layout family differently one cycle apart', () => {
    // Stages 20 and 28 both land on family index 4 (20 % 8 === 28 % 8),
    // but per-stage jitter should still make their exact platforms differ.
    const first = getStageTerrain(20).platforms
    const second = getStageTerrain(28).platforms
    expect(first).not.toEqual(second)
  })
})

describe('isDestructiblePlatform', () => {
  it('has no destructible platforms before stage 21 (0-indexed 20)', () => {
    expect(isDestructiblePlatform(19, 0)).toBe(false)
    expect(isDestructiblePlatform(0, 0)).toBe(false)
  })

  it('marks roughly one in three platforms from stage 21 onward', () => {
    // (stageIndex + platformIndex) % 3 === 0
    expect(isDestructiblePlatform(20, 1)).toBe(true)
    expect(isDestructiblePlatform(20, 0)).toBe(false)
    expect(isDestructiblePlatform(20, 2)).toBe(false)
    expect(isDestructiblePlatform(20, 4)).toBe(true)
  })

  it('is deterministic for the same stage and platform index', () => {
    expect(isDestructiblePlatform(45, 2)).toBe(isDestructiblePlatform(45, 2))
  })
})
