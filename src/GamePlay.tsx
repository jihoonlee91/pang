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
} from './game/constants'
import {
  createStage,
  stepBall,
  splitBall,
  harpoonHitsBall,
  ballHitsPlayer,
} from './game/engine'
import type { Ball, Harpoon } from './game/types'

const BALL_COLORS = ['#f472b6', '#4ade80', '#60a5fa']

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

type Props = {
  stageIndex: number
  onClear: (score: number) => void
  onGameOver: (score: number) => void
}

function GamePlay({ stageIndex, onClear, onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const playerXRef = useRef(CANVAS_WIDTH / 2)
  const ballsRef = useRef<Ball[]>(createStage(stageIndex))
  const harpoonRef = useRef<Harpoon>(null)
  const hpRef = useRef(MAX_HP)
  const invulnUntilRef = useRef(0)
  const comboRef = useRef(0)
  const lastHitAtRef = useRef(0)
  const scoreRef = useRef(0)
  const nextIdRef = useRef(1000 * (stageIndex + 1))
  const keysRef = useRef<Record<string, boolean>>({})
  const endedRef = useRef(false)

  const [hp, setHp] = useState(MAX_HP)
  const [score, setScore] = useState(0)

  useEffect(() => {
    ballsRef.current = createStage(stageIndex)
    harpoonRef.current = null
    hpRef.current = MAX_HP
    invulnUntilRef.current = 0
    comboRef.current = 0
    lastHitAtRef.current = 0
    endedRef.current = false
    setHp(MAX_HP)
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

    const loop = (time: number) => {
      if (lastTime === null) lastTime = time
      const dtSec = Math.min((time - lastTime) / 1000, 0.05)
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

        if (keys[' '] && !harpoonRef.current) {
          harpoonRef.current = { x: playerXRef.current, y: PLAYER_Y }
        }

        if (harpoonRef.current) {
          harpoonRef.current.y -= HARPOON_SPEED * dtSec
          if (harpoonRef.current.y <= 0) {
            harpoonRef.current = null
          }
        }

        ballsRef.current = ballsRef.current.map((b) => stepBall(b, dtSec))

        if (harpoonRef.current) {
          const h = harpoonRef.current
          const hitIndex = ballsRef.current.findIndex((b) =>
            harpoonHitsBall(h.x, h.y, b),
          )
          if (hitIndex !== -1) {
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

            ballsRef.current = [
              ...ballsRef.current.slice(0, hitIndex),
              ...ballsRef.current.slice(hitIndex + 1),
              ...children,
            ]
            harpoonRef.current = null
          }
        }

        if (time >= invulnUntilRef.current) {
          const hit = ballsRef.current.some((b) =>
            ballHitsPlayer(b, playerXRef.current),
          )
          if (hit) {
            hpRef.current -= 1
            setHp(hpRef.current)
            invulnUntilRef.current = time + INVULN_MS
            if (hpRef.current <= 0) {
              endedRef.current = true
              onGameOver(scoreRef.current)
            }
          }
        }

        if (!endedRef.current && ballsRef.current.length === 0) {
          endedRef.current = true
          onClear(scoreRef.current)
        }
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      bgGradient.addColorStop(0, '#1f2028')
      bgGradient.addColorStop(1, '#0b0c10')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.strokeStyle = '#2e303a'
      ctx.beginPath()
      ctx.moveTo(0, CANVAS_HEIGHT - 4)
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 4)
      ctx.stroke()

      if (harpoonRef.current) {
        ctx.save()
        ctx.shadowColor = '#c084fc'
        ctx.shadowBlur = 8
        ctx.strokeStyle = '#f3f4f6'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(harpoonRef.current.x, PLAYER_Y)
        ctx.lineTo(harpoonRef.current.x, harpoonRef.current.y)
        ctx.stroke()
        ctx.restore()
      }

      for (const b of ballsRef.current) {
        drawBall(ctx, b)
      }

      const isInvuln = time < invulnUntilRef.current
      const playerGradient = ctx.createLinearGradient(
        0,
        PLAYER_Y - PLAYER_HEIGHT / 2,
        0,
        PLAYER_Y + PLAYER_HEIGHT / 2,
      )
      playerGradient.addColorStop(0, isInvuln ? '#e9d5ff' : '#c084fc')
      playerGradient.addColorStop(1, isInvuln ? '#c084fc' : '#7c3aed')

      ctx.save()
      if (isInvuln) {
        ctx.shadowColor = '#c084fc'
        ctx.shadowBlur = 12
      }
      ctx.fillStyle = playerGradient
      const px = playerXRef.current - PLAYER_WIDTH / 2
      const py = PLAYER_Y - PLAYER_HEIGHT / 2
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

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [stageIndex, onClear, onGameOver])

  return (
    <div>
      <p>
        스테이지 {stageIndex + 1} · HP {hp} · 점수 {score}
      </p>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '1px solid #2e303a', background: '#16171d' }}
      />
      <p>← → (또는 A/D) 이동, Space 발사</p>
    </div>
  )
}

export default GamePlay
