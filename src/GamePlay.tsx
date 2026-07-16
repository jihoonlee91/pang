import {
  useCallback,
  useEffect,
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
  LEVEL_RADIUS,
  SCORE_BY_LEVEL,
  COMBO_WINDOW_MS,
  STAGE_COUNT,
  STAGE_TIME_SECONDS,
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
} from './game/constants'
import type { Obstacle } from './game/constants'
import {
  getStageTerrain,
  stepPlayerOnTerrain,
  type Ladder,
} from './game/terrain'
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

const BALL_COLORS = ['#fb7185', '#facc15', '#38bdf8']

const HINTS = [
  '← → or A / D: move',
  '↑ ↓ or W / S: climb when aligned with a ladder',
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
}

const BUFF_LABELS: Record<
  | 'doubleWire'
  | 'powerWire'
  | 'vulcan'
  | 'clock'
  | 'hourglass'
  | 'speedBoost'
  | 'invincible',
  string
> = {
  doubleWire: 'Double Wire',
  powerWire: 'Power Harpoon',
  vulcan: 'Vulcan',
  clock: 'Clock (Stop)',
  hourglass: 'Hourglass (Slow)',
  speedBoost: 'Speed Boost',
  invincible: 'Invincible',
}

const TIMED_BUFF_KEYS = [
  'doubleWire',
  'powerWire',
  'vulcan',
  'clock',
  'hourglass',
  'speedBoost',
  'invincible',
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

function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  const { x, y, width, height } = obstacle
  ctx.save()
  ctx.shadowColor = '#00000066'
  ctx.shadowBlur = 6
  ctx.shadowOffsetY = 3

  const bodyGradient = ctx.createLinearGradient(0, y, 0, y + height)
  bodyGradient.addColorStop(0, '#d4d4d8')
  bodyGradient.addColorStop(1, '#71717a')
  ctx.fillStyle = bodyGradient
  ctx.fillRect(x, y, width, height)
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.clip()
  ctx.fillStyle = '#facc15'
  const stripeWidth = 14
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

  ctx.strokeStyle = '#27272a'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)
}

function drawLadder(ctx: CanvasRenderingContext2D, ladder: Ladder) {
  const left = ladder.x - ladder.width / 2
  const right = ladder.x + ladder.width / 2
  ctx.save()
  ctx.strokeStyle = '#5b3a1f'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(left, ladder.topY)
  ctx.lineTo(left, ladder.bottomY)
  ctx.moveTo(right, ladder.topY)
  ctx.lineTo(right, ladder.bottomY)
  ctx.stroke()
  ctx.strokeStyle = '#d6a45f'
  ctx.lineWidth = 3
  for (let y = ladder.topY + 10; y < ladder.bottomY; y += 22) {
    ctx.beginPath()
    ctx.moveTo(left, y)
    ctx.lineTo(right, y)
    ctx.stroke()
  }
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

  const gradient = ctx.createRadialGradient(
    ball.x - r * 0.35,
    ball.y - r * 0.35,
    r * 0.1,
    ball.x,
    ball.y,
    r,
  )
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.25, color)
  gradient.addColorStop(1, '#00000055')

  ctx.beginPath()
  ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.lineWidth = 1
  ctx.strokeStyle = '#00000033'
  ctx.stroke()
}

function drawItem(ctx: CanvasRenderingContext2D, item: Item) {
  const color = ITEM_COLORS[item.type]

  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(item.x, item.y, ITEM_RADIUS, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ffffffcc'
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = '#0f172a'
  ctx.font = "bold 13px 'Galmuri11', monospace"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(ITEM_LABELS[item.type], item.x, item.y + 1)
  ctx.textBaseline = 'alphabetic'
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

type Props = {
  stageIndex: number
  initialScore?: number
  onClear: (score: number) => void
  onGameOver: (score: number) => void
  demo?: boolean
  settings: GameSettings
  onQuit: () => void
}

const AI_DEADZONE = 10
const AI_FIRE_TOLERANCE = 18

type BuffDisplay = {
  doubleWire: number
  powerWire: number
  vulcan: number
  clock: number
  hourglass: number
  barrier: number
  speedBoost: number
  invincible: number
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
}

function GamePlay({
  stageIndex,
  initialScore = 0,
  onClear,
  onGameOver,
  demo = false,
  settings,
  onQuit,
}: Props) {
  const terrain = getStageTerrain(stageIndex)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const playerXRef = useRef(CANVAS_WIDTH / 2)
  const playerYRef = useRef(PLAYER_Y)
  const ballsRef = useRef<Ball[]>(createStage(stageIndex))
  const harpoonsRef = useRef<Harpoon[]>([])
  const itemsRef = useRef<Item[]>([])
  const hpRef = useRef(MAX_HP)
  const invulnUntilRef = useRef(0)
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
  const timeRemainingRef = useRef(STAGE_TIME_SECONDS)
  const lastDisplayedTimeRef = useRef(STAGE_TIME_SECONDS)
  const lastFireAtRef = useRef(0)
  const itemNoticeTimerRef = useRef<number | null>(null)
  const endedRef = useRef(false)
  const particlesRef = useRef<Particle[]>([])
  const popupsRef = useRef<Popup[]>([])

  const doubleWireUntilRef = useRef(0)
  const powerWireUntilRef = useRef(0)
  const vulcanUntilRef = useRef(0)
  const clockUntilRef = useRef(0)
  const hourglassUntilRef = useRef(0)
  const speedBoostUntilRef = useRef(0)
  const invincibleUntilRef = useRef(0)
  const barrierCountRef = useRef(0)
  const buffsDisplayRef = useRef<BuffDisplay>(NO_BUFFS)
  const aiKeysDisplayRef = useRef({ left: false, right: false, fire: false })

  const [hp, setHp] = useState(MAX_HP)
  const [score, setScore] = useState(initialScore)
  const [timeRemaining, setTimeRemaining] = useState(STAGE_TIME_SECONDS)
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
      invulnUntilRef.current = 0
      comboRef.current = 0
      lastHitAtRef.current = 0
      endedRef.current = false
      particlesRef.current = []
      popupsRef.current = []
      doubleWireUntilRef.current = 0
      powerWireUntilRef.current = 0
      vulcanUntilRef.current = 0
      clockUntilRef.current = 0
      hourglassUntilRef.current = 0
      speedBoostUntilRef.current = 0
      invincibleUntilRef.current = 0
      barrierCountRef.current = 0
      playerXRef.current = CANVAS_WIDTH / 2
      playerYRef.current = PLAYER_Y
      inputRef.current.releaseAll()
      dragRef.current = null
      dragTargetXRef.current = null
      fireRequestedRef.current = false
      timeRemainingRef.current = STAGE_TIME_SECONDS
      lastDisplayedTimeRef.current = STAGE_TIME_SECONDS
      lastFireAtRef.current = 0
      if (itemNoticeTimerRef.current !== null) {
        window.clearTimeout(itemNoticeTimerRef.current)
        itemNoticeTimerRef.current = null
      }
      buffsDisplayRef.current = NO_BUFFS
      setHp(MAX_HP)
      setBuffs(NO_BUFFS)
      setTimeRemaining(STAGE_TIME_SECONDS)
      setItemNotice(null)
      if (restoreScore) {
        scoreRef.current = stageStartScoreRef.current
        setScore(stageStartScoreRef.current)
      } else {
        stageStartScoreRef.current = scoreRef.current
      }
    },
    [stageIndex],
  )

  useEffect(() => {
    resetStageState(false)
    setPaused(false)
  }, [resetStageState])

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
      if (key === 'arrowup' || key === 'w') {
        e.preventDefault()
        inputRef.current.set('keyboard-up', 'up', true)
      }
      if (key === 'arrowdown' || key === 's') {
        e.preventDefault()
        inputRef.current.set('keyboard-down', 'down', true)
      }
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
      if (key === 'arrowup' || key === 'w')
        inputRef.current.release('keyboard-up')
      if (key === 'arrowdown' || key === 's')
        inputRef.current.release('keyboard-down')
      if (key === ' ') inputRef.current.release('keyboard-fire')
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [demo])

  useEffect(() => {
    const pauseForLifecycle = () => {
      inputRef.current.releaseAll()
      if (!demo) setPaused(true)
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
  }, [demo])

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

      if (paused) {
        lastTime = null
        accumulator = 0
      }

      const fixedStep = paused
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
            // Forward-simulate every ball with the real physics to find whose
            // next low point (closest approach to the player's row) arrives
            // soonest, and aim for exactly where that will be — not just
            // where the ball happens to be right now.
            const prediction = ballsRef.current.reduce<{
              ball: Ball
              x: number
              time: number
            } | null>((best, b) => {
              const { x, time } = predictLandingSpot(
                b,
                1.5,
                1 / 60,
                terrain.platforms,
              )
              return !best || time < best.time ? { ball: b, x, time } : best
            }, null)
            const target = prediction?.ball ?? null
            const predictedX = prediction?.x ?? playerXRef.current

            // Items fall straight down (x never changes), so no leading is
            // needed for them — just head toward whichever is lowest/soonest.
            const itemTarget = itemsRef.current.reduce<Item | null>(
              (lowest, item) => (!lowest || item.y > lowest.y ? item : lowest),
              null,
            )
            // Prioritize grabbing a falling item (safe, since demo mode is
            // invulnerable anyway) over chasing the next ball to pop.
            const moveTargetX = itemTarget !== null ? itemTarget.x : predictedX
            const left =
              (itemTarget !== null || target !== null) &&
              moveTargetX < playerXRef.current - AI_DEADZONE
            const right =
              (itemTarget !== null || target !== null) &&
              moveTargetX > playerXRef.current + AI_DEADZONE
            const fire =
              target !== null &&
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
                up: false,
                down: false,
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
            ballsRef.current = ballsRef.current.map((b) =>
              stepBall(b, ballDt, terrain.platforms),
            )
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
                SCORE_BY_LEVEL[hitBall.level] * (1 + comboRef.current * 0.1),
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

              const droppedType = rollItemDrop()
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
            !demo &&
            !isClockActive &&
            !isInvincibleActive &&
            time >= invulnUntilRef.current
          ) {
            const hit = ballsRef.current.some((b) =>
              ballHitsPlayer(b, playerXRef.current, playerYRef.current),
            )
            if (hit) {
              invulnUntilRef.current = time + INVULN_MS
              if (barrierCountRef.current > 0) {
                barrierCountRef.current -= 1
              } else {
                hpRef.current -= 1
                setHp(hpRef.current)
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
      }

      const dpr = dprRef.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      drawBackground(ctx, stageIndex)
      for (const ladder of terrain.ladders) drawLadder(ctx, ladder)
      for (const platform of terrain.platforms) drawObstacle(ctx, platform)

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

      const isInvuln =
        time < invulnUntilRef.current || time < invincibleUntilRef.current
      const playerY = playerYRef.current
      const playerGradient = ctx.createLinearGradient(
        0,
        playerY - PLAYER_HEIGHT / 2,
        0,
        playerY + PLAYER_HEIGHT / 2,
      )
      playerGradient.addColorStop(0, isInvuln ? '#fef08a' : '#f87171')
      playerGradient.addColorStop(1, isInvuln ? '#fbbf24' : '#b91c1c')

      ctx.save()
      if (isInvuln) {
        ctx.shadowColor = '#fbbf24'
        ctx.shadowBlur = 12
      }

      const px = playerXRef.current - PLAYER_WIDTH / 2
      const py = playerY - PLAYER_HEIGHT / 2

      ctx.fillStyle = '#374151'
      ctx.fillRect(playerXRef.current - 4, py - 16, 8, 16)

      ctx.fillStyle = playerGradient
      const radius = 4
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

      ctx.font = "12px 'Galmuri11', monospace"
      ctx.textAlign = 'center'
      for (const p of popupsRef.current) {
        ctx.globalAlpha = p.life / p.maxLife
        ctx.fillStyle = p.color ?? '#b45309'
        ctx.fillText(p.text, p.x, p.y)
        ctx.globalAlpha = 1
      }

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
    terrain,
    onClear,
    onGameOver,
    demo,
    paused,
    settings.showFps,
    settings.vibration,
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
        <div className="hp-bar" aria-label={`HP ${hp} of ${MAX_HP}`}>
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
        {!demo && (
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
                className="buff-timer"
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
            aria-label="PANG game field. Move left and right, climb ladders, and fire harpoons to pop every ball."
            style={{ border: '1px solid #2e303a', touchAction: 'none' }}
            onPointerDown={(e) => {
              if (demo || paused) return
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
          {!demo && (
            <TouchControls
              disabled={paused}
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
