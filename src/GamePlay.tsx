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

const BALL_COLORS = ['#fb7185', '#facc15', '#38bdf8']

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

const ITEM_ANNOUNCEMENTS: Record<ItemType, string> = {
  doubleWire: 'Double Wire!',
  clock: 'Time Stop!',
  hourglass: 'Slow Motion!',
  barrier: 'Barrier!',
  oneUp: '+1 HP!',
  dynamite: 'Dynamite!',
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
  onClear: (score: number) => void
  onGameOver: (score: number) => void
  demo?: boolean
}

const AI_DEADZONE = 10
const AI_FIRE_TOLERANCE = 18

type BuffDisplay = {
  doubleWire: number
  clock: number
  hourglass: number
  barrier: number
}

const NO_BUFFS: BuffDisplay = {
  doubleWire: 0,
  clock: 0,
  hourglass: 0,
  barrier: 0,
}

function GamePlay({ stageIndex, onClear, onGameOver, demo = false }: Props) {
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
  const dragRef = useRef<{
    startClientX: number
    startPlayerX: number
    moved: boolean
  } | null>(null)
  const dragTargetXRef = useRef<number | null>(null)
  const fireRequestedRef = useRef(false)
  const endedRef = useRef(false)
  const particlesRef = useRef<Particle[]>([])
  const popupsRef = useRef<Popup[]>([])

  const doubleWireUntilRef = useRef(0)
  const clockUntilRef = useRef(0)
  const hourglassUntilRef = useRef(0)
  const barrierCountRef = useRef(0)
  const buffsDisplayRef = useRef<BuffDisplay>(NO_BUFFS)
  const aiKeysDisplayRef = useRef({ left: false, right: false, fire: false })

  const [hp, setHp] = useState(MAX_HP)
  const [score, setScore] = useState(0)
  const [buffs, setBuffs] = useState<BuffDisplay>(NO_BUFFS)
  const [aiKeys, setAiKeys] = useState({
    left: false,
    right: false,
    fire: false,
  })

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
    startBgm(stageIndex)
    return () => stopBgm()
  }, [stageIndex])

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
        const isClockActive = time < clockUntilRef.current
        const isHourglassActive =
          !isClockActive && time < hourglassUntilRef.current
        const maxHarpoons =
          time < doubleWireUntilRef.current
            ? MAX_HARPOONS_DOUBLE_WIRE
            : MAX_HARPOONS_DEFAULT

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
            const { x, time } = predictLandingSpot(b)
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
          keysRef.current = {
            ArrowLeft: left,
            ArrowRight: right,
            ' ': fire,
          }
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

        const keys = keysRef.current
        let vx = 0
        if (keys.ArrowLeft || keys.a || keys.A) vx -= PLAYER_SPEED
        if (keys.ArrowRight || keys.d || keys.D) vx += PLAYER_SPEED
        playerXRef.current = Math.min(
          Math.max(playerXRef.current + vx * dtSec, PLAYER_WIDTH / 2),
          CANVAS_WIDTH - PLAYER_WIDTH / 2,
        )

        if (dragTargetXRef.current !== null) {
          const diff = dragTargetXRef.current - playerXRef.current
          const maxStep = PLAYER_SPEED * dtSec
          playerXRef.current =
            Math.abs(diff) <= maxStep
              ? dragTargetXRef.current
              : playerXRef.current + Math.sign(diff) * maxStep
        }

        if (
          (keys[' '] || fireRequestedRef.current) &&
          harpoonsRef.current.length < maxHarpoons
        ) {
          harpoonsRef.current = [
            ...harpoonsRef.current,
            { x: playerXRef.current, y: PLAYER_Y },
          ]
        }
        fireRequestedRef.current = false

        harpoonsRef.current = harpoonsRef.current
          .map((h) => ({ x: h.x, y: h.y - HARPOON_SPEED * dtSec }))
          .filter((h) => h.y > 0 && !harpoonHitsObstacle(h.x, h.y))

        if (!isClockActive) {
          const ballDt = isHourglassActive
            ? dtSec * HOURGLASS_SLOW_FACTOR
            : dtSec
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

        if (!demo && !isClockActive && time >= invulnUntilRef.current) {
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
        const clockSec = Math.max(
          0,
          Math.ceil((clockUntilRef.current - time) / 1000),
        )
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

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [stageIndex, onClear, onGameOver, demo])

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
        <span className="hud-score">Score {score}</span>
        {demo && <span className="demo-badge">AI</span>}
      </div>
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
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ border: '1px solid #2e303a', touchAction: 'none' }}
            onPointerDown={(e) => {
              if (demo) return
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
            onPointerUp={() => {
              if (dragRef.current && !dragRef.current.moved) {
                fireRequestedRef.current = true
              }
              dragRef.current = null
              dragTargetXRef.current = null
            }}
            onPointerLeave={() => {
              dragRef.current = null
              dragTargetXRef.current = null
            }}
          />
          <p className="touch-hint">Drag to move &middot; Tap to fire</p>
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
