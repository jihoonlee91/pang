import { useEffect, useRef, useState } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, STAGE_COUNT } from './game/constants'
import {
  BACKGROUNDS,
  BACKGROUND_READY_EVENT,
  STAGE_NAMES,
} from './game/backgrounds'
import { getStagePortals } from './game/portals'
import { getStageCurrent } from './game/currents'
import { getStageGravityWell } from './game/gravityWells'
import { getStageNebulaWells } from './game/nebulae'
import { getStageVortex } from './game/vortices'
import { getStageFireZones } from './game/fireZones'
import { getStageGravityScale } from './game/voidGravity'

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
    const draw = () => BACKGROUNDS[stageIndex % BACKGROUNDS.length](ctx)
    draw()
    window.addEventListener(BACKGROUND_READY_EVENT, draw)
    return () => window.removeEventListener(BACKGROUND_READY_EVENT, draw)
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
  onBack?: () => void
  currentStage?: number
  nextStage?: number
  title?: string
  statusText?: string
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
  onStartStage?: (stageIndex: number) => void
  highestUnlockedStage?: number
}

function StageMap({
  onBack,
  currentStage,
  nextStage,
  title = 'Stage Map',
  statusText,
  actionLabel,
  onAction,
  compact = false,
  onStartStage,
  highestUnlockedStage = STAGE_COUNT - 1,
}: Props) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const currentCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (compact && currentCardRef.current) {
      currentCardRef.current.scrollIntoView({ block: 'center' })
    }
  }, [compact, currentStage])

  return (
    <div
      className={`screen stage-map-screen ${compact ? 'stage-map-transition' : ''}`}
    >
      <h1>{title}</h1>
      {statusText && <p className="stage-map-status">{statusText}</p>}
      {onStartStage && (
        <p className="stage-map-status">
          {selectedStage === null
            ? `Choose a stage to start · ${highestUnlockedStage + 1} / ${STAGE_COUNT} unlocked`
            : `Stage ${selectedStage + 1} selected`}
        </p>
      )}
      {onStartStage && (
        <div className="stage-map-actions stage-map-start-actions">
          <button
            type="button"
            className="screen-button"
            disabled={selectedStage === null}
            onClick={() => {
              if (selectedStage !== null) onStartStage(selectedStage)
            }}
          >
            {selectedStage === null
              ? 'Select a Stage'
              : `Start Stage ${selectedStage + 1}`}
          </button>
        </div>
      )}
      <div className="stage-map-grid">
        {Array.from({ length: STAGE_COUNT }, (_, i) => {
          const isCurrent = i === currentStage
          const isNext = i === nextStage
          const isCleared = currentStage !== undefined && i < currentStage
          const isLocked = Boolean(onStartStage) && i > highestUnlockedStage
          const portalCount = getStagePortals(i).length
          const isPortalStage = portalCount > 0
          const isCurrentStage = getStageCurrent(i) !== null
          const isGravityWellStage = getStageGravityWell(i) !== null
          const isNebulaStage = getStageNebulaWells(i) !== null
          const isVortexStage = getStageVortex(i) !== null
          const fireZoneCount = getStageFireZones(i)?.length ?? 0
          const isFireZoneStage = fireZoneCount > 0
          const isVoidStage = getStageGravityScale(i) < 1
          const card = (
            <div
              className={`stage-map-card ${isCleared ? 'stage-map-card-cleared' : ''} ${isCurrent ? 'stage-map-card-current' : ''} ${isNext ? 'stage-map-card-next' : ''} ${selectedStage === i ? 'stage-map-card-selected' : ''} ${isLocked ? 'stage-map-card-locked' : ''}`}
              ref={isCurrent ? currentCardRef : undefined}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="stage-thumb-wrap">
                <StageThumbnail stageIndex={i} />
                {isCleared && <span className="stage-map-badge">CLEAR</span>}
                {isCurrent && (
                  <span className="stage-map-badge stage-map-badge-current">
                    YOU ARE HERE
                  </span>
                )}
                {isNext && (
                  <span className="stage-map-badge stage-map-badge-next">
                    NEXT
                  </span>
                )}
                {isLocked && (
                  <span className="stage-map-badge stage-map-badge-locked">
                    LOCKED
                  </span>
                )}
                {isPortalStage && (
                  <span className="stage-map-badge stage-map-badge-portal">
                    PORTAL ×{portalCount}
                  </span>
                )}
                {isCurrentStage && (
                  <span className="stage-map-badge stage-map-badge-current-hazard">
                    CURRENT
                  </span>
                )}
                {isGravityWellStage && (
                  <span className="stage-map-badge stage-map-badge-gravity">
                    GRAVITY WELL
                  </span>
                )}
                {isNebulaStage && (
                  <span className="stage-map-badge stage-map-badge-gravity">
                    NEBULA FIELD
                  </span>
                )}
                {isVortexStage && (
                  <span className="stage-map-badge stage-map-badge-gravity">
                    VORTEX
                  </span>
                )}
                {isFireZoneStage && (
                  <span className="stage-map-badge stage-map-badge-portal">
                    FIRE ZONES
                  </span>
                )}
                {isVoidStage && (
                  <span className="stage-map-badge stage-map-badge-current-hazard">
                    LOW GRAVITY
                  </span>
                )}
              </div>
              <p>
                {i + 1}. {STAGE_NAMES[i % STAGE_NAMES.length]}
              </p>
            </div>
          )

          return onStartStage ? (
            <button
              type="button"
              className="stage-map-card-button"
              aria-pressed={selectedStage === i}
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) setSelectedStage(i)
              }}
              key={i}
            >
              {card}
            </button>
          ) : (
            <div className="stage-map-card-static" key={i}>
              {card}
            </div>
          )
        })}
      </div>
      <div className="stage-map-actions">
        {onAction && actionLabel && (
          <button type="button" className="screen-button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {onBack && (
          <button
            type="button"
            className="screen-button screen-button-secondary"
            onClick={onBack}
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}

export default StageMap
