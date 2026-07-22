import { useEffect, useRef, useState } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, STAGE_COUNT } from './game/constants'
import {
  BACKGROUNDS,
  BACKGROUND_READY_EVENT,
  STAGE_NAMES,
} from './game/backgrounds'
import { getStagePortals } from './game/portals'
import { getStageBreeze } from './game/breeze'
import { getStageCurrent } from './game/currents'
import { getStageGravityWell } from './game/gravityWells'
import { getStageNebulaWells } from './game/nebulae'
import { getStageVortex } from './game/vortices'
import { getStageFireZones } from './game/fireZones'
import { getStageGravityScale } from './game/voidGravity'
import { getStageAcidRainZones } from './game/acidRain'
import { getStageIceWind } from './game/iceWinds'
import { getStageSolarFlare } from './game/solarFlares'
import { getQuantumJitterStrength } from './game/quantumRifts'
import { getStageOverdriveBaseWells } from './game/overdriveWells'
import {
  getChaosRiftCurrent,
  getChaosRiftFireZones,
  getChaosRiftWells,
} from './game/chaosRift'

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
  const [jumpValue, setJumpValue] = useState('')
  const currentCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (compact && currentCardRef.current) {
      currentCardRef.current.scrollIntoView({ block: 'center' })
    }
  }, [compact, currentStage])

  const jumpToStage = () => {
    const target = Number(jumpValue)
    if (!Number.isInteger(target) || target < 1 || target > STAGE_COUNT) return
    document
      .getElementById(`stage-map-card-${target - 1}`)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  return (
    <div
      className={`screen stage-map-screen ${compact ? 'stage-map-transition' : ''}`}
    >
      <h1>{title}</h1>
      {statusText && <p className="stage-map-status">{statusText}</p>}
      <form
        className="stage-map-jump"
        onSubmit={(e) => {
          e.preventDefault()
          jumpToStage()
        }}
      >
        <label htmlFor="stage-map-jump-input">Jump to stage</label>
        <input
          id="stage-map-jump-input"
          type="number"
          min={1}
          max={STAGE_COUNT}
          value={jumpValue}
          placeholder={`1-${STAGE_COUNT}`}
          onChange={(e) => setJumpValue(e.target.value)}
        />
        <button type="submit" className="screen-button screen-button-small">
          Go
        </button>
      </form>
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
          const isBreezeStage = getStageBreeze(i) !== null
          const isCurrentStage = getStageCurrent(i) !== null
          const isGravityWellStage = getStageGravityWell(i) !== null
          const isNebulaStage = getStageNebulaWells(i) !== null
          const isVortexStage = getStageVortex(i) !== null
          const fireZoneCount = getStageFireZones(i)?.length ?? 0
          const isFireZoneStage = fireZoneCount > 0
          const isVoidStage = getStageGravityScale(i) < 1
          const acidRainCount = getStageAcidRainZones(i)?.length ?? 0
          const isAcidRainStage = acidRainCount > 0
          const isIceWindStage = getStageIceWind(i) !== null
          const isSolarFlareStage = getStageSolarFlare(i) !== null
          const isQuantumRiftStage = getQuantumJitterStrength(i) !== null
          const isOverdriveStage = getStageOverdriveBaseWells(i) !== null
          const isChaosCurrentStage = getChaosRiftCurrent(i) !== null
          const isChaosWellStage = getChaosRiftWells(i) !== null
          const chaosFireZoneCount = getChaosRiftFireZones(i)?.length ?? 0
          const isChaosFireZoneStage = chaosFireZoneCount > 0
          const card = (
            <div
              id={`stage-map-card-${i}`}
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
                {isBreezeStage && (
                  <span className="stage-map-badge stage-map-badge-current-hazard">
                    BREEZE
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
                {isAcidRainStage && (
                  <span className="stage-map-badge stage-map-badge-portal">
                    ACID RAIN
                  </span>
                )}
                {isIceWindStage && (
                  <span className="stage-map-badge stage-map-badge-current-hazard">
                    ICE WIND
                  </span>
                )}
                {isSolarFlareStage && (
                  <span className="stage-map-badge stage-map-badge-portal">
                    SOLAR FLARE
                  </span>
                )}
                {isQuantumRiftStage && (
                  <span className="stage-map-badge stage-map-badge-gravity">
                    QUANTUM JITTER
                  </span>
                )}
                {isOverdriveStage && (
                  <span className="stage-map-badge stage-map-badge-gravity">
                    POLARITY WELLS
                  </span>
                )}
                {isChaosCurrentStage && (
                  <span className="stage-map-badge stage-map-badge-current-hazard">
                    CURRENT
                  </span>
                )}
                {isChaosWellStage && (
                  <span className="stage-map-badge stage-map-badge-gravity">
                    GRAVITY WELL
                  </span>
                )}
                {isChaosFireZoneStage && (
                  <span className="stage-map-badge stage-map-badge-portal">
                    FIRE ZONES
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
