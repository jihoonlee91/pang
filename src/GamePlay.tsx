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
      ctx.fillStyle = '#16171d'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const isInvuln = time < invulnUntilRef.current
      ctx.fillStyle = isInvuln ? '#c084fc' : '#aa3bff'
      ctx.fillRect(
        playerXRef.current - PLAYER_WIDTH / 2,
        PLAYER_Y - PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
      )

      if (harpoonRef.current) {
        ctx.strokeStyle = '#f3f4f6'
        ctx.beginPath()
        ctx.moveTo(harpoonRef.current.x, PLAYER_Y)
        ctx.lineTo(harpoonRef.current.x, harpoonRef.current.y)
        ctx.stroke()
      }

      ctx.fillStyle = '#60a5fa'
      for (const b of ballsRef.current) {
        ctx.beginPath()
        ctx.arc(b.x, b.y, LEVEL_RADIUS[b.level], 0, Math.PI * 2)
        ctx.fill()
      }

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
