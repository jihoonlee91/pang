import type { ItemType } from './types'
import {
  HIDDEN_FINAL_STAGE_INDEX,
  HIDDEN_FINALE_TIME_SECONDS,
} from './hiddenFinale'

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

export const PUBLIC_STAGE_COUNT = 200
export const STAGE_COUNT = 201
export const STAGE_TIME_SECONDS = 90
export const TIME_BONUS_PER_SECOND = 10

export function getStageTimeSeconds(stageIndex: number): number {
  if (Math.floor(stageIndex) === HIDDEN_FINAL_STAGE_INDEX) {
    return HIDDEN_FINALE_TIME_SECONDS
  }
  const normalizedStage = Math.max(
    0,
    Math.min(STAGE_COUNT - 1, Math.floor(stageIndex)),
  )
  // Floored at 20s: with the default single harpoon (~0.6s round trip to
  // the top of the arena and back), a player lands roughly 1.5 hits/sec,
  // and clearing 8 max-size balls needs up to 56 hits (each level-2 ball
  // takes 7: itself, its 2 level-1 children, their 4 level-0 grandchildren).
  // A 12s floor allowed for only ~18 hits — unwinnable without power-ups,
  // which just reads as running out of time rather than a real challenge.
  return Math.max(20, STAGE_TIME_SECONDS - normalizedStage)
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
  // --- Toxic Marsh (stages 101-110) ---
  { x: 191, y: 318, width: 218, height: 18 },
  { x: 406, y: 188, width: 210, height: 18 },
  { x: 716, y: 300, width: 163, height: 18 },
  { x: 433, y: 219, width: 219, height: 18 },
  { x: 479, y: 289, width: 214, height: 18 },
  { x: 84, y: 330, width: 207, height: 18 },
  { x: 596, y: 303, width: 235, height: 18 },
  { x: 572, y: 192, width: 234, height: 18 },
  { x: 426, y: 258, width: 169, height: 18 },
  { x: 562, y: 177, width: 150, height: 18 },
  // --- Frozen Summit (stages 111-120) ---
  { x: 507, y: 329, width: 229, height: 18 },
  { x: 260, y: 321, width: 149, height: 18 },
  { x: 657, y: 334, width: 155, height: 18 },
  { x: 710, y: 242, width: 199, height: 18 },
  { x: 386, y: 317, width: 155, height: 18 },
  { x: 540, y: 166, width: 156, height: 18 },
  { x: 267, y: 294, width: 245, height: 18 },
  { x: 65, y: 156, width: 168, height: 18 },
  { x: 149, y: 322, width: 156, height: 18 },
  { x: 661, y: 278, width: 177, height: 18 },
  // --- Solar Storm (stages 121-130) ---
  { x: 60, y: 195, width: 233, height: 18 },
  { x: 273, y: 245, width: 182, height: 18 },
  { x: 46, y: 327, width: 156, height: 18 },
  { x: 57, y: 187, width: 153, height: 18 },
  { x: 190, y: 175, width: 149, height: 18 },
  { x: 711, y: 337, width: 182, height: 18 },
  { x: 417, y: 310, width: 147, height: 18 },
  { x: 247, y: 293, width: 172, height: 18 },
  { x: 440, y: 227, width: 219, height: 18 },
  { x: 215, y: 305, width: 178, height: 18 },
  // --- Quantum Rift (stages 131-140) ---
  { x: 645, y: 234, width: 214, height: 18 },
  { x: 151, y: 145, width: 179, height: 18 },
  { x: 576, y: 341, width: 213, height: 18 },
  { x: 382, y: 219, width: 160, height: 18 },
  { x: 396, y: 187, width: 236, height: 18 },
  { x: 191, y: 170, width: 224, height: 18 },
  { x: 445, y: 234, width: 259, height: 18 },
  { x: 213, y: 361, width: 195, height: 18 },
  { x: 670, y: 243, width: 246, height: 18 },
  { x: 511, y: 272, width: 252, height: 18 },
  // --- Overdrive Nexus (stages 141-150) ---
  { x: 530, y: 149, width: 211, height: 18 },
  { x: 579, y: 355, width: 200, height: 18 },
  { x: 98, y: 351, width: 173, height: 18 },
  { x: 105, y: 193, width: 243, height: 18 },
  { x: 545, y: 238, width: 195, height: 18 },
  { x: 501, y: 334, width: 223, height: 18 },
  { x: 329, y: 321, width: 168, height: 18 },
  { x: 519, y: 216, width: 231, height: 18 },
  { x: 535, y: 310, width: 157, height: 18 },
  { x: 225, y: 215, width: 186, height: 18 },
  // --- Chaos Rift (stages 151-200) ---
  { x: 392, y: 363, width: 198, height: 18 },
  { x: 593, y: 213, width: 172, height: 18 },
  { x: 617, y: 363, width: 205, height: 18 },
  { x: 744, y: 309, width: 237, height: 18 },
  { x: 504, y: 344, width: 162, height: 18 },
  { x: 64, y: 318, width: 179, height: 18 },
  { x: 333, y: 181, width: 196, height: 18 },
  { x: 537, y: 363, width: 173, height: 18 },
  { x: 151, y: 206, width: 166, height: 18 },
  { x: 755, y: 225, width: 257, height: 18 },
  { x: 205, y: 339, width: 249, height: 18 },
  { x: 142, y: 344, width: 210, height: 18 },
  { x: 754, y: 361, width: 218, height: 18 },
  { x: 548, y: 173, width: 141, height: 18 },
  { x: 478, y: 313, width: 209, height: 18 },
  { x: 696, y: 155, width: 155, height: 18 },
  { x: 520, y: 206, width: 210, height: 18 },
  { x: 628, y: 347, width: 177, height: 18 },
  { x: 133, y: 226, width: 236, height: 18 },
  { x: 507, y: 281, width: 161, height: 18 },
  { x: 145, y: 278, width: 243, height: 18 },
  { x: 332, y: 223, width: 195, height: 18 },
  { x: 623, y: 238, width: 158, height: 18 },
  { x: 179, y: 356, width: 212, height: 18 },
  { x: 211, y: 197, width: 185, height: 18 },
  { x: 589, y: 300, width: 234, height: 18 },
  { x: 518, y: 239, width: 165, height: 18 },
  { x: 521, y: 250, width: 235, height: 18 },
  { x: 537, y: 243, width: 146, height: 18 },
  { x: 171, y: 157, width: 185, height: 18 },
  { x: 513, y: 151, width: 143, height: 18 },
  { x: 161, y: 215, width: 157, height: 18 },
  { x: 734, y: 257, width: 142, height: 18 },
  { x: 378, y: 335, width: 200, height: 18 },
  { x: 160, y: 251, width: 181, height: 18 },
  { x: 218, y: 256, width: 181, height: 18 },
  { x: 672, y: 253, width: 255, height: 18 },
  { x: 601, y: 153, width: 211, height: 18 },
  { x: 682, y: 286, width: 224, height: 18 },
  { x: 515, y: 243, width: 250, height: 18 },
  { x: 367, y: 198, width: 165, height: 18 },
  { x: 530, y: 180, width: 202, height: 18 },
  { x: 118, y: 221, width: 207, height: 18 },
  { x: 249, y: 215, width: 250, height: 18 },
  { x: 337, y: 274, width: 235, height: 18 },
  { x: 90, y: 185, width: 221, height: 18 },
  { x: 103, y: 241, width: 205, height: 18 },
  { x: 710, y: 365, width: 199, height: 18 },
  { x: 380, y: 187, width: 248, height: 18 },
  { x: 419, y: 184, width: 188, height: 18 },
  // --- Hidden true finale (stage 201) ---
  { x: 380, y: 142, width: 200, height: 18 },
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
export const ITEM_RADIUS = 20
export const ITEM_GRAVITY = 260
// Fraction of the remaining horizontal gap to the player an item closes
// per second while Magnet is active — an exponential approach rather than
// a fixed speed, so items snap in fast from nearby but don't teleport from
// across the arena.
export const MAGNET_PULL_RATE = 4
export const ITEM_DROP_CHANCE = 0.14

export function getStageItemDropChance(stageIndex: number): number {
  if (Math.floor(stageIndex) === HIDDEN_FINAL_STAGE_INDEX) return 0.22
  const normalizedStage = Math.max(
    0,
    Math.min(STAGE_COUNT - 1, Math.floor(stageIndex)),
  )
  return Math.max(0.08, ITEM_DROP_CHANCE - normalizedStage * 0.002)
}
// Relative weights within a drop: double wire/clock/hourglass/barrier are common,
// 1UP and dynamite are intentionally rare (dynamite is a risk item, 1UP is a reward item).
// Star Balloon is rarer still — it clears the whole screen outright, so it's
// the single most powerful pickup in the pool.
// Vulcan is handled separately below — it only drops through stage 30.
export const ITEM_WEIGHTS: [ItemType, number][] = [
  ['doubleWire', 14],
  ['powerWire', 20],
  ['clock', 12],
  ['hourglass', 12],
  ['barrier', 10],
  ['oneUp', 5],
  ['dynamite', 5],
  ['speedBoost', 10],
  ['invincible', 6],
  ['timePlus', 8],
  ['scoreBonus', 8],
  ['magnet', 10],
  ['comboLock', 8],
  ['shockwave', 6],
  ['pierce', 10],
  ['starBalloon', 3],
]

// Vulcan (rapid-fire) was originally always in the pool, but it trivializes
// the early-mid game — only drops through stage 30 (0-indexed 29), the same
// range World Tour II covers, then steps aside for the harder stages after.
const VULCAN_END_STAGE = 30

// Breeze (World Tour II, stages 21-30) is weak enough that no counter item
// is warranted — it's introduced before Stabilizer even enters the pool
// (stage 40), so it's intentionally left unscoped here.

// Stabilizer neutralizes the current/gravity-well/nebula-field/vortex
// hazards, which run back-to-back across stages 41-80 (0-indexed 40-79) —
// hardcoded here rather than imported from currents.ts/gravityWells.ts/
// nebulae.ts/vortices.ts to avoid a circular import (all of those already
// import from this file). It only drops in that range: past stage 80 none
// of those four hazards are active anymore, so it would just be dead
// weight in the pool. It reappears a second time for Chaos Rift
// (stages 151-200), which replays the lateral current at higher intensity
// alongside the fire zones below — same reasoning, hardcoded to avoid
// importing from chaosRift.ts.
const STABILIZER_START_STAGE = 40
const STABILIZER_END_STAGE = 80
const STABILIZER_CHAOS_RIFT_START_STAGE = 150

// Nova Surge (score multiplier) is introduced at Cosmic Frontier (stage 61,
// 0-indexed 60) and stays in the pool for every stage after — unlike the
// hazard-counter items below, it's a pure reward with no hazard to scope it
// to, so "forever after" is correct here.
const NOVA_SURGE_START_STAGE = 60

// Each of these neutralizes exactly one hazard block and should only drop
// while that block is active — Fireproof for Hell's fire zones (81-90),
// Anchor for Void's low gravity (91-100), Umbrella for Toxic Marsh's acid
// rain (101-110), Grip Boots for Frozen Summit's ice wind (111-120), Visor
// for Solar Storm's flares (121-130), Lock-On for Quantum Rift's jitter
// (131-140). Bounded ranges, not "start onward", so e.g. Fireproof stops
// appearing once stage 101 (Toxic Marsh) begins — it does nothing there.
// Fireproof also reappears for Chaos Rift (stages 151-200), which replays
// Hell's fire zones at higher intensity alongside the current above.
const FIREPROOF_START_STAGE = 80
const FIREPROOF_END_STAGE = 90
const FIREPROOF_CHAOS_RIFT_START_STAGE = 150
const ANCHOR_START_STAGE = 90
const ANCHOR_END_STAGE = 100
const UMBRELLA_START_STAGE = 100
const UMBRELLA_END_STAGE = 110
const GRIP_BOOTS_START_STAGE = 110
const GRIP_BOOTS_END_STAGE = 120
const VISOR_START_STAGE = 120
const VISOR_END_STAGE = 130
const LOCK_ON_START_STAGE = 130
const LOCK_ON_END_STAGE = 140

// Overdrive was Overdrive Nexus's capstone (stages 141-150) — its full-hit
// immunity (see the invulnerability gate in GamePlay.tsx) happens to also
// neutralize Chaos Rift's fire-zone damage, so unlike Stabilizer/Fireproof
// it needs no second window: "start onward" already covers both blocks.
const OVERDRIVE_ITEM_START_STAGE = 140

export function getItemWeights(stageIndex: number): [ItemType, number][] {
  const weights: [ItemType, number][] = [...ITEM_WEIGHTS]
  if (stageIndex < VULCAN_END_STAGE) weights.push(['vulcan', 10])
  if (
    (stageIndex >= STABILIZER_START_STAGE &&
      stageIndex < STABILIZER_END_STAGE) ||
    stageIndex >= STABILIZER_CHAOS_RIFT_START_STAGE
  )
    weights.push(['stabilizer', 12])
  if (stageIndex >= NOVA_SURGE_START_STAGE) weights.push(['novaSurge', 9])
  if (
    (stageIndex >= FIREPROOF_START_STAGE && stageIndex < FIREPROOF_END_STAGE) ||
    stageIndex >= FIREPROOF_CHAOS_RIFT_START_STAGE
  )
    weights.push(['fireproof', 10])
  if (stageIndex >= ANCHOR_START_STAGE && stageIndex < ANCHOR_END_STAGE)
    weights.push(['anchor', 10])
  if (stageIndex >= UMBRELLA_START_STAGE && stageIndex < UMBRELLA_END_STAGE)
    weights.push(['umbrella', 10])
  if (stageIndex >= GRIP_BOOTS_START_STAGE && stageIndex < GRIP_BOOTS_END_STAGE)
    weights.push(['gripBoots', 10])
  if (stageIndex >= VISOR_START_STAGE && stageIndex < VISOR_END_STAGE)
    weights.push(['visor', 10])
  if (stageIndex >= LOCK_ON_START_STAGE && stageIndex < LOCK_ON_END_STAGE)
    weights.push(['lockOn', 10])
  // Overdrive is the finale's capstone reward — rarer than the other
  // hazard-counter items since it does much more (immunity + score boost).
  if (stageIndex >= OVERDRIVE_ITEM_START_STAGE) weights.push(['overdrive', 7])
  if (stageIndex === HIDDEN_FINAL_STAGE_INDEX) {
    // Every Eclipse Protocol phase has a relevant counter. Their extra
    // weight makes the secret finale an adaptation puzzle with comeback
    // routes, not a single unlucky-drop check.
    weights.push(
      ['anchor', 14],
      ['lockOn', 14],
      ['barrier', 10],
      ['timePlus', 10],
      ['overdrive', 5],
    )
  }
  return weights
}

export const MAX_HARPOONS_DEFAULT = 1
export const MAX_HARPOONS_DOUBLE_WIRE = 2
export const MAX_VULCAN_SHOTS = 5

export const DOUBLE_WIRE_DURATION_MS = 12000
export const POWER_WIRE_DURATION_MS = 6000
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
export const MAGNET_DURATION_MS = 8000
export const COMBO_LOCK_DURATION_MS = 10000
export const UMBRELLA_DURATION_MS = 8000
export const GRIP_BOOTS_DURATION_MS = 8000
export const VISOR_DURATION_MS = 8000
export const LOCK_ON_DURATION_MS = 8000
export const OVERDRIVE_DURATION_MS = 8000
export const OVERDRIVE_SCORE_MULTIPLIER = 1.5
export const PIERCE_DURATION_MS = 8000

// Golden Ball: a small universal chance for a stage's initial balls to
// spawn golden instead of their normal color. Popping one (at any size)
// pays out a flat score multiplier plus a distinctive gold particle burst —
// a bit of per-stage excitement that doesn't depend on stage number or any
// hazard, unlike every item above. Split children never inherit the golden
// flag, so the bonus is a one-shot moment rather than a chain.
export const GOLDEN_BALL_CHANCE = 0.12
export const GOLDEN_BALL_SCORE_MULTIPLIER = 3
