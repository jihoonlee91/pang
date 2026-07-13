import { useEffect, useRef, useState } from 'react'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_Y,
  PLAYER_SPEED,
  HARPOON_SPEED,
  MAX_HP,
  INVULN_MS,
  LEVEL_RADIUS,
  SCORE_BY_LEVEL,
  COMBO_WINDOW_MS,
  STAGE_COUNT,
  OBSTACLE_X,
  OBSTACLE_Y,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  ITEM_RADIUS,
  MAX_HARPOONS_DEFAULT,
  MAX_HARPOONS_DOUBLE_WIRE,
  DOUBLE_WIRE_DURATION_MS,
  CLOCK_DURATION_MS,
  HOURGLASS_DURATION_MS,
  HOURGLASS_SLOW_FACTOR,
} from './game/constants'
import {
  createStage,
  stepBall,
  splitBall,
  harpoonHitsBall,
  harpoonHitsObstacle,
  ballHitsPlayer,
  rollItemDrop,
  stepItem,
  itemHitsPlayer,
  explodeToSmallest,
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

const BALL_COLORS = ['#fb7185', '#facc15', '#38bdf8']
const GROUND_Y = CANVAS_HEIGHT - 90
const STAGE_NAMES = ['Mt. Fuji (Japan)', 'Guilin (China)', 'Emerald Temple (Thailand)', 'Angkor Wat (Cambodia)', 'Ayers Rock (Australia)']

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
  clock: 'C',
  hourglass: 'H',
  barrier: 'B',
  oneUp: '+',
  dynamite: '!',
}

const ITEM_COLORS: Record<ItemType, string> = {
  doubleWire: '#38bdf8',
  clock: '#a5b4fc',
  hourglass: '#fbbf24',
  barrier: '#34d399',
  oneUp: '#f472b6',
  dynamite: '#f87171',
}

const BUFF_LABELS: Record<'doubleWire' | 'clock' | 'hourglass', string> = {
  doubleWire: 'Double Wire',
  clock: 'Clock (Stop)',
  hourglass: 'Hourglass (Slow)',
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
}

function drawSky(ctx: CanvasRenderingContext2D, top: string, bottom: string) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y)
  sky.addColorStop(0, top)
  sky.addColorStop(1, bottom)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
}

function drawGround(ctx: CanvasRenderingContext2D, top: string, bottom: string) {
  const ground = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT)
  ground.addColorStop(0, top)
  ground.addColorStop(1, bottom)
  ctx.fillStyle = ground
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y)
}

function drawJapanBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#7dc8f0', '#cdeafd')

  ctx.fillStyle = '#ffffffaa'
  ctx.beginPath()
  ctx.ellipse(120, 90, 34, 16, 0, 0, Math.PI * 2)
  ctx.ellipse(160, 80, 26, 14, 0, 0, Math.PI * 2)
  ctx.ellipse(740, 130, 30, 15, 0, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const topY = baseY - 220
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#7a86a8'
  ctx.beginPath()
  ctx.moveTo(cx - 220, baseY)
  ctx.lineTo(cx, topY)
  ctx.lineTo(cx + 220, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(cx, topY)
  ctx.lineTo(cx + 38, topY + 60)
  ctx.lineTo(cx + 14, topY + 50)
  ctx.lineTo(cx - 2, topY + 70)
  ctx.lineTo(cx - 22, topY + 46)
  ctx.lineTo(cx - 40, topY + 58)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#7cc86e', '#4f9b45')
}

function drawKarstPeak(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number,
  height: number,
  color: string,
) {
  const top = baseY - height
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx - width / 2, baseY)
  ctx.bezierCurveTo(
    cx - width / 2,
    top + height * 0.5,
    cx - width * 0.22,
    top + height * 0.1,
    cx,
    top,
  )
  ctx.bezierCurveTo(
    cx + width * 0.22,
    top + height * 0.1,
    cx + width / 2,
    top + height * 0.5,
    cx + width / 2,
    baseY,
  )
  ctx.closePath()
  ctx.fill()
}

function drawGuilinBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#bfe3e0', '#eaf6f2')

  ctx.fillStyle = '#ffffff88'
  ctx.beginPath()
  ctx.ellipse(700, 110, 60, 14, 0, 0, Math.PI * 2)
  ctx.ellipse(150, 160, 70, 16, 0, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const farPeaks = [
    { cx: 120, w: 160, h: 150 },
    { cx: 320, w: 200, h: 190 },
    { cx: 560, w: 170, h: 160 },
    { cx: 800, w: 210, h: 200 },
  ]
  for (const p of farPeaks) {
    drawKarstPeak(ctx, p.cx, baseY - 20, p.w, p.h, '#9db8ae')
  }

  const nearPeaks = [
    { cx: 220, w: 190, h: 230 },
    { cx: 480, w: 230, h: 260 },
    { cx: 720, w: 200, h: 240 },
  ]
  for (const p of nearPeaks) {
    drawKarstPeak(ctx, p.cx, baseY, p.w, p.h, '#5f8a76')
  }

  const river = ctx.createLinearGradient(0, baseY - 10, 0, baseY + 20)
  river.addColorStop(0, '#cdeee6')
  river.addColorStop(1, '#a9d8cd')
  ctx.fillStyle = river
  ctx.fillRect(0, baseY - 10, CANVAS_WIDTH, 30)

  drawGround(ctx, '#8fbf9a', '#5c9468')
}

function drawEmeraldTempleBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#ffd97a', '#ffe9c2')

  ctx.fillStyle = '#fff3d1'
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH - 130, 90, 44, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  const tiers = [
    { w: 340, h: 26, y: 0 },
    { w: 280, h: 24, y: -60 },
    { w: 220, h: 22, y: -114 },
    { w: 150, h: 20, y: -160 },
  ]
  for (const t of tiers) {
    const y = baseY - 90 + t.y
    ctx.fillStyle = '#c23b3b'
    ctx.beginPath()
    ctx.moveTo(cx - t.w / 2, y + t.h)
    ctx.lineTo(cx, y - t.h * 1.4)
    ctx.lineTo(cx + t.w / 2, y + t.h)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#f2b73a'
    ctx.fillRect(cx - t.w / 2, y + t.h - 6, t.w, 6)
  }

  ctx.fillStyle = '#f2b73a'
  ctx.beginPath()
  ctx.moveTo(cx - 8, baseY - 250)
  ctx.lineTo(cx, baseY - 300)
  ctx.lineTo(cx + 8, baseY - 250)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#e8c98a', '#c9a35f')
}

function drawAngkorWatBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f6b98a', '#ffe3c4')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#8a7156'
  ctx.fillRect(cx - 260, baseY - 70, 520, 70)

  function tower(x: number, height: number, width: number) {
    const y = baseY - 70 - height
    ctx.beginPath()
    ctx.moveTo(x - width / 2, baseY - 70)
    ctx.lineTo(x - width / 2, y + height * 0.35)
    ctx.lineTo(x, y)
    ctx.lineTo(x + width / 2, y + height * 0.35)
    ctx.lineTo(x + width / 2, baseY - 70)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = '#6b5842'
  tower(cx - 200, 90, 55)
  tower(cx + 200, 90, 55)
  ctx.fillStyle = '#7a6449'
  tower(cx - 100, 140, 65)
  tower(cx + 100, 140, 65)
  ctx.fillStyle = '#8a7150'
  tower(cx, 210, 80)

  drawGround(ctx, '#d9be93', '#b3946a')
}

function drawAyersRockBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#ff9d6c', '#ffd9a8')

  ctx.fillStyle = '#ffffffcc'
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH / 2, 100, 46, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const rockGradient = ctx.createLinearGradient(0, baseY - 160, 0, baseY)
  rockGradient.addColorStop(0, '#b5522f')
  rockGradient.addColorStop(1, '#7a3420')
  ctx.fillStyle = rockGradient
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH / 2 - 260, baseY)
  ctx.bezierCurveTo(
    CANVAS_WIDTH / 2 - 200,
    baseY - 150,
    CANVAS_WIDTH / 2 - 80,
    baseY - 170,
    CANVAS_WIDTH / 2,
    baseY - 160,
  )
  ctx.bezierCurveTo(
    CANVAS_WIDTH / 2 + 90,
    baseY - 150,
    CANVAS_WIDTH / 2 + 200,
    baseY - 110,
    CANVAS_WIDTH / 2 + 260,
    baseY,
  )
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#5c2717aa'
  ctx.lineWidth = 3
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2 - 150 + i * 90, baseY - 20 - i * 4)
    ctx.lineTo(CANVAS_WIDTH / 2 - 90 + i * 90, baseY - 90 - i * 6)
    ctx.stroke()
  }

  drawGround(ctx, '#e0925c', '#b56a3c')
}

const BACKGROUNDS = [
  drawJapanBackground,
  drawGuilinBackground,
  drawEmeraldTempleBackground,
  drawAngkorWatBackground,
  drawAyersRockBackground,
]

function drawBackground(ctx: CanvasRenderingContext2D, stageIndex: number) {
  const draw = BACKGROUNDS[stageIndex % BACKGROUNDS.length]
  draw(ctx)

  ctx.strokeStyle = '#00000022'
  ctx.beginPath()
  ctx.moveTo(0, CANVAS_HEIGHT - 4)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 4)
  ctx.stroke()
}

function drawObstacle(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.shadowColor = '#00000066'
  ctx.shadowBlur = 6
  ctx.shadowOffsetY = 3

  const bodyGradient = ctx.createLinearGradient(
    0,
    OBSTACLE_Y,
    0,
    OBSTACLE_Y + OBSTACLE_HEIGHT,
  )
  bodyGradient.addColorStop(0, '#d4d4d8')
  bodyGradient.addColorStop(1, '#71717a')
  ctx.fillStyle = bodyGradient
  ctx.fillRect(OBSTACLE_X, OBSTACLE_Y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.rect(OBSTACLE_X, OBSTACLE_Y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
  ctx.clip()
  ctx.fillStyle = '#facc15'
  const stripeWidth = 14
  for (
    let sx = OBSTACLE_X - OBSTACLE_HEIGHT;
    sx < OBSTACLE_X + OBSTACLE_WIDTH;
    sx += stripeWidth * 2
  ) {
    ctx.beginPath()
    ctx.moveTo(sx, OBSTACLE_Y + OBSTACLE_HEIGHT)
    ctx.lineTo(sx + OBSTACLE_HEIGHT, OBSTACLE_Y)
    ctx.lineTo(sx + OBSTACLE_HEIGHT + stripeWidth, OBSTACLE_Y)
    ctx.lineTo(sx + stripeWidth, OBSTACLE_Y + OBSTACLE_HEIGHT)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  ctx.strokeStyle = '#27272a'
  ctx.lineWidth = 2
  ctx.strokeRect(OBSTACLE_X, OBSTACLE_Y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
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

function spawnBurst(particles: Particle[], x: number, y: number, color: string) {
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
  onClear: (score: number) => void
  onGameOver: (score: number) => void
}

type BuffDisplay = {
  doubleWire: number
  clock: number
  hourglass: number
  barrier: number
}

const NO_BUFFS: BuffDisplay = { doubleWire: 0, clock: 0, hourglass: 0, barrier: 0 }

function GamePlay({ stageIndex, onClear, onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const playerXRef = useRef(CANVAS_WIDTH / 2)
  const ballsRef = useRef<Ball[]>(createStage(stageIndex))
  const harpoonsRef = useRef<Harpoon[]>([])
  const itemsRef = useRef<Item[]>([])
  const hpRef = useRef(MAX_HP)
  const invulnUntilRef = useRef(0)
  const comboRef = useRef(0)
  const lastHitAtRef = useRef(0)
  const scoreRef = useRef(0)
  const nextIdRef = useRef(1000 * (stageIndex + 1))
  const nextItemIdRef = useRef(1)
  const keysRef = useRef<Record<string, boolean>>({})
  const endedRef = useRef(false)
  const particlesRef = useRef<Particle[]>([])
  const popupsRef = useRef<Popup[]>([])

  const doubleWireUntilRef = useRef(0)
  const clockUntilRef = useRef(0)
  const hourglassUntilRef = useRef(0)
  const barrierCountRef = useRef(0)
  const buffsDisplayRef = useRef<BuffDisplay>(NO_BUFFS)

  const [hp, setHp] = useState(MAX_HP)
  const [score, setScore] = useState(0)
  const [buffs, setBuffs] = useState<BuffDisplay>(NO_BUFFS)

  useEffect(() => {
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
    clockUntilRef.current = 0
    hourglassUntilRef.current = 0
    barrierCountRef.current = 0
    buffsDisplayRef.current = NO_BUFFS
    setHp(MAX_HP)
    setBuffs(NO_BUFFS)
  }, [stageIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      if (e.key === ' ') e.preventDefault()
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    startBgm()
    return () => stopBgm()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let lastTime: number | null = null

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
      const dtSec = Math.min((time - lastTime) / 1000, 0.05)
      const dtMs = dtSec * 1000
      lastTime = time

      if (!endedRef.current) {
        const keys = keysRef.current
        let vx = 0
        if (keys.ArrowLeft || keys.a || keys.A) vx -= PLAYER_SPEED
        if (keys.ArrowRight || keys.d || keys.D) vx += PLAYER_SPEED
        playerXRef.current = Math.min(
          Math.max(playerXRef.current + vx * dtSec, PLAYER_WIDTH / 2),
          CANVAS_WIDTH - PLAYER_WIDTH / 2,
        )

        const isClockActive = time < clockUntilRef.current
        const isHourglassActive = !isClockActive && time < hourglassUntilRef.current
        const maxHarpoons =
          time < doubleWireUntilRef.current
            ? MAX_HARPOONS_DOUBLE_WIRE
            : MAX_HARPOONS_DEFAULT

        if (keys[' '] && harpoonsRef.current.length < maxHarpoons) {
          harpoonsRef.current = [
            ...harpoonsRef.current,
            { x: playerXRef.current, y: PLAYER_Y },
          ]
        }

        harpoonsRef.current = harpoonsRef.current
          .map((h) => ({ x: h.x, y: h.y - HARPOON_SPEED * dtSec }))
          .filter((h) => h.y > 0 && !harpoonHitsObstacle(h.x, h.y))

        if (!isClockActive) {
          const ballDt = isHourglassActive ? dtSec * HOURGLASS_SLOW_FACTOR : dtSec
          ballsRef.current = ballsRef.current.map((b) => stepBall(b, ballDt))
        }

        if (harpoonsRef.current.length > 0) {
          const remainingHarpoons: Harpoon[] = []
          for (const h of harpoonsRef.current) {
            const hitIndex = ballsRef.current.findIndex((b) =>
              harpoonHitsBall(h.x, h.y, b),
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
            scoreRef.current += gained
            setScore(scoreRef.current)

            spawnBurst(
              particlesRef.current,
              hitBall.x,
              hitBall.y,
              BALL_COLORS[hitBall.level],
            )
            playHitSound(hitBall.level)
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

        if (!isClockActive && time >= invulnUntilRef.current) {
          const hit = ballsRef.current.some((b) =>
            ballHitsPlayer(b, playerXRef.current),
          )
          if (hit) {
            invulnUntilRef.current = time + INVULN_MS
            if (barrierCountRef.current > 0) {
              barrierCountRef.current -= 1
            } else {
              hpRef.current -= 1
              setHp(hpRef.current)
              playPlayerHitSound()
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
          itemHitsPlayer(item, playerXRef.current),
        )
        if (pickupIndex !== -1) {
          const picked = itemsRef.current[pickupIndex]
          itemsRef.current = [
            ...itemsRef.current.slice(0, pickupIndex),
            ...itemsRef.current.slice(pickupIndex + 1),
          ]
          playItemSound()

          switch (picked.type) {
            case 'doubleWire':
              doubleWireUntilRef.current = time + DOUBLE_WIRE_DURATION_MS
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
                spawnBurst(particlesRef.current, b.x, b.y, BALL_COLORS[b.level])
              }
              ballsRef.current = explodeToSmallest(ballsRef.current, nextId)
              break
          }
        }

        const doubleWireSec = Math.max(
          0,
          Math.ceil((doubleWireUntilRef.current - time) / 1000),
        )
        const clockSec = Math.max(0, Math.ceil((clockUntilRef.current - time) / 1000))
        const hourglassSec = Math.max(
          0,
          Math.ceil((hourglassUntilRef.current - time) / 1000),
        )
        const barrierCount = barrierCountRef.current
        const prevBuffs = buffsDisplayRef.current
        if (
          prevBuffs.doubleWire !== doubleWireSec ||
          prevBuffs.clock !== clockSec ||
          prevBuffs.hourglass !== hourglassSec ||
          prevBuffs.barrier !== barrierCount
        ) {
          const nextBuffs: BuffDisplay = {
            doubleWire: doubleWireSec,
            clock: clockSec,
            hourglass: hourglassSec,
            barrier: barrierCount,
          }
          buffsDisplayRef.current = nextBuffs
          setBuffs(nextBuffs)
        }

        if (!endedRef.current && ballsRef.current.length === 0) {
          endedRef.current = true
          playClearSound()
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

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      drawBackground(ctx, stageIndex)
      drawObstacle(ctx)

      for (const h of harpoonsRef.current) {
        ctx.save()
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur = 8
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(h.x, PLAYER_Y)
        ctx.lineTo(h.x, h.y)
        ctx.stroke()
        ctx.restore()
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

      const isInvuln = time < invulnUntilRef.current
      const playerGradient = ctx.createLinearGradient(
        0,
        PLAYER_Y - PLAYER_HEIGHT / 2,
        0,
        PLAYER_Y + PLAYER_HEIGHT / 2,
      )
      playerGradient.addColorStop(0, isInvuln ? '#fef08a' : '#f87171')
      playerGradient.addColorStop(1, isInvuln ? '#fbbf24' : '#b91c1c')

      ctx.save()
      if (isInvuln) {
        ctx.shadowColor = '#fbbf24'
        ctx.shadowBlur = 12
      }

      const px = playerXRef.current - PLAYER_WIDTH / 2
      const py = PLAYER_Y - PLAYER_HEIGHT / 2

      ctx.fillStyle = '#374151'
      ctx.fillRect(playerXRef.current - 4, py - 16, 8, 16)

      ctx.fillStyle = playerGradient
      const radius = 4
      ctx.beginPath()
      ctx.moveTo(px + radius, py)
      ctx.arcTo(px + PLAYER_WIDTH, py, px + PLAYER_WIDTH, py + PLAYER_HEIGHT, radius)
      ctx.arcTo(px + PLAYER_WIDTH, py + PLAYER_HEIGHT, px, py + PLAYER_HEIGHT, radius)
      ctx.arcTo(px, py + PLAYER_HEIGHT, px, py, radius)
      ctx.arcTo(px, py, px + PLAYER_WIDTH, py, radius)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      ctx.font = "12px 'Galmuri11', monospace"
      ctx.textAlign = 'center'
      for (const p of popupsRef.current) {
        ctx.globalAlpha = p.life / p.maxLife
        ctx.fillStyle = '#b45309'
        ctx.fillText(p.text, p.x, p.y)
        ctx.globalAlpha = 1
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [stageIndex, onClear, onGameOver])

  return (
    <div className="gameplay">
      <div className="gameplay-hud">
        <span className="hud-stage">Stage {stageIndex + 1}</span>
        <div className="hp-bar">
          {Array.from({ length: MAX_HP }, (_, i) => (
            <span
              key={i}
              className={`hp-segment ${i < hp ? 'hp-filled' : ''}`}
            />
          ))}
        </div>
        <span className="hud-score">Score {score}</span>
      </div>
      <div className="gameplay-body">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ border: '1px solid #2e303a' }}
        />
        <aside className="hint-panel">
          <div>
            <h3>Progress</h3>
            <ol className="stage-roster">
              {STAGE_NAMES.slice(0, STAGE_COUNT).map((name, i) => (
                <li
                  key={name}
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
              {(['doubleWire', 'clock', 'hourglass'] as const)
                .filter((key) => buffs[key] > 0)
                .map((key) => (
                  <li key={key}>
                    {BUFF_LABELS[key]} {buffs[key]}s
                  </li>
                ))}
              {buffs.barrier > 0 && <li>Barrier x{buffs.barrier}</li>}
              {buffs.doubleWire === 0 &&
                buffs.clock === 0 &&
                buffs.hourglass === 0 &&
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
    </div>
  )
}

export default GamePlay
