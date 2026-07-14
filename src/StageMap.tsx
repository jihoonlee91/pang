import { useEffect, useRef } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, STAGE_COUNT } from './game/constants'
import { BACKGROUNDS, STAGE_NAMES } from './game/backgrounds'

type ThumbnailProps = {
  stageIndex: number
}

function StageThumbnail({ stageIndex }: ThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    BACKGROUNDS[stageIndex % BACKGROUNDS.length](ctx)
  }, [stageIndex])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="stage-thumb"
    />
  )
}

type Props = {
  onBack: () => void
}

function StageMap({ onBack }: Props) {
  return (
    <div className="screen stage-map-screen">
      <h1>Stage Map</h1>
      <div className="stage-map-grid">
        {Array.from({ length: STAGE_COUNT }, (_, i) => (
          <div className="stage-map-card" key={i}>
            <StageThumbnail stageIndex={i} />
            <p>
              {i + 1}. {STAGE_NAMES[i % STAGE_NAMES.length]}
            </p>
          </div>
        ))}
      </div>
      <button type="button" className="screen-button" onClick={onBack}>
        Back
      </button>
    </div>
  )
}

export default StageMap
