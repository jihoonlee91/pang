import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_Y,
  PLAYER_SPEED,
  HARPOON_SPEED,
  VULCAN_SPEED,
  MAX_HP,
  INVULN_MS,
  STAGE_START_INVULN_MS,
  LEVEL_RADIUS,
  SCORE_BY_LEVEL,
  COMBO_WINDOW_MS,
  STAGE_COUNT,
  getStageTimeSeconds,
  getStageItemDropChance,
  TIME_BONUS_PER_SECOND,
  ITEM_RADIUS,
  MAX_HARPOONS_DEFAULT,
  MAX_HARPOONS_DOUBLE_WIRE,
  MAX_VULCAN_SHOTS,
  DOUBLE_WIRE_DURATION_MS,
  POWER_WIRE_DURATION_MS,
  POWER_WIRE_STAY_MS,
  VULCAN_DURATION_MS,
  VULCAN_FIRE_INTERVAL_MS,
  CLOCK_DURATION_MS,
  HOURGLASS_DURATION_MS,
  HOURGLASS_SLOW_FACTOR,
  SPEED_BOOST_DURATION_MS,
  SPEED_BOOST_MULTIPLIER,
  INVINCIBLE_DURATION_MS,
  TIME_PLUS_SECONDS,
  SCORE_BONUS_POINTS,
  STABILIZER_DURATION_MS,
  NOVA_SURGE_DURATION_MS,
  NOVA_SURGE_MULTIPLIER,
  FIREPROOF_DURATION_MS,
  ANCHOR_DURATION_MS,
  getItemWeights,
} from './game/constants'
import type { Obstacle } from './game/constants'
import { getStageTerrain, stepPlayerOnTerrain } from './game/terrain'
import {
  PORTAL_COOLDOWN_MS,
  findPortalTransition,
  getStagePortals,
  teleportBall,
  type Portal,
} from './game/portals'
import { getCurrentWindAx, getStageCurrent } from './game/currents'
import { getStageGravityWell } from './game/gravityWells'
import { getStageNebulaWells } from './game/nebulae'
import { getStageVortex } from './game/vortices'
import {
  getStageFireZones,
  getFireZoneState,
  type FireZone,
} from './game/fireZones'
import { getStageGravityScale } from './game/voidGravity'
import {
  createStage,
  stepBall,
  splitBall,
  harpoonHitsBall,
  harpoonHitsObstacle,
  getPowerHarpoonStopY,
  ballHitsPlayer,
  rollItemDrop,
  stepItem,
  itemHitsPlayer,
  explodeToSmallest,
  predictLandingSpot,
  chooseSafeX,
  type DangerZone,
} from './game/engine'
import type { Ball, Harpoon, Item, ItemType } from './game/types'
import {
  playHitSound,
  playPlayerHitSound,
  playClearSound,
  playGameOverSound,
  playItemSound,
  startBgm,
  stopBgm,
} from './game/audio'
import { drawBackground, STAGE_NAMES } from './game/backgrounds'
import { InputController, type InputAction } from './game/input/InputController'
import type { GameSettings } from './game/settings'
import { addToTotalScore } from './game/scoring'
import TouchControls from './components/TouchControls'
import {
  advanceFixedStep,
  FIXED_DELTA_SECONDS,
  MAX_FRAME_DELTA_SECONDS,
} from './game/loop/GameLoop'

const BALL_COLORS = ['#ff1744', '#ffea00', '#00b0ff']

const HINTS = [
  '← → or A / D: move',
  'Space: fire (only 1 harpoon by default, 2 with double wire)',
  'Hitting a ball shrinks and splits it in two; hitting the smallest removes it',
  'The striped platform blocks harpoons and bounces balls off',
  'Consecutive hits within a short time increase the combo score multiplier',
  'Touching a ball reduces HP by 1, followed by a brief invulnerability period',
  'Hitting balls occasionally drops items — touch one for an instant effect',
]

const ITEM_LABELS: Record<ItemType, string> = {
  doubleWire: 'D',
  powerWire: 'P',
  vulcan: 'V',
  clock: 'C',
  hourglass: 'H',
  barrier: 'B',
  oneUp: '+',
  dynamite: '!',
  speedBoost: 'S',
  invincible: 'I',
  timePlus: 'T',
  scoreBonus: '$',
  stabilizer: 'A',
  novaSurge: '2',
  fireproof: 'F',
  anchor: 'X',
}

const ITEM_COLORS: Record<ItemType, string> = {
  doubleWire: '#38bdf8',
  powerWire: '#22c55e',
  vulcan: '#f97316',
  clock: '#a5b4fc',
  hourglass: '#fbbf24',
  barrier: '#34d399',
  oneUp: '#f472b6',
  dynamite: '#f87171',
  speedBoost: '#2dd4bf',
  invincible: '#c084fc',
  timePlus: '#60a5fa',
  scoreBonus: '#fde047',
  stabilizer: '#22d3ee',
  novaSurge: '#fb923c',
  fireproof: '#f87171',
  anchor: '#94a3b8',
}

const BUFF_LABELS: Record<
  | 'doubleWire'
  | 'powerWire'
  | 'vulcan'
  | 'clock'
  | 'hourglass'
  | 'speedBoost'
  | 'invincible'
  | 'stabilizer'
  | 'novaSurge'
  | 'fireproof'
  | 'anchor',
  string
> = {
  doubleWire: 'Double Wire',
  powerWire: 'Power Harpoon',
  vulcan: 'Vulcan',
  clock: 'Clock (Stop)',
  hourglass: 'Hourglass (Slow)',
  speedBoost: 'Speed Boost',
  invincible: 'Invincible',
  stabilizer: 'Stabilizer',
  novaSurge: 'Nova Surge (x2 Score)',
  fireproof: 'Fireproof',
  anchor: 'Anchor',
}

// Timed buffs start blinking in the HUD once this many seconds remain, so
// their expiry is never a surprise.
const BUFF_LOW_TIME_SECONDS = 3

const TIMED_BUFF_KEYS = [
  'doubleWire',
  'powerWire',
  'vulcan',
  'clock',
  'hourglass',
  'speedBoost',
  'invincible',
  'stabilizer',
  'novaSurge',
  'fireproof',
  'anchor',
] as const

const ITEM_ANNOUNCEMENTS: Record<ItemType, string> = {
  doubleWire: 'Double Wire!',
  powerWire: 'Power Harpoon!',
  vulcan: 'Vulcan!',
  clock: 'Time Stop!',
  hourglass: 'Slow Motion!',
  barrier: 'Barrier!',
  oneUp: '+1 HP!',
  dynamite: 'Dynamite!',
  speedBoost: 'Speed Boost!',
  invincible: 'Invincible!',
  timePlus: 'Time +15!',
  scoreBonus: 'Bonus +1000!',
  stabilizer: 'Stabilizer!',
  novaSurge: 'Nova Surge!',
  fireproof: 'Fireproof!',
  anchor: 'Anchor!',
}

const ITEM_TITLES: Record<ItemType, string> = {
  doubleWire: 'Double Wire',
  powerWire: 'Power Harpoon',
  vulcan: 'Vulcan',
  clock: 'Time Stop',
  hourglass: 'Slow Motion',
  barrier: 'Barrier',
  oneUp: '1UP',
  dynamite: 'Dynamite',
  speedBoost: 'Speed Boost',
  invincible: 'Invincible',
  timePlus: 'Time Plus',
  scoreBonus: 'Score Bonus',
  stabilizer: 'Stabilizer',
  novaSurge: 'Nova Surge',
  fireproof: 'Fireproof',
  anchor: 'Anchor',
}

const ITEM_DESCRIPTIONS: Record<ItemType, string> = {
  doubleWire: '12초 동안 작살을 2개까지 동시에 발사합니다.',
  powerWire:
    '12초 동안 장애물이나 천장까지 닿아 5초간 남는 강화 작살을 발사합니다.',
  vulcan: '12초 동안 빠른 탄환을 연속 발사합니다.',
  clock: '6초 동안 모든 공의 움직임을 멈춥니다.',
  hourglass: '8초 동안 모든 공을 느리게 만듭니다.',
  barrier: '공과 충돌했을 때 피해를 한 번 막아줍니다.',
  oneUp: 'HP를 1 회복합니다.',
  dynamite: '모든 공을 즉시 가장 작은 크기로 분열시킵니다.',
  speedBoost: '10초 동안 이동 속도가 60% 증가합니다.',
  invincible: '8초 동안 공에 닿아도 피해를 받지 않습니다.',
  timePlus: '남은 제한시간이 즉시 15초 증가합니다.',
  scoreBonus: '누적 점수를 즉시 1,000점 추가합니다.',
  stabilizer: '8초 동안 조류/중력 우물/성운/소용돌이 효과를 무력화합니다.',
  novaSurge: '10초 동안 공을 맞혀 얻는 점수가 2배가 됩니다.',
  fireproof: '8초 동안 화염 지대에 닿아도 피해를 받지 않습니다.',
  anchor: '8초 동안 중력을 정상으로 되돌립니다.',
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

type Popup = {
  x: number
  y: number
  text: string
  life: number
  maxLife: number
  color?: string
}

type PickupEffect = {
  type: ItemType
  x: number
  y: number
  life: number
  maxLife: number
}

function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  const { x, y, width, height } = obstacle

  // A dark silhouette plus a cyan halo keeps terrain readable against every
  // bright, dark, illustrated, or code-drawn stage background.
  ctx.save()
  ctx.shadowColor = '#00e5ff'
  ctx.shadowBlur = 20
  ctx.fillStyle = '#020617'
  ctx.fillRect(x - 5, y - 5, width + 10, height + 10)
  ctx.restore()

  const bodyGradient = ctx.createLinearGradient(0, y, 0, y + height)
  bodyGradient.addColorStop(0, '#1e293b')
  bodyGradient.addColorStop(0.5, '#0f172a')
  bodyGradient.addColorStop(1, '#020617')
  ctx.fillStyle = bodyGradient
  ctx.fillRect(x, y, width, height)

  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.clip()
  ctx.fillStyle = '#ffea00'
  const stripeWidth = 16
  for (let sx = x - height; sx < x + width; sx += stripeWidth * 2) {
    ctx.beginPath()
    ctx.moveTo(sx, y + height)
    ctx.lineTo(sx + height, y)
    ctx.lineTo(sx + height + stripeWidth, y)
    ctx.lineTo(sx + stripeWidth, y + height)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  ctx.strokeStyle = '#f8fafc'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)

  ctx.strokeStyle = '#00e5ff'
  ctx.lineWidth = 3
  ctx.strokeRect(x - 3, y - 3, width + 6, height + 6)

  for (const boltX of [x + 9, x + width - 9]) {
    ctx.beginPath()
    ctx.arc(boltX, y + height / 2, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = '#00e5ff'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

function drawPortal(
  ctx: CanvasRenderingContext2D,
  portal: Portal,
  time: number,
) {
  ctx.save()
  ctx.translate(portal.x, portal.y)
  ctx.rotate((time / 900) % (Math.PI * 2))
  ctx.shadowColor = portal.color
  ctx.shadowBlur = 22

  for (let ring = 0; ring < 3; ring += 1) {
    ctx.strokeStyle = portal.color
    ctx.globalAlpha = 1 - ring * 0.24
    ctx.lineWidth = 5 - ring
    ctx.setLineDash([9 + ring * 3, 6])
    ctx.beginPath()
    ctx.arc(0, 0, 20 + ring * 7, ring * 0.7, Math.PI * 2 + ring * 0.7)
    ctx.stroke()
  }

  ctx.setLineDash([])
  ctx.globalAlpha = 0.78
  const core = ctx.createRadialGradient(0, 0, 2, 0, 0, 19)
  core.addColorStop(0, '#020617')
  core.addColorStop(0.7, '#09091f')
  core.addColorStop(1, portal.color)
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(0, 0, 19, 0, Math.PI * 2)
  ctx.fill()

  ctx.rotate(-((time / 900) % (Math.PI * 2)))
  ctx.globalAlpha = 1
  ctx.fillStyle = '#ffffff'
  ctx.font = "700 11px 'Galmuri11', monospace"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(portal.label, 0, 1)
  ctx.restore()
}

// Drifting chevrons hinting at the trench current's direction/strength —
// purely decorative, the actual push is applied to balls in the physics step.
function drawCurrentFlow(
  ctx: CanvasRenderingContext2D,
  windAx: number,
  time: number,
) {
  if (Math.abs(windAx) < 5) return
  const direction = windAx > 0 ? 1 : -1
  const period = CANVAS_WIDTH + 60
  const drift = ((time / 1000) * 60 * direction) % period

  ctx.save()
  ctx.globalAlpha = Math.min(0.5, 0.2 + Math.abs(windAx) / 400)
  ctx.strokeStyle = '#7dd3fc'
  ctx.lineWidth = 2
  for (const y of [150, 250, 350, 430]) {
    for (let i = 0; i < 6; i += 1) {
      const raw = (i * (period / 6) + drift) % period
      const x = ((raw + period) % period) - 30
      ctx.beginPath()
      ctx.moveTo(x - 9 * direction, y - 6)
      ctx.lineTo(x, y)
      ctx.lineTo(x - 9 * direction, y + 6)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawGravityWell(
  ctx: CanvasRenderingContext2D,
  well: { x: number; y: number },
  time: number,
) {
  ctx.save()
  ctx.translate(well.x, well.y)
  ctx.shadowColor = '#c084fc'
  ctx.shadowBlur = 26

  for (let arm = 0; arm < 3; arm += 1) {
    ctx.strokeStyle = '#c084fc'
    ctx.globalAlpha = 0.5 - arm * 0.12
    ctx.lineWidth = 3 - arm * 0.6
    const armOffset = (arm * (Math.PI * 2)) / 3
    const spinTime = time / 500
    ctx.beginPath()
    for (let t = 0; t <= 1; t += 0.05) {
      const radius = 6 + t * 46
      const angle = armOffset + spinTime + t * 6
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (t === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  ctx.globalAlpha = 0.9
  const core = ctx.createRadialGradient(0, 0, 2, 0, 0, 16)
  core.addColorStop(0, '#f5f3ff')
  core.addColorStop(0.5, '#c084fc')
  core.addColorStop(1, '#1e0b33')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(0, 0, 16, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawFireZones(
  ctx: CanvasRenderingContext2D,
  zones: readonly FireZone[],
  time: number,
) {
  const floorY = PLAYER_Y + 26
  for (const zone of zones) {
    const state = getFireZoneState(zone, time)
    if (state === 'dormant') continue

    ctx.save()
    if (state === 'warning') {
      ctx.globalAlpha = 0.35 + Math.sin(time / 90) * 0.15
      ctx.fillStyle = '#f97316'
      ctx.fillRect(zone.x, floorY - 6, zone.width, 10)
    } else {
      ctx.shadowColor = '#fb923c'
      ctx.shadowBlur = 22
      const flame = ctx.createLinearGradient(0, floorY - 70, 0, floorY + 8)
      flame.addColorStop(0, 'rgba(253, 224, 71, 0)')
      flame.addColorStop(0.5, '#fb923c')
      flame.addColorStop(1, '#f97316')
      ctx.fillStyle = flame
      const flicker = Math.sin(time / 60) * 6
      ctx.beginPath()
      ctx.moveTo(zone.x, floorY)
      for (let x = zone.x; x <= zone.x + zone.width; x += 14) {
        const h = 40 + Math.sin((x + time / 40) / 18) * 16 + flicker
        ctx.lineTo(x, floorY - h)
      }
      ctx.lineTo(zone.x + zone.width, floorY)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }
}

function drawBrickFrame(ctx: CanvasRenderingContext2D) {
  const thickness = 12
  const rows = 2
  const mortar = 2
  const horizontalBrick = 38
  const verticalBrick = 28
  const rowSize = thickness / rows

  ctx.save()
  ctx.fillStyle = '#431407'
  ctx.fillRect(0, 0, CANVAS_WIDTH, thickness)
  ctx.fillRect(0, CANVAS_HEIGHT - thickness, CANVAS_WIDTH, thickness)
  ctx.fillRect(0, thickness, thickness, CANVAS_HEIGHT - thickness * 2)
  ctx.fillRect(
    CANVAS_WIDTH - thickness,
    thickness,
    thickness,
    CANVAS_HEIGHT - thickness * 2,
  )

  const drawBrick = (x: number, y: number, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(0, y, 0, y + height)
    gradient.addColorStop(0, '#fb923c')
    gradient.addColorStop(0.25, '#c2410c')
    gradient.addColorStop(1, '#7c2d12')
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = '#2a0c04'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1)
  }

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : -horizontalBrick / 2
    for (let x = offset; x < CANVAS_WIDTH; x += horizontalBrick) {
      const brickWidth = Math.min(horizontalBrick - mortar, CANVAS_WIDTH - x)
      if (brickWidth <= 0) continue
      drawBrick(x, row * rowSize, brickWidth, rowSize - mortar)
      drawBrick(
        x,
        CANVAS_HEIGHT - thickness + row * rowSize,
        brickWidth,
        rowSize - mortar,
      )
    }
  }

  for (let column = 0; column < rows; column += 1) {
    const offset = column % 2 === 0 ? thickness : thickness - verticalBrick / 2
    for (let y = offset; y < CANVAS_HEIGHT - thickness; y += verticalBrick) {
      const brickHeight = Math.min(
        verticalBrick - mortar,
        CANVAS_HEIGHT - thickness - y,
      )
      if (brickHeight <= 0) continue
      drawBrick(column * rowSize, y, rowSize - mortar, brickHeight)
      drawBrick(
        CANVAS_WIDTH - thickness + column * rowSize,
        y,
        rowSize - mortar,
        brickHeight,
      )
    }
  }

  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 2
  ctx.strokeRect(
    thickness,
    thickness,
    CANVAS_WIDTH - thickness * 2,
    CANVAS_HEIGHT - thickness * 2,
  )
  ctx.restore()
}

function drawHarpoon(ctx: CanvasRenderingContext2D, harpoon: Harpoon) {
  if (harpoon.kind === 'vulcan') {
    ctx.save()
    ctx.shadowColor = '#fb923c'
    ctx.shadowBlur = 8
    ctx.strokeStyle = '#7c2d12'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(harpoon.x, harpoon.y + 12)
    ctx.lineTo(harpoon.x, harpoon.y)
    ctx.stroke()
    ctx.fillStyle = '#f8fafc'
    ctx.beginPath()
    ctx.arc(harpoon.x, harpoon.y, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  const baseY = harpoon.baseY ?? PLAYER_Y
  const ropeTop = Math.min(baseY, harpoon.y + 16)
  const isPowerWire = harpoon.kind === 'powerWire'

  ctx.save()
  ctx.lineCap = 'round'
  ctx.shadowColor = '#00000055'
  ctx.shadowBlur = 3

  // Dark outline keeps the rope readable against every stage background.
  ctx.strokeStyle = isPowerWire ? '#14532d' : '#3f2d20'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(harpoon.x, baseY)
  ctx.lineTo(harpoon.x, ropeTop)
  ctx.stroke()

  // Two offset dashed strands give the vertical line a twisted-rope texture.
  ctx.shadowBlur = 0
  ctx.lineWidth = 2
  ctx.setLineDash([5, 4])
  ctx.strokeStyle = isPowerWire ? '#bbf7d0' : '#e7c58d'
  ctx.beginPath()
  ctx.moveTo(harpoon.x - 1, baseY)
  ctx.lineTo(harpoon.x - 1, ropeTop)
  ctx.stroke()
  ctx.lineDashOffset = 4.5
  ctx.strokeStyle = isPowerWire ? '#22c55e' : '#9a6a3a'
  ctx.beginPath()
  ctx.moveTo(harpoon.x + 1, baseY)
  ctx.lineTo(harpoon.x + 1, ropeTop)
  ctx.stroke()
  ctx.setLineDash([])

  // A broad metal point with side barbs reads as a harpoon, not a plain wire.
  const metal = ctx.createLinearGradient(harpoon.x - 8, 0, harpoon.x + 8, 0)
  metal.addColorStop(0, isPowerWire ? '#15803d' : '#64748b')
  metal.addColorStop(0.48, '#f8fafc')
  metal.addColorStop(1, isPowerWire ? '#166534' : '#475569')
  ctx.fillStyle = metal
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(harpoon.x, harpoon.y)
  ctx.lineTo(harpoon.x - 8, harpoon.y + 11)
  ctx.lineTo(harpoon.x - 3, harpoon.y + 9)
  ctx.lineTo(harpoon.x - 3, harpoon.y + 16)
  ctx.lineTo(harpoon.x + 3, harpoon.y + 16)
  ctx.lineTo(harpoon.x + 3, harpoon.y + 9)
  ctx.lineTo(harpoon.x + 8, harpoon.y + 11)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  const r = LEVEL_RADIUS[ball.level]
  const color = BALL_COLORS[ball.level]

  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = 12
  const gradient = ctx.createRadialGradient(
    ball.x - r * 0.35,
    ball.y - r * 0.35,
    r * 0.1,
    ball.x,
    ball.y,
    r,
  )
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.18, color)
  gradient.addColorStop(0.72, color)
  gradient.addColorStop(1, '#020617')

  ctx.beginPath()
  ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#020617'
  ctx.stroke()
  ctx.restore()
}

function traceShield(ctx: CanvasRenderingContext2D, scale = 1) {
  ctx.beginPath()
  ctx.moveTo(0, -11 * scale)
  ctx.lineTo(9 * scale, -7 * scale)
  ctx.lineTo(8 * scale, 3 * scale)
  ctx.quadraticCurveTo(6 * scale, 10 * scale, 0, 13 * scale)
  ctx.quadraticCurveTo(-6 * scale, 10 * scale, -8 * scale, 3 * scale)
  ctx.lineTo(-9 * scale, -7 * scale)
  ctx.closePath()
}

function traceStar(
  ctx: CanvasRenderingContext2D,
  outer: number,
  inner: number,
) {
  ctx.beginPath()
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outer : inner
    const angle = -Math.PI / 2 + (Math.PI * point) / 5
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (point === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function drawFallingItemIcon(
  ctx: CanvasRenderingContext2D,
  type: ItemType,
  color: string,
) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#ffffff'
  ctx.fillStyle = color
  ctx.lineWidth = 2.2

  switch (type) {
    case 'doubleWire':
      for (const x of [-5, 5]) {
        ctx.beginPath()
        ctx.moveTo(x, 10)
        ctx.lineTo(x, -8)
        ctx.moveTo(x - 3, -5)
        ctx.lineTo(x, -10)
        ctx.lineTo(x + 3, -5)
        ctx.stroke()
      }
      break
    case 'powerWire':
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.lineTo(0, -7)
      ctx.stroke()
      ctx.fillStyle = '#fef08a'
      ctx.beginPath()
      ctx.moveTo(0, -13)
      ctx.lineTo(-6, -5)
      ctx.lineTo(6, -5)
      ctx.closePath()
      ctx.fill()
      break
    case 'vulcan':
      ctx.save()
      ctx.rotate(-0.18)
      ctx.fillStyle = '#fb923c'
      ctx.fillRect(-8, -5, 11, 11)
      ctx.fillStyle = '#e2e8f0'
      for (const y of [-6, -1, 4]) ctx.fillRect(2, y, 11, 3)
      ctx.fillStyle = '#64748b'
      ctx.fillRect(-3, 5, 5, 8)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.strokeRect(-8, -5, 11, 11)
      ctx.restore()
      break
    case 'clock':
      ctx.beginPath()
      ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#0f172a'
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -6)
      ctx.moveTo(0, 0)
      ctx.lineTo(5, 3)
      ctx.stroke()
      break
    case 'hourglass':
      ctx.strokeStyle = '#fef3c7'
      ctx.beginPath()
      ctx.moveTo(-8, -11)
      ctx.lineTo(8, -11)
      ctx.moveTo(-8, 11)
      ctx.lineTo(8, 11)
      ctx.moveTo(-6, -9)
      ctx.quadraticCurveTo(-5, -2, 0, 0)
      ctx.quadraticCurveTo(5, 3, 6, 9)
      ctx.moveTo(6, -9)
      ctx.quadraticCurveTo(5, -2, 0, 0)
      ctx.quadraticCurveTo(-5, 3, -6, 9)
      ctx.stroke()
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.moveTo(-4, 7)
      ctx.lineTo(4, 7)
      ctx.lineTo(0, 2)
      ctx.closePath()
      ctx.fill()
      break
    case 'barrier':
      traceShield(ctx)
      ctx.fillStyle = '#34d399'
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#064e3b'
      ctx.beginPath()
      ctx.moveTo(0, -7)
      ctx.lineTo(0, 8)
      ctx.moveTo(-6, -4)
      ctx.lineTo(6, -4)
      ctx.stroke()
      break
    case 'oneUp':
      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.bezierCurveTo(-13, 1, -11, -9, -5, -9)
      ctx.bezierCurveTo(-2, -9, 0, -6, 0, -4)
      ctx.bezierCurveTo(0, -6, 2, -9, 5, -9)
      ctx.bezierCurveTo(11, -9, 13, 1, 0, 10)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(0, -4)
      ctx.lineTo(0, 4)
      ctx.moveTo(-4, 0)
      ctx.lineTo(4, 0)
      ctx.stroke()
      break
    case 'dynamite':
      ctx.save()
      ctx.rotate(-0.12)
      ctx.fillStyle = '#ef4444'
      for (const x of [-7, 0, 7]) {
        ctx.fillRect(x - 3, -9, 6, 18)
      }
      ctx.fillStyle = '#111827'
      ctx.fillRect(-11, -3, 22, 6)
      ctx.strokeStyle = '#fef3c7'
      ctx.beginPath()
      ctx.moveTo(7, -9)
      ctx.quadraticCurveTo(12, -15, 14, -10)
      ctx.stroke()
      ctx.fillStyle = '#fde047'
      ctx.beginPath()
      ctx.arc(14, -10, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      break
    case 'speedBoost':
      ctx.strokeStyle = '#5eead4'
      ctx.lineWidth = 3
      for (const offset of [-6, 1, 8]) {
        ctx.beginPath()
        ctx.moveTo(-9, offset - 6)
        ctx.lineTo(0, offset)
        ctx.lineTo(-9, offset + 6)
        ctx.moveTo(1, offset - 6)
        ctx.lineTo(10, offset)
        ctx.lineTo(1, offset + 6)
        ctx.stroke()
      }
      break
    case 'invincible':
      traceShield(ctx, 1.05)
      ctx.fillStyle = '#7e22ce'
      ctx.fill()
      ctx.stroke()
      traceStar(ctx, 7, 3.2)
      ctx.fillStyle = '#fef08a'
      ctx.fill()
      break
    case 'timePlus':
      ctx.beginPath()
      ctx.arc(-3, 1, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#0f172a'
      ctx.beginPath()
      ctx.moveTo(-3, 1)
      ctx.lineTo(-3, -5)
      ctx.moveTo(-3, 1)
      ctx.lineTo(1, 4)
      ctx.stroke()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(7, -7)
      ctx.lineTo(7, 3)
      ctx.moveTo(2, -2)
      ctx.lineTo(12, -2)
      ctx.stroke()
      break
    case 'scoreBonus':
      ctx.beginPath()
      ctx.arc(0, 0, 11, 0, Math.PI * 2)
      ctx.fillStyle = '#facc15'
      ctx.fill()
      ctx.stroke()
      traceStar(ctx, 7, 3.2)
      ctx.fillStyle = '#fff7b2'
      ctx.fill()
      break
    case 'stabilizer':
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(0, -8, 3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -5)
      ctx.lineTo(0, 9)
      ctx.moveTo(-6, -1)
      ctx.lineTo(6, -1)
      ctx.moveTo(0, 9)
      ctx.quadraticCurveTo(-7, 9, -7, 2)
      ctx.moveTo(0, 9)
      ctx.quadraticCurveTo(7, 9, 7, 2)
      ctx.stroke()
      break
    case 'novaSurge':
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = 2
      for (let ray = 0; ray < 8; ray += 1) {
        const angle = (ray / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6)
        ctx.lineTo(Math.cos(angle) * 11, Math.sin(angle) * 11)
        ctx.stroke()
      }
      break
    case 'fireproof':
      ctx.beginPath()
      ctx.moveTo(0, -10)
      ctx.quadraticCurveTo(-7, -2, -4, 4)
      ctx.quadraticCurveTo(-6, 8, 0, 9)
      ctx.quadraticCurveTo(6, 8, 4, 2)
      ctx.quadraticCurveTo(7, 0, 4, -6)
      ctx.quadraticCurveTo(2, -2, 0, -10)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#f8fafc'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-9, 9)
      ctx.lineTo(9, -9)
      ctx.stroke()
      break
    case 'anchor':
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(0, -7, 3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -4)
      ctx.lineTo(0, 8)
      ctx.moveTo(-7, -1)
      ctx.lineTo(7, -1)
      ctx.moveTo(-6, 5)
      ctx.quadraticCurveTo(-6, 9, 0, 9)
      ctx.moveTo(6, 5)
      ctx.quadraticCurveTo(6, 9, 0, 9)
      ctx.stroke()
      break
  }
}

function drawItem(ctx: CanvasRenderingContext2D, item: Item) {
  const color = ITEM_COLORS[item.type]
  const pulse = 1 + Math.sin(item.y / 12) * 0.06

  ctx.save()
  ctx.translate(item.x, item.y)
  ctx.scale(pulse, pulse)
  ctx.shadowColor = color
  ctx.shadowBlur = 16
  ctx.beginPath()
  ctx.arc(0, 0, ITEM_RADIUS, 0, Math.PI * 2)
  ctx.fillStyle = '#07142f'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = color
  ctx.stroke()

  ctx.shadowBlur = 5
  drawFallingItemIcon(ctx, item.type, color)
  ctx.restore()
}

function spawnBurst(
  particles: Particle[],
  x: number,
  y: number,
  color: string,
) {
  const count = 10
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const speed = 90 + (i % 3) * 40
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 400,
      maxLife: 400,
      color,
    })
  }
}

function spawnPickupCelebration(
  particles: Particle[],
  effects: PickupEffect[],
  x: number,
  y: number,
  type: ItemType,
) {
  const color = ITEM_COLORS[type]
  const count = 28
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count
    const speed = 130 + (i % 4) * 55
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 35,
      life: 650,
      maxLife: 650,
      color: i % 4 === 0 ? '#ffffff' : color,
    })
  }
  effects.push({ type, x, y, life: 720, maxLife: 720 })
}

function drawPickupEffect(ctx: CanvasRenderingContext2D, effect: PickupEffect) {
  const remaining = effect.life / effect.maxLife
  const progress = 1 - remaining
  const color = ITEM_COLORS[effect.type]
  const radius = 24 + progress * 110

  ctx.save()
  ctx.globalAlpha = remaining * 0.16
  ctx.fillStyle = color
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.globalAlpha = remaining
  ctx.shadowColor = color
  ctx.shadowBlur = 22
  ctx.strokeStyle = color
  ctx.lineWidth = 8 * remaining + 2
  ctx.beginPath()
  ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.globalAlpha = remaining * 0.72
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(effect.x, effect.y, radius * 0.72, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawBarrierShell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  charges: number,
  time: number,
) {
  ctx.save()
  const pulse = 1 + Math.sin(time / 150) * 0.04
  ctx.translate(x, y - 3)
  ctx.scale(pulse, pulse)
  ctx.shadowColor = '#facc15'
  ctx.shadowBlur = 18
  ctx.fillStyle = 'rgba(250, 204, 21, 0.16)'
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.ellipse(0, 0, 37, 29, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 5
  ctx.setLineDash([13, 7])
  ctx.lineDashOffset = -(time / 55)
  ctx.beginPath()
  ctx.ellipse(0, 0, 43, 34, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  for (let plate = 0; plate < 6; plate += 1) {
    const angle = (Math.PI * 2 * plate) / 6
    const plateX = Math.cos(angle) * 39
    const plateY = Math.sin(angle) * 30
    ctx.save()
    ctx.translate(plateX, plateY)
    ctx.rotate(angle + Math.PI / 4)
    ctx.fillStyle = '#facc15'
    ctx.fillRect(-4, -4, 8, 8)
    ctx.restore()
  }

  ctx.fillStyle = '#09091f'
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(34, -30, 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.font = "700 10px 'Galmuri11', monospace"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(charges), 34, -29)
  ctx.restore()
}

function drawInvincibleShield(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
) {
  const rotation = (time / 520) % (Math.PI * 2)
  ctx.save()
  ctx.translate(x, y - 4)
  ctx.shadowColor = '#22d3ee'
  ctx.shadowBlur = 24
  ctx.fillStyle = 'rgba(34, 211, 238, 0.14)'
  ctx.beginPath()
  ctx.ellipse(0, 0, 45, 36, 0, 0, Math.PI * 2)
  ctx.fill()

  for (let ring = 0; ring < 2; ring += 1) {
    ctx.save()
    ctx.rotate(rotation * (ring === 0 ? 1 : -1))
    ctx.strokeStyle = ring === 0 ? '#67e8f9' : '#f0abfc'
    ctx.lineWidth = 4
    ctx.setLineDash([18, 9])
    ctx.beginPath()
    ctx.ellipse(0, 0, 45 - ring * 6, 36 - ring * 5, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  for (let spark = 0; spark < 6; spark += 1) {
    const angle = rotation + (Math.PI * 2 * spark) / 6
    const sparkX = Math.cos(angle) * 48
    const sparkY = Math.sin(angle) * 37
    ctx.fillStyle = spark % 2 === 0 ? '#ffffff' : '#f0abfc'
    ctx.fillRect(sparkX - 2, sparkY - 2, 4, 4)
  }
  ctx.restore()
}

function drawSpeedTrails(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
) {
  ctx.save()
  ctx.strokeStyle = '#2dd4bf'
  ctx.lineWidth = 3
  ctx.shadowColor = '#2dd4bf'
  ctx.shadowBlur = 10
  for (let trail = 0; trail < 4; trail += 1) {
    const offset = ((time / 8 + trail * 17) % 54) - 27
    ctx.globalAlpha = 0.25 + trail * 0.16
    ctx.beginPath()
    ctx.moveTo(x - 30 - Math.abs(offset), y - 12 + trail * 7)
    ctx.lineTo(x - 8, y - 12 + trail * 7)
    ctx.moveTo(x + 8, y - 12 + trail * 7)
    ctx.lineTo(x + 30 + Math.abs(offset), y - 12 + trail * 7)
    ctx.stroke()
  }
  ctx.restore()
}

function drawWeaponAura(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kind: 'doubleWire' | 'powerWire' | 'vulcan',
  time: number,
) {
  const colors = {
    doubleWire: '#22d3ee',
    powerWire: '#facc15',
    vulcan: '#fb923c',
  } as const
  const color = colors[kind]
  const pulse = 0.6 + Math.sin(time / 95) * 0.22

  ctx.save()
  ctx.translate(x, y - 23)
  ctx.shadowColor = color
  ctx.shadowBlur = 16
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = kind === 'powerWire' ? 4 : 3
  ctx.globalAlpha = pulse

  if (kind === 'doubleWire') {
    for (const side of [-1, 1]) {
      ctx.fillRect(side * 10 - 3, -7, 6, 16)
      ctx.beginPath()
      ctx.arc(side * 10, -10, 5, 0, Math.PI * 2)
      ctx.stroke()
    }
  } else if (kind === 'powerWire') {
    const radius = 11 + ((time / 45) % 9)
    ctx.beginPath()
    ctx.arc(0, -3, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillRect(-4, -15, 8, 24)
  } else {
    ctx.rotate((time / 120) % (Math.PI * 2))
    for (let barrel = 0; barrel < 4; barrel += 1) {
      ctx.rotate(Math.PI / 2)
      ctx.fillRect(-2, -19, 4, 14)
    }
    ctx.beginPath()
    ctx.arc(0, 0, 7, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

type PlayerTheme = 'explorer' | 'ranger' | 'voyager' | 'diver' | 'pilot'

// The player's look reskins every 10 stages to match that block's theme:
// the base explorer turret, a night-ops ranger variant, a neon "voyager"
// suit for the dimension portals, a diving suit for the trench current,
// and a small rocket ship for the stellar-forge finale.
function getPlayerTheme(stageIndex: number): PlayerTheme {
  if (stageIndex < 10) return 'explorer'
  if (stageIndex < 20) return 'ranger'
  if (stageIndex < 30) return 'voyager'
  if (stageIndex < 40) return 'diver'
  return 'pilot'
}

function drawPlayerShip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  theme: PlayerTheme,
  isInvuln: boolean,
  time: number,
) {
  const px = x - PLAYER_WIDTH / 2
  const py = y - PLAYER_HEIGHT / 2
  const radius = 4

  ctx.save()
  if (isInvuln) {
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 12
  }

  if (theme === 'explorer') {
    ctx.fillStyle = '#374151'
    ctx.fillRect(x - 4, py - 16, 8, 16)
  } else if (theme === 'ranger') {
    ctx.fillStyle = '#374151'
    ctx.fillRect(x - 4, py - 16, 8, 16)
    ctx.save()
    ctx.strokeStyle = '#67e8f9'
    ctx.shadowColor = '#67e8f9'
    ctx.shadowBlur = 6
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(x + side * (PLAYER_WIDTH / 2 - 2), py + 4)
      ctx.lineTo(x + side * (PLAYER_WIDTH / 2 + 11), py - 9)
      ctx.stroke()
      ctx.fillStyle = '#67e8f9'
      ctx.beginPath()
      ctx.arc(x + side * (PLAYER_WIDTH / 2 + 11), py - 9, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  } else if (theme === 'voyager') {
    ctx.fillStyle = '#374151'
    ctx.fillRect(x - 4, py - 18, 8, 12)
    ctx.save()
    ctx.fillStyle = '#f472b6'
    ctx.shadowColor = '#f472b6'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(x, py - 20, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = '#22d3ee'
    ctx.shadowColor = '#22d3ee'
    ctx.shadowBlur = 6
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(x + side * (PLAYER_WIDTH / 2 - 2), py + PLAYER_HEIGHT - 2)
      ctx.lineTo(x + side * (PLAYER_WIDTH / 2 + 10), py + PLAYER_HEIGHT + 8)
      ctx.stroke()
    }
    ctx.restore()
  } else if (theme === 'diver') {
    ctx.fillStyle = 'rgba(125, 211, 252, 0.35)'
    ctx.strokeStyle = '#7dd3fc'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, py + 2, 11, Math.PI, 0)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#0369a1'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(x + side * (PLAYER_WIDTH / 2 + 3), y, 4, 9, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    const flicker = 6 + Math.sin(time / 60) * 2
    ctx.save()
    ctx.globalAlpha = 0.85
    ctx.fillStyle = '#fb923c'
    ctx.beginPath()
    ctx.moveTo(x - 5, py + PLAYER_HEIGHT)
    ctx.lineTo(x, py + PLAYER_HEIGHT + flicker)
    ctx.lineTo(x + 5, py + PLAYER_HEIGHT)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = '#cbd5e1'
    ctx.beginPath()
    ctx.moveTo(x - 8, py)
    ctx.lineTo(x, py - 16)
    ctx.lineTo(x + 8, py)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#1e293b'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(x + side * (PLAYER_WIDTH / 2 - 2), py + 4)
      ctx.lineTo(x + side * (PLAYER_WIDTH / 2 + 9), py + PLAYER_HEIGHT)
      ctx.lineTo(x + side * (PLAYER_WIDTH / 2 - 2), py + PLAYER_HEIGHT)
      ctx.closePath()
      ctx.fill()
    }
  }

  const bodyGradient = ctx.createLinearGradient(0, py, 0, py + PLAYER_HEIGHT)
  bodyGradient.addColorStop(0, isInvuln ? '#fef08a' : '#f87171')
  bodyGradient.addColorStop(1, isInvuln ? '#fbbf24' : '#b91c1c')
  ctx.fillStyle = bodyGradient
  ctx.beginPath()
  ctx.moveTo(px + radius, py)
  ctx.arcTo(
    px + PLAYER_WIDTH,
    py,
    px + PLAYER_WIDTH,
    py + PLAYER_HEIGHT,
    radius,
  )
  ctx.arcTo(
    px + PLAYER_WIDTH,
    py + PLAYER_HEIGHT,
    px,
    py + PLAYER_HEIGHT,
    radius,
  )
  ctx.arcTo(px, py + PLAYER_HEIGHT, px, py, radius)
  ctx.arcTo(px, py, px + PLAYER_WIDTH, py, radius)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

type Props = {
  stageIndex: number
  initialScore?: number
  startCountdown?: number
  onClear: (score: number) => void
  onGameOver: (score: number) => void
  demo?: boolean
  settings: GameSettings
  onQuit: () => void
}

const AI_DEADZONE = 10
const AI_FIRE_TOLERANCE = 18
// Extra margin beyond the exact ball-radius + player-half-width collision
// distance, so the AI starts dodging with some reaction room rather than
// shaving hits as close as physically possible.
const AI_DODGE_BUFFER = 18
const HIT_EFFECT_MS = 350

type BuffDisplay = {
  doubleWire: number
  powerWire: number
  vulcan: number
  clock: number
  hourglass: number
  barrier: number
  speedBoost: number
  invincible: number
  stabilizer: number
  novaSurge: number
  fireproof: number
  anchor: number
}

const NO_BUFFS: BuffDisplay = {
  doubleWire: 0,
  powerWire: 0,
  vulcan: 0,
  clock: 0,
  hourglass: 0,
  barrier: 0,
  speedBoost: 0,
  invincible: 0,
  stabilizer: 0,
  novaSurge: 0,
  fireproof: 0,
  anchor: 0,
}

function GamePlay({
  stageIndex,
  initialScore = 0,
  startCountdown,
  onClear,
  onGameOver,
  demo = false,
  settings,
  onQuit,
}: Props) {
  const isStarting = startCountdown !== undefined
  const terrain = getStageTerrain(stageIndex)
  const portalPairs = useMemo(() => getStagePortals(stageIndex), [stageIndex])
  const stageCurrent = useMemo(() => getStageCurrent(stageIndex), [stageIndex])
  // Gravity wells, nebula fields, and vortices are all the same underlying
  // hazard (one or more fixed pull points) — nebula fields are just two
  // weaker wells, vortices add spin — and none of the three ranges overlap,
  // so they share one slot. stepBall/predictLandingSpot already accept a
  // single well or an array of them.
  const gravityWell = useMemo(
    () =>
      getStageGravityWell(stageIndex) ??
      getStageNebulaWells(stageIndex) ??
      getStageVortex(stageIndex),
    [stageIndex],
  )
  const isVortexStage =
    !Array.isArray(gravityWell) && gravityWell?.spin !== undefined
  const isNebulaStage = Array.isArray(gravityWell)
  const fireZones = useMemo(() => getStageFireZones(stageIndex), [stageIndex])
  const gravityScale = useMemo(
    () => getStageGravityScale(stageIndex),
    [stageIndex],
  )
  const stageTimeSeconds = getStageTimeSeconds(stageIndex)
  const stageItemDropChance = getStageItemDropChance(stageIndex)
  const stageItemWeights = useMemo(
    () => getItemWeights(stageIndex),
    [stageIndex],
  )
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const playerXRef = useRef(CANVAS_WIDTH / 2)
  const playerYRef = useRef(PLAYER_Y)
  const ballsRef = useRef<Ball[]>(createStage(stageIndex))
  const harpoonsRef = useRef<Harpoon[]>([])
  const itemsRef = useRef<Item[]>([])
  const hpRef = useRef(MAX_HP)
  const invulnUntilRef = useRef(0)
  const hitEffectUntilRef = useRef(0)
  const comboRef = useRef(0)
  const lastHitAtRef = useRef(0)
  const scoreRef = useRef(initialScore)
  const nextIdRef = useRef(1000 * (stageIndex + 1))
  const nextItemIdRef = useRef(1)
  const inputRef = useRef(new InputController())
  const dragRef = useRef<{
    startClientX: number
    startPlayerX: number
    moved: boolean
  } | null>(null)
  const dragTargetXRef = useRef<number | null>(null)
  const fireRequestedRef = useRef(false)
  const stageStartScoreRef = useRef(0)
  const dprRef = useRef(1)
  const pausedAtRef = useRef<number | null>(null)
  const timeRemainingRef = useRef(stageTimeSeconds)
  const lastDisplayedTimeRef = useRef(stageTimeSeconds)
  const lastFireAtRef = useRef(0)
  const itemNoticeTimerRef = useRef<number | null>(null)
  const endedRef = useRef(false)
  const particlesRef = useRef<Particle[]>([])
  const popupsRef = useRef<Popup[]>([])
  const pickupEffectsRef = useRef<PickupEffect[]>([])

  const doubleWireUntilRef = useRef(0)
  const powerWireUntilRef = useRef(0)
  const vulcanUntilRef = useRef(0)
  const clockUntilRef = useRef(0)
  const hourglassUntilRef = useRef(0)
  const speedBoostUntilRef = useRef(0)
  const invincibleUntilRef = useRef(0)
  const stabilizerUntilRef = useRef(0)
  const novaSurgeUntilRef = useRef(0)
  const fireproofUntilRef = useRef(0)
  const anchorUntilRef = useRef(0)
  const barrierCountRef = useRef(0)
  const portalCooldownsRef = useRef(new Map<number, number>())
  const buffsDisplayRef = useRef<BuffDisplay>(NO_BUFFS)
  const aiKeysDisplayRef = useRef({ left: false, right: false, fire: false })

  const [hp, setHp] = useState(MAX_HP)
  const [hpPulseKey, setHpPulseKey] = useState(0)
  const prevHpRef = useRef(MAX_HP)
  const [score, setScore] = useState(initialScore)
  const [timeRemaining, setTimeRemaining] = useState(stageTimeSeconds)
  const [itemNotice, setItemNotice] = useState<ItemType | null>(null)
  const [paused, setPaused] = useState(false)
  const [fps, setFps] = useState(60)
  const [buffs, setBuffs] = useState<BuffDisplay>(NO_BUFFS)
  const [aiKeys, setAiKeys] = useState({
    left: false,
    right: false,
    fire: false,
  })

  const resetStageState = useCallback(
    (restoreScore: boolean) => {
      ballsRef.current = createStage(stageIndex)
      harpoonsRef.current = []
      itemsRef.current = []
      hpRef.current = MAX_HP
      invulnUntilRef.current = performance.now() + STAGE_START_INVULN_MS
      comboRef.current = 0
      lastHitAtRef.current = 0
      endedRef.current = false
      particlesRef.current = []
      popupsRef.current = []
      pickupEffectsRef.current = []
      doubleWireUntilRef.current = 0
      powerWireUntilRef.current = 0
      vulcanUntilRef.current = 0
      clockUntilRef.current = 0
      hourglassUntilRef.current = 0
      speedBoostUntilRef.current = 0
      invincibleUntilRef.current = 0
      novaSurgeUntilRef.current = 0
      fireproofUntilRef.current = 0
      anchorUntilRef.current = 0
      barrierCountRef.current = 0
      portalCooldownsRef.current.clear()
      playerXRef.current = CANVAS_WIDTH / 2
      playerYRef.current = PLAYER_Y
      inputRef.current.releaseAll()
      dragRef.current = null
      dragTargetXRef.current = null
      fireRequestedRef.current = false
      timeRemainingRef.current = stageTimeSeconds
      lastDisplayedTimeRef.current = stageTimeSeconds
      lastFireAtRef.current = 0
      if (itemNoticeTimerRef.current !== null) {
        window.clearTimeout(itemNoticeTimerRef.current)
        itemNoticeTimerRef.current = null
      }
      buffsDisplayRef.current = NO_BUFFS
      setHp(MAX_HP)
      setBuffs(NO_BUFFS)
      setTimeRemaining(stageTimeSeconds)
      setItemNotice(null)
      if (restoreScore) {
        scoreRef.current = stageStartScoreRef.current
        setScore(stageStartScoreRef.current)
      } else {
        stageStartScoreRef.current = scoreRef.current
      }
    },
    [stageIndex, stageTimeSeconds],
  )

  useEffect(() => {
    resetStageState(false)
    setPaused(false)
  }, [resetStageState])

  useEffect(() => {
    if (hp < prevHpRef.current) setHpPulseKey((key) => key + 1)
    prevHpRef.current = hp
  }, [hp])

  useEffect(
    () => () => {
      if (itemNoticeTimerRef.current !== null) {
        window.clearTimeout(itemNoticeTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = performance.now()
      return
    }
    if (pausedAtRef.current === null) return
    const pausedFor = performance.now() - pausedAtRef.current
    invulnUntilRef.current += pausedFor
    doubleWireUntilRef.current += pausedFor
    powerWireUntilRef.current += pausedFor
    vulcanUntilRef.current += pausedFor
    clockUntilRef.current += pausedFor
    hourglassUntilRef.current += pausedFor
    speedBoostUntilRef.current += pausedFor
    invincibleUntilRef.current += pausedFor
    novaSurgeUntilRef.current += pausedFor
    fireproofUntilRef.current += pausedFor
    anchorUntilRef.current += pausedFor
    lastHitAtRef.current += pausedFor
    harpoonsRef.current = harpoonsRef.current.map((harpoon) => ({
      ...harpoon,
      expiresAt:
        harpoon.expiresAt === undefined
          ? undefined
          : harpoon.expiresAt + pausedFor,
    }))
    pausedAtRef.current = null
  }, [paused])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStarting) {
        e.preventDefault()
        inputRef.current.releaseAll()
        return
      }
      if (
        !demo &&
        !e.repeat &&
        (e.key === 'Escape' || e.key.toLowerCase() === 'p')
      ) {
        e.preventDefault()
        inputRef.current.releaseAll()
        setPaused((value) => !value)
        return
      }
      const key = e.key.toLowerCase()
      if (key === 'arrowleft' || key === 'a')
        inputRef.current.set('keyboard-left', 'left', true)
      if (key === 'arrowright' || key === 'd')
        inputRef.current.set('keyboard-right', 'right', true)
      if (key === ' ') {
        e.preventDefault()
        inputRef.current.set('keyboard-fire', 'fire', true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'arrowleft' || key === 'a')
        inputRef.current.release('keyboard-left')
      if (key === 'arrowright' || key === 'd')
        inputRef.current.release('keyboard-right')
      if (key === ' ') inputRef.current.release('keyboard-fire')
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [demo, isStarting])

  useEffect(() => {
    const pauseForLifecycle = () => {
      inputRef.current.releaseAll()
      if (!demo && !isStarting) setPaused(true)
    }
    const handleVisibility = () => {
      if (document.hidden) pauseForLifecycle()
    }
    window.addEventListener('blur', pauseForLifecycle)
    window.addEventListener('pagehide', pauseForLifecycle)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('blur', pauseForLifecycle)
      window.removeEventListener('pagehide', pauseForLifecycle)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [demo, isStarting])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const updateBackingStore = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      const width = Math.round(CANVAS_WIDTH * dpr)
      const height = Math.round(CANVAS_HEIGHT * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }
    updateBackingStore()
    window.addEventListener('resize', updateBackingStore)
    return () => window.removeEventListener('resize', updateBackingStore)
  }, [])

  useEffect(() => {
    if (!paused) startBgm(stageIndex)
    else stopBgm()
    return () => stopBgm()
  }, [stageIndex, paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let lastTime: number | null = null
    let fpsUpdatedAt = 0
    let accumulator = 0

    const nextId = () => {
      nextIdRef.current += 1
      return nextIdRef.current
    }

    const nextItemId = () => {
      nextItemIdRef.current += 1
      return nextItemIdRef.current
    }

    const loop = (time: number) => {
      if (lastTime === null) lastTime = time
      const frameDeltaSec = Math.min(
        Math.max((time - lastTime) / 1000, 0),
        MAX_FRAME_DELTA_SECONDS,
      )
      const dtSec = FIXED_DELTA_SECONDS
      const dtMs = dtSec * 1000
      lastTime = time

      if (paused || isStarting) {
        lastTime = null
        accumulator = 0
      }

      const fixedStep =
        paused || isStarting
          ? { updates: 0, accumulator: 0 }
          : advanceFixedStep(accumulator, frameDeltaSec)
      const updateCount = fixedStep.updates
      accumulator = fixedStep.accumulator

      for (let updateIndex = 0; updateIndex < updateCount; updateIndex += 1) {
        if (!paused && !endedRef.current) {
          const isClockActive = time < clockUntilRef.current
          const isHourglassActive =
            !isClockActive && time < hourglassUntilRef.current
          const isPowerWireActive = time < powerWireUntilRef.current
          const isVulcanActive = time < vulcanUntilRef.current
          const isSpeedBoostActive = time < speedBoostUntilRef.current
          const isInvincibleActive = time < invincibleUntilRef.current
          const playerSpeed =
            PLAYER_SPEED * (isSpeedBoostActive ? SPEED_BOOST_MULTIPLIER : 1)
          const maxHarpoons = isVulcanActive
            ? MAX_VULCAN_SHOTS
            : time < doubleWireUntilRef.current
              ? MAX_HARPOONS_DOUBLE_WIRE
              : MAX_HARPOONS_DEFAULT
          const isStabilizerActive = time < stabilizerUntilRef.current
          const isNovaSurgeActive = time < novaSurgeUntilRef.current
          const isFireproofActive = time < fireproofUntilRef.current
          const isAnchorActive = time < anchorUntilRef.current
          const windAx = isStabilizerActive
            ? 0
            : getCurrentWindAx(stageCurrent, time)
          const activeGravityWell = isStabilizerActive
            ? undefined
            : (gravityWell ?? undefined)
          const activeGravityScale = isAnchorActive ? 1 : gravityScale

          if (!demo) {
            timeRemainingRef.current = Math.max(
              0,
              timeRemainingRef.current - dtSec,
            )
            const displayedTime = Math.ceil(timeRemainingRef.current)
            if (displayedTime !== lastDisplayedTimeRef.current) {
              lastDisplayedTimeRef.current = displayedTime
              setTimeRemaining(displayedTime)
            }
            if (timeRemainingRef.current <= 0) {
              endedRef.current = true
              playGameOverSound()
              stopBgm()
              onGameOver(scoreRef.current)
              continue
            }
          }

          if (demo) {
            // Match the ball forward-simulation to whatever's actually
            // slowing/freezing balls in real gameplay right now, so a
            // Clock or Hourglass pickup doesn't leave the AI's own
            // predictions out of sync with reality.
            const ballTimeScale = isClockActive
              ? 0
              : isHourglassActive
                ? HOURGLASS_SLOW_FACTOR
                : 1

            // Forward-simulate every ball with the real physics to find each
            // one's next low point (closest approach to the player's row) —
            // used both to pick a shooting target (soonest arrival) and to
            // build a danger map for dodging (every ball is a hazard, not
            // just the one being shot at).
            const predictions = ballsRef.current.map((b) => ({
              ball: b,
              ...predictLandingSpot(
                b,
                1.5,
                1 / 60,
                terrain.platforms,
                windAx,
                activeGravityWell,
                ballTimeScale,
                activeGravityScale,
              ),
            }))
            const targetPrediction = predictions.reduce<
              (typeof predictions)[number] | null
            >((best, p) => (!best || p.time < best.time ? p : best), null)
            const target = targetPrediction?.ball ?? null

            // Items fall straight down (x never changes), so no leading is
            // needed for them — just head toward whichever is lowest/soonest.
            const itemTarget = itemsRef.current.reduce<Item | null>(
              (lowest, item) => (!lowest || item.y > lowest.y ? item : lowest),
              null,
            )
            const desiredX =
              itemTarget !== null
                ? itemTarget.x
                : (targetPrediction?.x ?? playerXRef.current)

            // The ball we're about to shoot isn't a hazard to route around —
            // it's the plan. Excluding it (while a harpoon slot is actually
            // free to take the shot) is what lets the AI walk right up to
            // and under an incoming ball to line up an early kill, instead
            // of treating its own target as forbidden ground and stalling
            // out at a distance short of ever actually firing. (A
            // time-margin cutoff was tried here — bail on engaging once the
            // target gets "too close" — but it backfires: as soon as it
            // flips, the movement search flees the very position the AI was
            // about to fire from, aborting shots that were one frame from
            // landing. Once harpoons are full and no shot is available, the
            // target goes back to being a real threat like anything else.)
            const canEngageTarget = harpoonsRef.current.length < maxHarpoons
            const fireZoneDangers: DangerZone[] = (fireZones ?? [])
              .filter((zone) => getFireZoneState(zone, time) !== 'dormant')
              .map((zone) => ({
                x: zone.x + zone.width / 2,
                time: 0,
                radius: zone.width / 2 + PLAYER_WIDTH / 2 + AI_DODGE_BUFFER,
              }))
            const dangerZones: DangerZone[] = [
              ...predictions
                .filter(
                  (p) =>
                    !(canEngageTarget && target && p.ball.id === target.id),
                )
                .map((p) => ({
                  x: p.x,
                  time: p.time,
                  radius:
                    LEVEL_RADIUS[p.ball.level] +
                    PLAYER_WIDTH / 2 +
                    AI_DODGE_BUFFER,
                })),
              ...fireZoneDangers,
            ]
            // While invincible, nothing is actually a threat — go straight
            // for the goal instead of routing around ghosts.
            const moveTargetX =
              itemTarget !== null || target !== null
                ? isInvincibleActive
                  ? desiredX
                  : chooseSafeX(
                      desiredX,
                      playerXRef.current,
                      dangerZones,
                      {
                        min: PLAYER_WIDTH / 2,
                        max: CANVAS_WIDTH - PLAYER_WIDTH / 2,
                      },
                      { playerSpeed },
                    )
                : playerXRef.current

            const left = moveTargetX < playerXRef.current - AI_DEADZONE
            const right = moveTargetX > playerXRef.current + AI_DEADZONE
            // Only fire once actually settled near the target — a
            // mid-dodge position that happens to pass through the fire
            // tolerance shouldn't trigger a shot.
            const fire =
              target !== null &&
              Math.abs(moveTargetX - playerXRef.current) < AI_DEADZONE &&
              Math.abs(target.x - playerXRef.current) < AI_FIRE_TOLERANCE &&
              harpoonsRef.current.length < maxHarpoons
            inputRef.current.set('ai-left', 'left', left)
            inputRef.current.set('ai-right', 'right', right)
            inputRef.current.set('ai-fire', 'fire', fire)
            const nextAiKeys = { left, right, fire }
            const prevAiKeys = aiKeysDisplayRef.current
            if (
              prevAiKeys.left !== left ||
              prevAiKeys.right !== right ||
              prevAiKeys.fire !== fire
            ) {
              aiKeysDisplayRef.current = nextAiKeys
              setAiKeys(nextAiKeys)
            }
          }

          const keys = inputRef.current.snapshot()
          const nextPlayerPosition = stepPlayerOnTerrain(
            playerXRef.current,
            playerYRef.current,
            keys,
            dtSec,
            playerSpeed,
            terrain,
          )
          playerXRef.current = nextPlayerPosition.x
          playerYRef.current = nextPlayerPosition.y

          if (dragTargetXRef.current !== null) {
            const diff = dragTargetXRef.current - playerXRef.current
            const maxStep = playerSpeed * dtSec
            const dragX =
              Math.abs(diff) <= maxStep
                ? dragTargetXRef.current
                : playerXRef.current + Math.sign(diff) * maxStep
            const draggedPosition = stepPlayerOnTerrain(
              playerXRef.current,
              playerYRef.current,
              {
                left: dragX < playerXRef.current,
                right: dragX > playerXRef.current,
              },
              Math.abs(dragX - playerXRef.current) / playerSpeed,
              playerSpeed,
              terrain,
            )
            playerXRef.current = draggedPosition.x
          }

          const wantsToFire =
            keys.fire ||
            inputRef.current.consumeFire() ||
            fireRequestedRef.current
          const fireCooldownReady =
            !isVulcanActive ||
            time - lastFireAtRef.current >= VULCAN_FIRE_INTERVAL_MS
          if (
            wantsToFire &&
            fireCooldownReady &&
            harpoonsRef.current.length < maxHarpoons
          ) {
            const newHarpoon: Harpoon = isPowerWireActive
              ? {
                  x: playerXRef.current,
                  y: getPowerHarpoonStopY(
                    playerXRef.current,
                    terrain.platforms,
                    playerYRef.current,
                  ),
                  baseY: playerYRef.current,
                  kind: 'powerWire',
                  expiresAt: time + POWER_WIRE_STAY_MS,
                }
              : {
                  x: playerXRef.current,
                  y: playerYRef.current,
                  baseY: playerYRef.current,
                  kind: isVulcanActive ? 'vulcan' : 'normal',
                }
            harpoonsRef.current = [...harpoonsRef.current, newHarpoon]
            lastFireAtRef.current = time
          }
          fireRequestedRef.current = false

          harpoonsRef.current = harpoonsRef.current
            .map((harpoon) => {
              if (harpoon.kind === 'powerWire') return harpoon
              const speed =
                harpoon.kind === 'vulcan' ? VULCAN_SPEED : HARPOON_SPEED
              return { ...harpoon, y: harpoon.y - speed * dtSec }
            })
            .filter((harpoon) => {
              if (harpoon.kind === 'powerWire') {
                return (harpoon.expiresAt ?? 0) > time
              }
              return (
                harpoon.y > 0 &&
                !harpoonHitsObstacle(harpoon.x, harpoon.y, terrain.platforms)
              )
            })

          if (!isClockActive) {
            const ballDt = isHourglassActive
              ? dtSec * HOURGLASS_SLOW_FACTOR
              : dtSec
            ballsRef.current = ballsRef.current.map((ball) => {
              const steppedBall = stepBall(
                ball,
                ballDt,
                terrain.platforms,
                windAx,
                activeGravityWell,
                activeGravityScale,
              )
              if (
                portalPairs.length === 0 ||
                time < (portalCooldownsRef.current.get(ball.id) ?? 0)
              ) {
                return steppedBall
              }

              const transition = findPortalTransition(steppedBall, portalPairs)
              if (!transition) return steppedBall

              portalCooldownsRef.current.set(ball.id, time + PORTAL_COOLDOWN_MS)
              spawnBurst(
                particlesRef.current,
                transition.from.x,
                transition.from.y,
                transition.from.color,
              )
              spawnBurst(
                particlesRef.current,
                transition.to.x,
                transition.to.y,
                transition.to.color,
              )
              popupsRef.current.push({
                x: transition.to.x,
                y: transition.to.y - 38,
                text: 'WARP!',
                life: 650,
                maxLife: 650,
                color: transition.to.color,
              })
              return teleportBall(steppedBall, transition.to)
            })
          }

          if (harpoonsRef.current.length > 0) {
            const remainingHarpoons: Harpoon[] = []
            for (const h of harpoonsRef.current) {
              const hitIndex = ballsRef.current.findIndex((b) =>
                harpoonHitsBall(
                  h.x,
                  h.y,
                  b,
                  h.kind === 'vulcan' ? h.y : (h.baseY ?? PLAYER_Y),
                ),
              )
              if (hitIndex === -1) {
                remainingHarpoons.push(h)
                continue
              }

              const hitBall = ballsRef.current[hitIndex]
              const children = splitBall(hitBall, nextId)

              if (time - lastHitAtRef.current <= COMBO_WINDOW_MS) {
                comboRef.current += 1
              } else {
                comboRef.current = 0
              }
              lastHitAtRef.current = time

              const gained = Math.round(
                SCORE_BY_LEVEL[hitBall.level] *
                  (1 + comboRef.current * 0.1) *
                  (isNovaSurgeActive ? NOVA_SURGE_MULTIPLIER : 1),
              )
              scoreRef.current = addToTotalScore(scoreRef.current, gained)
              setScore(scoreRef.current)

              spawnBurst(
                particlesRef.current,
                hitBall.x,
                hitBall.y,
                BALL_COLORS[hitBall.level],
              )
              playHitSound(hitBall.level)
              if (settings.vibration) navigator.vibrate?.(18)
              popupsRef.current.push({
                x: hitBall.x,
                y: hitBall.y,
                text: `+${gained}`,
                life: 700,
                maxLife: 700,
              })

              ballsRef.current = [
                ...ballsRef.current.slice(0, hitIndex),
                ...ballsRef.current.slice(hitIndex + 1),
                ...children,
              ]

              const droppedType = rollItemDrop(
                Math.random,
                stageItemDropChance,
                stageItemWeights,
              )
              if (droppedType) {
                itemsRef.current = [
                  ...itemsRef.current,
                  {
                    id: nextItemId(),
                    x: hitBall.x,
                    y: hitBall.y,
                    vy: 30,
                    type: droppedType,
                  },
                ]
              }
            }
            harpoonsRef.current = remainingHarpoons
          }

          if (
            !isClockActive &&
            !isInvincibleActive &&
            time >= invulnUntilRef.current
          ) {
            const hitByFireZone =
              !isFireproofActive &&
              (fireZones?.some((zone) => {
                if (getFireZoneState(zone, time) !== 'active') return false
                return (
                  playerXRef.current + PLAYER_WIDTH / 2 > zone.x &&
                  playerXRef.current - PLAYER_WIDTH / 2 < zone.x + zone.width
                )
              }) ??
                false)
            const hit =
              hitByFireZone ||
              ballsRef.current.some((b) =>
                ballHitsPlayer(b, playerXRef.current, playerYRef.current),
              )
            if (hit) {
              invulnUntilRef.current = time + INVULN_MS
              if (barrierCountRef.current > 0) {
                barrierCountRef.current -= 1
                spawnBurst(
                  particlesRef.current,
                  playerXRef.current,
                  playerYRef.current - 4,
                  '#facc15',
                )
                pickupEffectsRef.current.push({
                  type: 'barrier',
                  x: playerXRef.current,
                  y: playerYRef.current - 4,
                  life: 420,
                  maxLife: 420,
                })
                popupsRef.current.push({
                  x: playerXRef.current,
                  y: playerYRef.current - 38,
                  text: 'BLOCK!',
                  life: 700,
                  maxLife: 700,
                  color: '#facc15',
                })
              } else {
                hpRef.current -= 1
                setHp(hpRef.current)
                hitEffectUntilRef.current = time + HIT_EFFECT_MS
                playPlayerHitSound()
                if (settings.vibration) navigator.vibrate?.(90)
                if (hpRef.current <= 0) {
                  endedRef.current = true
                  playGameOverSound()
                  stopBgm()
                  onGameOver(scoreRef.current)
                }
              }
            }
          }

          itemsRef.current = itemsRef.current
            .map((item) => stepItem(item, dtSec))
            .filter((item) => item.y - ITEM_RADIUS < CANVAS_HEIGHT)

          const pickupIndex = itemsRef.current.findIndex((item) =>
            itemHitsPlayer(item, playerXRef.current, playerYRef.current),
          )
          if (pickupIndex !== -1) {
            const picked = itemsRef.current[pickupIndex]
            itemsRef.current = [
              ...itemsRef.current.slice(0, pickupIndex),
              ...itemsRef.current.slice(pickupIndex + 1),
            ]
            playItemSound()
            setItemNotice(picked.type)
            if (itemNoticeTimerRef.current !== null) {
              window.clearTimeout(itemNoticeTimerRef.current)
            }
            itemNoticeTimerRef.current = window.setTimeout(() => {
              setItemNotice(null)
              itemNoticeTimerRef.current = null
            }, 2200)
            popupsRef.current.push({
              x: picked.x,
              y: picked.y - 16,
              text: ITEM_ANNOUNCEMENTS[picked.type],
              life: 900,
              maxLife: 900,
              color: ITEM_COLORS[picked.type],
            })
            spawnPickupCelebration(
              particlesRef.current,
              pickupEffectsRef.current,
              playerXRef.current,
              playerYRef.current - 4,
              picked.type,
            )

            switch (picked.type) {
              case 'doubleWire':
                doubleWireUntilRef.current = time + DOUBLE_WIRE_DURATION_MS
                powerWireUntilRef.current = 0
                vulcanUntilRef.current = 0
                break
              case 'powerWire':
                powerWireUntilRef.current = time + POWER_WIRE_DURATION_MS
                doubleWireUntilRef.current = 0
                vulcanUntilRef.current = 0
                harpoonsRef.current = []
                break
              case 'vulcan':
                vulcanUntilRef.current = time + VULCAN_DURATION_MS
                doubleWireUntilRef.current = 0
                powerWireUntilRef.current = 0
                harpoonsRef.current = []
                break
              case 'clock':
                clockUntilRef.current = time + CLOCK_DURATION_MS
                break
              case 'hourglass':
                hourglassUntilRef.current = time + HOURGLASS_DURATION_MS
                break
              case 'barrier':
                barrierCountRef.current += 1
                break
              case 'oneUp':
                hpRef.current = Math.min(MAX_HP, hpRef.current + 1)
                setHp(hpRef.current)
                break
              case 'dynamite':
                for (const b of ballsRef.current) {
                  spawnBurst(
                    particlesRef.current,
                    b.x,
                    b.y,
                    BALL_COLORS[b.level],
                  )
                }
                ballsRef.current = explodeToSmallest(ballsRef.current, nextId)
                break
              case 'speedBoost':
                speedBoostUntilRef.current = time + SPEED_BOOST_DURATION_MS
                break
              case 'invincible':
                invincibleUntilRef.current = time + INVINCIBLE_DURATION_MS
                break
              case 'timePlus':
                timeRemainingRef.current += TIME_PLUS_SECONDS
                lastDisplayedTimeRef.current = Math.ceil(
                  timeRemainingRef.current,
                )
                setTimeRemaining(lastDisplayedTimeRef.current)
                break
              case 'scoreBonus':
                scoreRef.current = addToTotalScore(
                  scoreRef.current,
                  SCORE_BONUS_POINTS,
                )
                setScore(scoreRef.current)
                break
              case 'stabilizer':
                stabilizerUntilRef.current = time + STABILIZER_DURATION_MS
                break
              case 'novaSurge':
                novaSurgeUntilRef.current = time + NOVA_SURGE_DURATION_MS
                break
              case 'fireproof':
                fireproofUntilRef.current = time + FIREPROOF_DURATION_MS
                break
              case 'anchor':
                anchorUntilRef.current = time + ANCHOR_DURATION_MS
                break
            }
          }

          const doubleWireSec = Math.max(
            0,
            Math.ceil((doubleWireUntilRef.current - time) / 1000),
          )
          const clockSec = Math.max(
            0,
            Math.ceil((clockUntilRef.current - time) / 1000),
          )
          const hourglassSec = Math.max(
            0,
            Math.ceil((hourglassUntilRef.current - time) / 1000),
          )
          const powerWireSec = Math.max(
            0,
            Math.ceil((powerWireUntilRef.current - time) / 1000),
          )
          const vulcanSec = Math.max(
            0,
            Math.ceil((vulcanUntilRef.current - time) / 1000),
          )
          const speedBoostSec = Math.max(
            0,
            Math.ceil((speedBoostUntilRef.current - time) / 1000),
          )
          const invincibleSec = Math.max(
            0,
            Math.ceil((invincibleUntilRef.current - time) / 1000),
          )
          const stabilizerSec = Math.max(
            0,
            Math.ceil((stabilizerUntilRef.current - time) / 1000),
          )
          const novaSurgeSec = Math.max(
            0,
            Math.ceil((novaSurgeUntilRef.current - time) / 1000),
          )
          const fireproofSec = Math.max(
            0,
            Math.ceil((fireproofUntilRef.current - time) / 1000),
          )
          const anchorSec = Math.max(
            0,
            Math.ceil((anchorUntilRef.current - time) / 1000),
          )
          const barrierCount = barrierCountRef.current
          const prevBuffs = buffsDisplayRef.current
          if (
            prevBuffs.doubleWire !== doubleWireSec ||
            prevBuffs.powerWire !== powerWireSec ||
            prevBuffs.vulcan !== vulcanSec ||
            prevBuffs.clock !== clockSec ||
            prevBuffs.hourglass !== hourglassSec ||
            prevBuffs.speedBoost !== speedBoostSec ||
            prevBuffs.invincible !== invincibleSec ||
            prevBuffs.stabilizer !== stabilizerSec ||
            prevBuffs.novaSurge !== novaSurgeSec ||
            prevBuffs.fireproof !== fireproofSec ||
            prevBuffs.anchor !== anchorSec ||
            prevBuffs.barrier !== barrierCount
          ) {
            const nextBuffs: BuffDisplay = {
              doubleWire: doubleWireSec,
              powerWire: powerWireSec,
              vulcan: vulcanSec,
              clock: clockSec,
              hourglass: hourglassSec,
              speedBoost: speedBoostSec,
              invincible: invincibleSec,
              stabilizer: stabilizerSec,
              novaSurge: novaSurgeSec,
              fireproof: fireproofSec,
              anchor: anchorSec,
              barrier: barrierCount,
            }
            buffsDisplayRef.current = nextBuffs
            setBuffs(nextBuffs)
          }

          if (!endedRef.current && ballsRef.current.length === 0) {
            endedRef.current = true
            const timeBonus =
              Math.ceil(timeRemainingRef.current) * TIME_BONUS_PER_SECOND
            scoreRef.current = addToTotalScore(scoreRef.current, timeBonus)
            setScore(scoreRef.current)
            popupsRef.current.push({
              x: CANVAS_WIDTH / 2,
              y: CANVAS_HEIGHT / 2,
              text: `TIME BONUS +${timeBonus}`,
              life: 1200,
              maxLife: 1200,
              color: '#f59e0b',
            })
            playClearSound()
            if (settings.vibration) navigator.vibrate?.([40, 30, 100])
            onClear(scoreRef.current)
          }
        }

        particlesRef.current = particlesRef.current
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dtSec,
            y: p.y + p.vy * dtSec,
            life: p.life - dtMs,
          }))
          .filter((p) => p.life > 0)

        popupsRef.current = popupsRef.current
          .map((p) => ({ ...p, y: p.y - 30 * dtSec, life: p.life - dtMs }))
          .filter((p) => p.life > 0)

        pickupEffectsRef.current = pickupEffectsRef.current
          .map((effect) => ({ ...effect, life: effect.life - dtMs }))
          .filter((effect) => effect.life > 0)
      }

      const dpr = dprRef.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const hitEffectProgress = Math.max(
        0,
        Math.min(1, (hitEffectUntilRef.current - time) / HIT_EFFECT_MS),
      )
      ctx.save()
      if (hitEffectProgress > 0 && settings.screenShake) {
        const magnitude = 6 * hitEffectProgress
        ctx.translate(
          (Math.random() - 0.5) * 2 * magnitude,
          (Math.random() - 0.5) * 2 * magnitude,
        )
      }

      drawBackground(ctx, stageIndex)
      if (stageCurrent) {
        drawCurrentFlow(ctx, getCurrentWindAx(stageCurrent, time), time)
      }
      if (gravityWell) {
        const wells = Array.isArray(gravityWell) ? gravityWell : [gravityWell]
        for (const well of wells) drawGravityWell(ctx, well, time)
      }
      if (fireZones) drawFireZones(ctx, fireZones, time)
      for (const platform of terrain.platforms) drawObstacle(ctx, platform)
      for (const pair of portalPairs) {
        drawPortal(ctx, pair.entry, time)
        drawPortal(ctx, pair.exit, time)
      }

      for (const h of harpoonsRef.current) {
        drawHarpoon(ctx, h)
      }

      for (const b of ballsRef.current) {
        drawBall(ctx, b)
      }

      for (const item of itemsRef.current) {
        drawItem(ctx, item)
      }

      for (const p of particlesRef.current) {
        const alpha = p.life / p.maxLife
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      for (const effect of pickupEffectsRef.current) {
        drawPickupEffect(ctx, effect)
      }

      const hasInvincibleShield = time < invincibleUntilRef.current
      const hasSpeedTrails = time < speedBoostUntilRef.current
      const weaponAura =
        time < vulcanUntilRef.current
          ? 'vulcan'
          : time < powerWireUntilRef.current
            ? 'powerWire'
            : time < doubleWireUntilRef.current
              ? 'doubleWire'
              : null
      const isInvuln = time < invulnUntilRef.current || hasInvincibleShield
      const playerY = playerYRef.current
      if (hasSpeedTrails) {
        drawSpeedTrails(ctx, playerXRef.current, playerY, time)
      }
      if (barrierCountRef.current > 0) {
        drawBarrierShell(
          ctx,
          playerXRef.current,
          playerY,
          barrierCountRef.current,
          time,
        )
      }
      if (weaponAura) {
        drawWeaponAura(ctx, playerXRef.current, playerY, weaponAura, time)
      }
      drawPlayerShip(
        ctx,
        playerXRef.current,
        playerY,
        getPlayerTheme(stageIndex),
        isInvuln,
        time,
      )

      if (hasInvincibleShield) {
        drawInvincibleShield(ctx, playerXRef.current, playerY, time)
      }

      ctx.font = "12px 'Galmuri11', monospace"
      ctx.textAlign = 'center'
      for (const p of popupsRef.current) {
        ctx.globalAlpha = p.life / p.maxLife
        ctx.fillStyle = p.color ?? '#b45309'
        ctx.fillText(p.text, p.x, p.y)
        ctx.globalAlpha = 1
      }

      ctx.restore()

      if (hitEffectProgress > 0) {
        ctx.save()
        ctx.globalAlpha = 0.35 * hitEffectProgress
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.restore()
      }

      drawBrickFrame(ctx)

      if (settings.showFps && time - fpsUpdatedAt > 500) {
        setFps(Math.round(frameDeltaSec > 0 ? 1 / frameDeltaSec : 60))
        fpsUpdatedAt = time
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    stageIndex,
    stageItemDropChance,
    stageItemWeights,
    terrain,
    portalPairs,
    stageCurrent,
    gravityWell,
    fireZones,
    gravityScale,
    onClear,
    onGameOver,
    demo,
    paused,
    isStarting,
    settings.showFps,
    settings.vibration,
    settings.screenShake,
  ])

  const handleTouchChange = (
    source: string,
    action: InputAction,
    pressed: boolean,
  ) => {
    inputRef.current.set(source, action, pressed)
    if (!pressed) inputRef.current.release(source)
  }

  return (
    <div className="gameplay">
      <div className="gameplay-hud">
        <span className="hud-stage">Stage {stageIndex + 1}</span>
        {portalPairs.length > 0 && (
          <span className="hud-hazard">Portals ×{portalPairs.length}</span>
        )}
        {stageCurrent && <span className="hud-hazard">Current</span>}
        {gravityWell && (
          <span className="hud-hazard">
            {isVortexStage
              ? 'Vortex'
              : isNebulaStage
                ? 'Nebula Field'
                : 'Gravity Well'}
          </span>
        )}
        {fireZones && <span className="hud-hazard">Fire Zones</span>}
        {gravityScale < 1 && <span className="hud-hazard">Low Gravity</span>}
        <div
          className="hp-bar hp-bar-pulse"
          key={hpPulseKey}
          aria-label={`HP ${hp} of ${MAX_HP}`}
        >
          {Array.from({ length: MAX_HP }, (_, i) => (
            <span
              key={i}
              className={`hp-segment ${i < hp ? 'hp-filled' : ''}`}
            />
          ))}
          <span className="hp-text">
            {hp}/{MAX_HP}
          </span>
        </div>
        <span
          className={`hud-time ${timeRemaining <= 10 ? 'hud-time-danger' : ''}`}
          aria-label={`${timeRemaining} seconds remaining`}
        >
          Time {timeRemaining}
        </span>
        <span className="hud-score">Total Score {score}</span>
        <span className="hud-combo">Combo ×{comboRef.current}</span>
        {settings.showFps && <span className="hud-fps">{fps} FPS</span>}
        {demo && <span className="demo-badge">AI</span>}
        {!demo && !isStarting && (
          <button
            type="button"
            className="hud-button"
            aria-label="Pause game"
            onClick={() => {
              inputRef.current.releaseAll()
              setPaused(true)
            }}
          >
            Pause
          </button>
        )}
      </div>
      {!itemNotice &&
        (TIMED_BUFF_KEYS.some((key) => buffs[key] > 0) || buffs.barrier > 0) &&
        createPortal(
          <div className="hud-buffs-overlay" aria-label="Active item effects">
            {TIMED_BUFF_KEYS.filter((key) => buffs[key] > 0).map((key) => (
              <span
                className={
                  buffs[key] <= BUFF_LOW_TIME_SECONDS
                    ? 'buff-timer buff-timer-low'
                    : 'buff-timer'
                }
                style={{ '--buff-color': ITEM_COLORS[key] } as CSSProperties}
                aria-label={`${BUFF_LABELS[key]} ${buffs[key]} seconds remaining`}
                key={key}
              >
                <span className="buff-timer-icon" aria-hidden="true">
                  {ITEM_LABELS[key]}
                </span>
                <span className="buff-timer-name">{BUFF_LABELS[key]}</span>
                <strong>{buffs[key]}s</strong>
              </span>
            ))}
            {buffs.barrier > 0 && (
              <span
                className="buff-timer"
                style={{ '--buff-color': ITEM_COLORS.barrier } as CSSProperties}
                aria-label={`Barrier ${buffs.barrier} remaining`}
              >
                <span className="buff-timer-icon" aria-hidden="true">
                  {ITEM_LABELS.barrier}
                </span>
                <span className="buff-timer-name">Barrier</span>
                <strong>×{buffs.barrier}</strong>
              </span>
            )}
          </div>,
          document.body,
        )}
      {itemNotice &&
        createPortal(
          <div
            className="item-notice"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              className="item-notice-icon"
              style={{ backgroundColor: ITEM_COLORS[itemNotice] }}
              aria-hidden="true"
            >
              {ITEM_LABELS[itemNotice]}
            </span>
            <span className="item-notice-copy">
              <strong>{ITEM_TITLES[itemNotice]} 획득!</strong>
              <span>{ITEM_DESCRIPTIONS[itemNotice]}</span>
            </span>
          </div>,
          document.body,
        )}
      {demo && (
        <div className="ai-key-row">
          <span className={`ai-key ${aiKeys.left ? 'ai-key-active' : ''}`}>
            ←
          </span>
          <span className={`ai-key ${aiKeys.right ? 'ai-key-active' : ''}`}>
            →
          </span>
          <span
            className={`ai-key ai-key-fire ${aiKeys.fire ? 'ai-key-active' : ''}`}
          >
            SPACE
          </span>
        </div>
      )}
      <div className="gameplay-body">
        <div className="canvas-column">
          <canvas
            ref={canvasRef}
            aria-label="Orbit game field. Move left and right and fire harpoons to pop every ball."
            style={{ border: '1px solid #2e303a', touchAction: 'none' }}
            onPointerDown={(e) => {
              if (demo || paused || isStarting) return
              e.currentTarget.setPointerCapture(e.pointerId)
              dragRef.current = {
                startClientX: e.clientX,
                startPlayerX: playerXRef.current,
                moved: false,
              }
              dragTargetXRef.current = playerXRef.current
            }}
            onPointerMove={(e) => {
              if (demo) return
              const drag = dragRef.current
              const canvas = canvasRef.current
              if (!drag || !canvas) return
              const rect = canvas.getBoundingClientRect()
              const scale = CANVAS_WIDTH / rect.width
              const deltaX = (e.clientX - drag.startClientX) * scale
              if (Math.abs(deltaX) > 4) drag.moved = true
              dragTargetXRef.current = Math.min(
                Math.max(drag.startPlayerX + deltaX, PLAYER_WIDTH / 2),
                CANVAS_WIDTH - PLAYER_WIDTH / 2,
              )
            }}
            onPointerUp={(e) => {
              if (dragRef.current && !dragRef.current.moved) {
                inputRef.current.queueFire()
              }
              dragRef.current = null
              dragTargetXRef.current = null
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId)
              }
            }}
            onPointerCancel={() => {
              dragRef.current = null
              dragTargetXRef.current = null
            }}
            onLostPointerCapture={() => {
              dragRef.current = null
              dragTargetXRef.current = null
            }}
          />
          {isStarting && (
            <div
              className="stage-start-countdown"
              role="status"
              aria-live="polite"
              aria-label={`Stage ${stageIndex + 1} starts in ${startCountdown}`}
            >
              <div className="stage-start-countdown-panel">
                <span>Stage {stageIndex + 1}</span>
                <strong>{startCountdown}</strong>
                <small>GET READY</small>
              </div>
            </div>
          )}
          {!demo && (
            <TouchControls
              disabled={paused || isStarting}
              size={settings.touchButtonSize}
              opacity={settings.touchButtonOpacity}
              onChange={handleTouchChange}
            />
          )}
        </div>
        <aside className="hint-panel">
          <div>
            <h3>Progress</h3>
            <ol className="stage-roster">
              {Array.from(
                { length: STAGE_COUNT },
                (_, i) => STAGE_NAMES[i % STAGE_NAMES.length],
              ).map((name, i) => (
                <li
                  key={i}
                  className={
                    i === stageIndex
                      ? 'stage-current'
                      : i < stageIndex
                        ? 'stage-cleared'
                        : ''
                  }
                >
                  {i + 1}. {name}
                  {i < stageIndex ? ' ✓' : ''}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Buffs</h3>
            <ul className="hint-list buff-list">
              {TIMED_BUFF_KEYS.filter((key) => buffs[key] > 0).map((key) => (
                <li key={key}>
                  {BUFF_LABELS[key]} {buffs[key]}s
                </li>
              ))}
              {buffs.barrier > 0 && <li>Barrier x{buffs.barrier}</li>}
              {buffs.doubleWire === 0 &&
                buffs.powerWire === 0 &&
                buffs.vulcan === 0 &&
                buffs.clock === 0 &&
                buffs.hourglass === 0 &&
                buffs.speedBoost === 0 &&
                buffs.invincible === 0 &&
                buffs.stabilizer === 0 &&
                buffs.novaSurge === 0 &&
                buffs.fireproof === 0 &&
                buffs.anchor === 0 &&
                buffs.barrier === 0 && <li>None</li>}
            </ul>
          </div>
          <div>
            <h3>Help</h3>
            <ul className="hint-list">
              {HINTS.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      {paused && !demo && (
        <div
          className="pause-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-title"
        >
          <div className="pause-panel">
            <h2 id="pause-title">Paused</h2>
            <button
              type="button"
              className="screen-button"
              autoFocus
              onClick={() => setPaused(false)}
            >
              Resume
            </button>
            <button
              type="button"
              className="screen-button screen-button-secondary"
              onClick={() => {
                resetStageState(true)
                setPaused(false)
              }}
            >
              Restart Stage
            </button>
            <button
              type="button"
              className="screen-button screen-button-secondary"
              onClick={onQuit}
            >
              Quit to Main
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePlay
