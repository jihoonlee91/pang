import type { ItemType } from './types'

export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 540

export const PLAYER_WIDTH = 40
export const PLAYER_HEIGHT = 16
export const PLAYER_Y = CANVAS_HEIGHT - 30
export const PLAYER_SPEED = 300

export const HARPOON_SPEED = 700
export const VULCAN_SPEED = 1050

export const GRAVITY = 900
export const RESTITUTION = 0.995
export const MIN_BOUNCE_SPEED = 220
// Vertical bounce must remain visibly larger than each balloon's diameter.
// A single global minimum made late-stage large balloons settle into tiny hops.
export const LEVEL_BOUNCE_SPEED = [320, 390, 460]
export const SPLIT_VY_BASE = 250
export const SPLIT_VY_PER_LEVEL = 150

export const MAX_HP = 3
export const INVULN_MS = 1200
// Grace period at the start of a stage so a ball already in flight can't
// hit the player the instant control begins.
export const STAGE_START_INVULN_MS = 3000

export const LEVEL_RADIUS = [14, 20, 28]
export const SCORE_BY_LEVEL = [300, 150, 100]

export const COMBO_WINDOW_MS = 1500

export const STAGE_COUNT = 100
export const STAGE_TIME_SECONDS = 90
export const TIME_BONUS_PER_SECOND = 10

export function getStageTimeSeconds(stageIndex: number): number {
  const normalizedStage = Math.max(
    0,
    Math.min(STAGE_COUNT - 1, Math.floor(stageIndex)),
  )
  // Floors at the same value late stages already converged toward before
  // stage count grew past ~80 (90 - 78 = 12) — without this floor, stages
  // beyond 90 (0-indexed) hit zero or negative time and the run ends the
  // instant it starts.
  return Math.max(12, STAGE_TIME_SECONDS - normalizedStage)
}

export type Obstacle = {
  x: number
  y: number
  width: number
  height: number
}

export const STAGE_OBSTACLES: readonly Obstacle[] = [
  { x: 400, y: 261, width: 160, height: 18 },
  { x: 150, y: 210, width: 180, height: 18 },
  { x: 630, y: 330, width: 180, height: 18 },
  { x: 80, y: 300, width: 200, height: 18 },
  { x: 680, y: 180, width: 170, height: 18 },
  { x: 320, y: 360, width: 220, height: 18 },
  { x: 520, y: 230, width: 190, height: 18 },
  { x: 180, y: 350, width: 160, height: 18 },
  { x: 700, y: 310, width: 150, height: 18 },
  { x: 380, y: 170, width: 200, height: 18 },
  { x: 90, y: 240, width: 210, height: 18 },
  { x: 610, y: 260, width: 240, height: 18 },
  { x: 310, y: 320, width: 180, height: 18 },
  { x: 40, y: 180, width: 190, height: 18 },
  { x: 720, y: 210, width: 180, height: 18 },
  { x: 250, y: 250, width: 260, height: 18 },
  { x: 560, y: 350, width: 230, height: 18 },
  { x: 120, y: 330, width: 170, height: 18 },
  { x: 640, y: 160, width: 210, height: 18 },
  { x: 360, y: 290, width: 240, height: 18 },
  // --- World Tour II (stages 21-30) ---
  { x: 230, y: 195, width: 200, height: 18 },
  { x: 590, y: 340, width: 180, height: 18 },
  { x: 95, y: 275, width: 210, height: 18 },
  { x: 445, y: 155, width: 230, height: 18 },
  { x: 715, y: 305, width: 170, height: 18 },
  { x: 275, y: 235, width: 240, height: 18 },
  { x: 565, y: 195, width: 200, height: 18 },
  { x: 165, y: 320, width: 190, height: 18 },
  { x: 635, y: 235, width: 210, height: 18 },
  { x: 415, y: 175, width: 220, height: 18 },
  // --- Dimension X (stages 31-40) ---
  { x: 110, y: 165, width: 180, height: 18 },
  { x: 660, y: 285, width: 190, height: 18 },
  { x: 350, y: 190, width: 220, height: 18 },
  { x: 70, y: 345, width: 200, height: 18 },
  { x: 690, y: 155, width: 180, height: 18 },
  { x: 245, y: 335, width: 230, height: 18 },
  { x: 535, y: 205, width: 210, height: 18 },
  { x: 145, y: 255, width: 190, height: 18 },
  { x: 675, y: 350, width: 175, height: 18 },
  { x: 355, y: 145, width: 250, height: 18 },
  // --- The Trench (stages 41-50) ---
  { x: 420, y: 220, width: 170, height: 18 },
  { x: 130, y: 300, width: 200, height: 18 },
  { x: 650, y: 175, width: 190, height: 18 },
  { x: 60, y: 250, width: 210, height: 18 },
  { x: 700, y: 340, width: 160, height: 18 },
  { x: 300, y: 180, width: 230, height: 18 },
  { x: 500, y: 320, width: 190, height: 18 },
  { x: 160, y: 155, width: 170, height: 18 },
  { x: 680, y: 260, width: 150, height: 18 },
  { x: 340, y: 355, width: 220, height: 18 },
  // --- Stellar Forge (stages 51-60) ---
  { x: 100, y: 200, width: 210, height: 18 },
  { x: 600, y: 350, width: 240, height: 18 },
  { x: 330, y: 240, width: 180, height: 18 },
  { x: 60, y: 335, width: 200, height: 18 },
  { x: 720, y: 165, width: 180, height: 18 },
  { x: 260, y: 300, width: 250, height: 18 },
  { x: 540, y: 160, width: 200, height: 18 },
  { x: 150, y: 260, width: 190, height: 18 },
  { x: 650, y: 300, width: 170, height: 18 },
  { x: 380, y: 150, width: 240, height: 18 },
  // --- Cosmic Frontier (stages 61-70) ---
  { x: 200, y: 175, width: 220, height: 18 },
  { x: 610, y: 305, width: 190, height: 18 },
  { x: 70, y: 260, width: 200, height: 18 },
  { x: 470, y: 345, width: 230, height: 18 },
  { x: 730, y: 190, width: 160, height: 18 },
  { x: 290, y: 220, width: 250, height: 18 },
  { x: 550, y: 170, width: 200, height: 18 },
  { x: 130, y: 335, width: 190, height: 18 },
  { x: 660, y: 250, width: 180, height: 18 },
  { x: 400, y: 160, width: 220, height: 18 },
  // --- Vortex Frontier (stages 71-80) ---
  { x: 185, y: 210, width: 220, height: 18 },
  { x: 625, y: 290, width: 190, height: 18 },
  { x: 55, y: 245, width: 200, height: 18 },
  { x: 485, y: 330, width: 230, height: 18 },
  { x: 745, y: 175, width: 160, height: 18 },
  { x: 305, y: 205, width: 250, height: 18 },
  { x: 525, y: 155, width: 200, height: 18 },
  { x: 115, y: 350, width: 190, height: 18 },
  { x: 705, y: 265, width: 180, height: 18 },
  { x: 365, y: 145, width: 220, height: 18 },
  // --- Hell (stages 81-90) ---
  { x: 518, y: 207, width: 223, height: 18 },
  { x: 757, y: 289, width: 227, height: 18 },
  { x: 180, y: 334, width: 230, height: 18 },
  { x: 639, y: 302, width: 193, height: 18 },
  { x: 615, y: 182, width: 217, height: 18 },
  { x: 223, y: 185, width: 238, height: 18 },
  { x: 669, y: 325, width: 171, height: 18 },
  { x: 389, y: 300, width: 196, height: 18 },
  { x: 255, y: 221, width: 251, height: 18 },
  { x: 669, y: 232, width: 202, height: 18 },
  // --- Void (stages 91-100) ---
  { x: 633, y: 177, width: 175, height: 18 },
  { x: 282, y: 222, width: 210, height: 18 },
  { x: 741, y: 242, width: 235, height: 18 },
  { x: 217, y: 235, width: 247, height: 18 },
  { x: 633, y: 207, width: 213, height: 18 },
  { x: 652, y: 294, width: 171, height: 18 },
  { x: 472, y: 160, width: 229, height: 18 },
  { x: 339, y: 293, width: 185, height: 18 },
  { x: 327, y: 228, width: 201, height: 18 },
  { x: 720, y: 234, width: 162, height: 18 },
]

export function getStageObstacle(stageIndex: number): Obstacle {
  const normalizedIndex =
    ((stageIndex % STAGE_OBSTACLES.length) + STAGE_OBSTACLES.length) %
    STAGE_OBSTACLES.length
  return STAGE_OBSTACLES[normalizedIndex]
}

const DEFAULT_OBSTACLE = STAGE_OBSTACLES[0]
export const OBSTACLE_WIDTH = DEFAULT_OBSTACLE.width
export const OBSTACLE_HEIGHT = DEFAULT_OBSTACLE.height
export const OBSTACLE_X = DEFAULT_OBSTACLE.x
export const OBSTACLE_Y = DEFAULT_OBSTACLE.y

// --- Power-up items ---
export const ITEM_RADIUS = 16
export const ITEM_GRAVITY = 260
export const ITEM_DROP_CHANCE = 0.14

export function getStageItemDropChance(stageIndex: number): number {
  const normalizedStage = Math.max(
    0,
    Math.min(STAGE_COUNT - 1, Math.floor(stageIndex)),
  )
  return Math.max(0.08, ITEM_DROP_CHANCE - normalizedStage * 0.002)
}
// Relative weights within a drop: double wire/clock/hourglass/barrier are common,
// 1UP and dynamite are intentionally rare (dynamite is a risk item, 1UP is a reward item).
export const ITEM_WEIGHTS: [ItemType, number][] = [
  ['doubleWire', 14],
  ['powerWire', 10],
  ['vulcan', 10],
  ['clock', 12],
  ['hourglass', 12],
  ['barrier', 10],
  ['oneUp', 5],
  ['dynamite', 5],
  ['speedBoost', 10],
  ['invincible', 6],
  ['timePlus', 8],
  ['scoreBonus', 8],
]

// Stabilizer only does anything from stage 41 (0-indexed 40) onward, where
// the current/gravity-well/nebula-field/vortex hazards begin — hardcoded
// here rather than imported from currents.ts/gravityWells.ts/nebulae.ts/
// vortices.ts to avoid a circular import (all of those already import from
// this file).
const STABILIZER_START_STAGE = 40

// Nova Surge (score multiplier) is introduced at Cosmic Frontier (stage 61,
// 0-indexed 60) and stays in the pool for every stage after, same pattern
// as Stabilizer.
const NOVA_SURGE_START_STAGE = 60

// Fireproof neutralizes Hell's fire zones (stage 81, 0-indexed 80 onward)
// and Anchor neutralizes Void's low gravity (stage 91, 0-indexed 90
// onward) — same "introduced once, stays in the pool forever after"
// pattern as Stabilizer/Nova Surge.
const FIREPROOF_START_STAGE = 80
const ANCHOR_START_STAGE = 90

export function getItemWeights(stageIndex: number): [ItemType, number][] {
  const weights: [ItemType, number][] = [...ITEM_WEIGHTS]
  if (stageIndex >= STABILIZER_START_STAGE) weights.push(['stabilizer', 12])
  if (stageIndex >= NOVA_SURGE_START_STAGE) weights.push(['novaSurge', 9])
  if (stageIndex >= FIREPROOF_START_STAGE) weights.push(['fireproof', 10])
  if (stageIndex >= ANCHOR_START_STAGE) weights.push(['anchor', 10])
  return weights
}

export const MAX_HARPOONS_DEFAULT = 1
export const MAX_HARPOONS_DOUBLE_WIRE = 2
export const MAX_VULCAN_SHOTS = 5

export const DOUBLE_WIRE_DURATION_MS = 12000
export const POWER_WIRE_DURATION_MS = 12000
export const POWER_WIRE_STAY_MS = 5000
export const VULCAN_DURATION_MS = 12000
export const VULCAN_FIRE_INTERVAL_MS = 120
export const CLOCK_DURATION_MS = 6000
export const HOURGLASS_DURATION_MS = 8000
export const HOURGLASS_SLOW_FACTOR = 0.4
export const SPEED_BOOST_DURATION_MS = 10000
export const SPEED_BOOST_MULTIPLIER = 1.6
export const INVINCIBLE_DURATION_MS = 8000
export const TIME_PLUS_SECONDS = 15
export const SCORE_BONUS_POINTS = 1000
export const STABILIZER_DURATION_MS = 8000
export const NOVA_SURGE_DURATION_MS = 10000
export const NOVA_SURGE_MULTIPLIER = 2
export const FIREPROOF_DURATION_MS = 8000
export const ANCHOR_DURATION_MS = 8000
