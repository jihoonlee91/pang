import { useEffect, useRef, useState } from 'react'
import './StageReveal.css'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './game/constants'
import {
  drawUnrevealedBackground,
  getStageImageUrl,
  STAGE_NAMES,
} from './game/backgrounds'

type Props = {
  stageIndex: number
  onComplete: () => void
}

// Beat: hold the Canvas placeholder briefly so the player registers what
// it looked like, crossfade into the real illustrated image, hold that,
// then auto-advance — a "Continue" button skips the wait for anyone who
// doesn't want to watch it.
const REVEAL_DELAY_MS = 500
const CROSSFADE_MS = 900
const HOLD_MS = 900

function StageReveal({ stageIndex, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const imageUrl = getStageImageUrl(stageIndex)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) drawUnrevealedBackground(ctx, stageIndex)
  }, [stageIndex])

  useEffect(() => {
    setRevealed(false)
    const revealTimer = window.setTimeout(
      () => setRevealed(true),
      REVEAL_DELAY_MS,
    )
    const completeTimer = window.setTimeout(
      onComplete,
      REVEAL_DELAY_MS + CROSSFADE_MS + HOLD_MS,
    )
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(completeTimer)
    }
  }, [stageIndex, onComplete])

  return (
    <div className="screen stage-reveal-screen">
      <p className="stage-reveal-kicker">Stage Clear</p>
      <h1>{STAGE_NAMES[stageIndex % STAGE_NAMES.length]}</h1>
      <div className="stage-reveal-frame">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="stage-reveal-canvas"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className={`stage-reveal-image ${
              revealed ? 'stage-reveal-image-visible' : ''
            }`}
          />
        )}
      </div>
      <button type="button" className="screen-button" onClick={onComplete}>
        Continue
      </button>
    </div>
  )
}

export default StageReveal
