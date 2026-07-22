import type { StageCurrent } from './currents'
import type { FireZone } from './fireZones'
import type { GravityWell } from './gravityWells'

export const CHAOS_RIFT_START_STAGE = 150
export const CHAOS_RIFT_STAGE_COUNT = 50
const SUB_BLOCK_SIZE = 10

// Chaos Rift (stages 151-200, 0-indexed 150-199) is the post-Overdrive
// finale gauntlet. Rather than one 50-stage block repeating a single
// combo (monotonous compared to every other 10-stage chapter having its
// own identity), it's split into 5 named sub-chapters, each remixing a
// different pair of the game's most established hazards at higher
// intensity than either has run alone. Every hazard reused here already
// has full physics/rendering/damage/AI-dodge wiring in GamePlay.tsx, so
// no new mechanic code is needed — only new data generators returning the
// exact same shapes (`StageCurrent`/`FireZone[]`/`GravityWell[]`).
//
//   151-160 Fractured Gateway : current (push)      + fire zones (damage)
//   161-170 Storm Citadel     : gravity well (pull)  + fire zones (damage)
//   171-180 Molten Maelstrom  : current (push)      + gravity well (pull)
//   181-190 Prism Collapse    : spinning well (pull) + fire zones (damage)
//   191-200 Final Singularity : current + gravity well + fire zones (all three)
//
// Stabilizer already neutralizes both current and gravity-well pulls
// (same `isStabilizerActive` gate in GamePlay.tsx), and Fireproof/
// Overdrive already neutralize fire-zone damage — both items already
// reappear from stage 150 onward in `constants.ts`'s `getItemWeights`,
// so no new counter item is needed for any sub-chapter here.

function subBlockDepth(stageIndex: number): number {
  return (stageIndex - CHAOS_RIFT_START_STAGE) % SUB_BLOCK_SIZE
}

function subBlockIndex(stageIndex: number): number {
  return Math.floor((stageIndex - CHAOS_RIFT_START_STAGE) / SUB_BLOCK_SIZE)
}

function inRange(stageIndex: number): boolean {
  return (
    stageIndex >= CHAOS_RIFT_START_STAGE &&
    stageIndex < CHAOS_RIFT_START_STAGE + CHAOS_RIFT_STAGE_COUNT
  )
}

// Sub-chapters with a current: Fractured Gateway (0), Molten Maelstrom (2),
// Final Singularity (4).
const CURRENT_BLOCKS = new Set([0, 2, 4])
// Sub-chapters with fire zones: Fractured Gateway (0), Storm Citadel (1),
// Prism Collapse (3), Final Singularity (4).
const FIRE_BLOCKS = new Set([0, 1, 3, 4])
// Sub-chapters with a gravity well: Storm Citadel (1), Molten Maelstrom (2),
// Prism Collapse (3, spinning), Final Singularity (4).
const WELL_BLOCKS = new Set([1, 2, 3, 4])

export function getChaosRiftCurrent(stageIndex: number): StageCurrent | null {
  if (!inRange(stageIndex) || !CURRENT_BLOCKS.has(subBlockIndex(stageIndex))) {
    return null
  }
  const depth = stageIndex - CHAOS_RIFT_START_STAGE
  return {
    // The Trench's current tops out at 90 + 9*14 = 216 (`currents.ts`) —
    // Chaos Rift starts above that ceiling from its very first stage.
    strength: 220 + depth * 3,
    periodMs: Math.max(1800, 3000 - depth * 24),
  }
}

const ZONE_LAYOUTS: readonly (readonly Omit<
  FireZone,
  'periodMs' | 'phaseMs'
>[])[] = [
  [
    { x: 130, width: 150 },
    { x: 400, width: 150 },
    { x: 660, width: 150 },
  ],
  [
    { x: 90, width: 140 },
    { x: 310, width: 140 },
    { x: 530, width: 140 },
    { x: 720, width: 140 },
  ],
  [
    { x: 110, width: 150 },
    { x: 380, width: 150 },
    { x: 620, width: 150 },
  ],
  [
    { x: 70, width: 130 },
    { x: 260, width: 130 },
    { x: 460, width: 130 },
    { x: 660, width: 130 },
  ],
]

export function getChaosRiftFireZones(stageIndex: number): FireZone[] | null {
  if (!inRange(stageIndex) || !FIRE_BLOCKS.has(subBlockIndex(stageIndex))) {
    return null
  }
  const depth = stageIndex - CHAOS_RIFT_START_STAGE
  const layout = ZONE_LAYOUTS[depth % ZONE_LAYOUTS.length]
  const periodMs = Math.max(1700, 2600 - depth * 18)
  return layout.map((zone, index) => ({
    ...zone,
    periodMs,
    phaseMs: (index * periodMs) / layout.length,
  }))
}

const WELL_POSITIONS: readonly (readonly [number, number])[] = [
  [480, 200], // canvas is 960 wide; center x
  [260, 240],
  [700, 220],
  [340, 180],
  [620, 280],
]

export function getChaosRiftWells(stageIndex: number): GravityWell[] | null {
  if (!inRange(stageIndex) || !WELL_BLOCKS.has(subBlockIndex(stageIndex))) {
    return null
  }
  const block = subBlockIndex(stageIndex)
  const depth = subBlockDepth(stageIndex)
  const [x, y] = WELL_POSITIONS[depth % WELL_POSITIONS.length]
  // Prism Collapse (block 3) spins, matching its "reality bending" theme —
  // every other well-bearing sub-chapter pulls straight in. Strength
  // already exceeds Stellar Forge's/Vortex Frontier's own caps from the
  // first stage in the block.
  return [
    {
      x,
      y,
      strength: 4_400_000 + depth * 250_000,
      spin: block === 3 ? 2_600_000 + depth * 200_000 : undefined,
    },
  ]
}
