import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PUBLIC_STAGE_COUNT,
  STAGE_COUNT,
} from './game/constants'
import {
  drawBackground,
  drawUnrevealedBackground,
  getStageChapters,
  STAGE_NAMES,
  BACKGROUND_READY_EVENT,
  type StageChapter,
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
import {
  HIDDEN_FINAL_STAGE_INDEX,
  getVisibleStageCount,
} from './game/hiddenFinale'
import { getHighestUnlockedStage } from './game/progress'

type ThumbnailProps = {
  stageIndex: number
  cleared: boolean
}

function StageThumbnail({ stageIndex, cleared }: ThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const draw = () =>
      cleared
        ? drawBackground(ctx, stageIndex)
        : drawUnrevealedBackground(ctx, stageIndex)
    draw()
    window.addEventListener(BACKGROUND_READY_EVENT, draw)
    return () => window.removeEventListener(BACKGROUND_READY_EVENT, draw)
  }, [stageIndex, cleared])

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
  // null = showing the chapter grid; otherwise the index into `chapters`
  // currently drilled into. Rendering all 201 stages' illustrated images
  // at once is what causes the lag this splits around — only a chapter's
  // own ~10 stages ever mount their thumbnails at a time.
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<
    number | null
  >(null)
  const [jumpValue, setJumpValue] = useState('')
  const [pendingScrollStage, setPendingScrollStage] = useState<number | null>(
    null,
  )
  const currentCardRef = useRef<HTMLDivElement | null>(null)
  const effectiveHighestUnlockedStage = Math.max(
    getHighestUnlockedStage(),
    currentStage ?? 0,
    nextStage ?? 0,
  )
  const visibleStageCount =
    effectiveHighestUnlockedStage >= HIDDEN_FINAL_STAGE_INDEX
      ? getVisibleStageCount(effectiveHighestUnlockedStage)
      : PUBLIC_STAGE_COUNT

  const chapters = useMemo(
    () => getStageChapters().filter((c) => c.start < visibleStageCount),
    [visibleStageCount],
  )
  const selectedChapter: StageChapter | null =
    selectedChapterIndex !== null
      ? (chapters[selectedChapterIndex] ?? null)
      : null

  useEffect(() => {
    if (compact && currentCardRef.current) {
      currentCardRef.current.scrollIntoView({ block: 'center' })
    }
  }, [compact, currentStage])

  // Compact mode is meant to drop the viewer straight onto the current
  // stage, not make them pick a chapter first — auto-drill into whichever
  // chapter contains it.
  useEffect(() => {
    if (!compact || currentStage === undefined || selectedChapterIndex !== null)
      return
    const chapterIndex = chapters.findIndex(
      (c) => currentStage >= c.start && currentStage <= c.end,
    )
    if (chapterIndex !== -1) setSelectedChapterIndex(chapterIndex)
  }, [compact, currentStage, chapters, selectedChapterIndex])

  useEffect(() => {
    if (pendingScrollStage === null || selectedChapter === null) return
    document
      .getElementById(`stage-map-card-${pendingScrollStage}`)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    setPendingScrollStage(null)
  }, [pendingScrollStage, selectedChapter])

  const jumpToStage = () => {
    const target = Number(jumpValue)
    if (!Number.isInteger(target) || target < 1 || target > visibleStageCount)
      return
    const targetIndex = target - 1
    const chapterIndex = chapters.findIndex(
      (c) => targetIndex >= c.start && targetIndex <= c.end,
    )
    if (chapterIndex === -1) return
    setSelectedChapterIndex(chapterIndex)
    setPendingScrollStage(targetIndex)
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
          max={visibleStageCount}
          value={jumpValue}
          placeholder={`1-${visibleStageCount}`}
          onChange={(e) => setJumpValue(e.target.value)}
        />
        <button type="submit" className="screen-button screen-button-small">
          Go
        </button>
      </form>
      {onStartStage && (
        <p className="stage-map-status">
          {selectedStage === null
            ? `Choose a stage to start · ${Math.min(
                highestUnlockedStage + 1,
                visibleStageCount,
              )} / ${visibleStageCount} unlocked`
            : `Stage ${selectedStage + 1} selected`}
        </p>
      )}
      {onStartStage && selectedChapter && (
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

      {selectedChapter === null ? (
        <div className="stage-map-chapter-grid">
          {chapters.map((chapter, chapterIndex) => {
            const isLocked =
              Boolean(onStartStage) && chapter.start > highestUnlockedStage
            const clearedCount = Math.max(
              0,
              Math.min(chapter.end, highestUnlockedStage) - chapter.start + 1,
            )
            const stageCount = chapter.end - chapter.start + 1
            const isChapterCleared = clearedCount >= stageCount
            return (
              <button
                type="button"
                key={chapter.name + chapter.start}
                className={`stage-map-chapter-card ${isLocked ? 'stage-map-card-locked' : ''}`}
                disabled={isLocked}
                onClick={() => setSelectedChapterIndex(chapterIndex)}
              >
                <div className="stage-thumb-wrap">
                  <StageThumbnail
                    stageIndex={chapter.start}
                    cleared={chapter.start < highestUnlockedStage}
                  />
                  {isLocked && (
                    <span className="stage-map-badge stage-map-badge-locked">
                      LOCKED
                    </span>
                  )}
                  {!isLocked && isChapterCleared && (
                    <span className="stage-map-badge">CLEAR</span>
                  )}
                  {!isLocked && !isChapterCleared && clearedCount > 0 && (
                    <span className="stage-map-badge stage-map-badge-current-hazard">
                      {clearedCount}/{stageCount}
                    </span>
                  )}
                </div>
                <p>
                  {chapter.name}
                  <br />
                  <small>
                    Stage {chapter.start + 1}
                    {chapter.end > chapter.start ? `-${chapter.end + 1}` : ''}
                  </small>
                </p>
              </button>
            )
          })}
        </div>
      ) : (
        <>
          <div className="stage-map-actions">
            <button
              type="button"
              className="screen-button screen-button-secondary"
              onClick={() => setSelectedChapterIndex(null)}
            >
              ◀ Chapters
            </button>
          </div>
          <div className="stage-map-grid">
            {Array.from(
              { length: selectedChapter.end - selectedChapter.start + 1 },
              (_, offset) => selectedChapter.start + offset,
            ).map((i) => {
              const isCurrent = i === currentStage
              const isNext = i === nextStage
              const isCleared = i < effectiveHighestUnlockedStage
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
                  className={`stage-map-card ${isCleared ? 'stage-map-card-cleared' : ''} ${isCurrent ? 'stage-map-card-current' : ''} ${isNext ? 'stage-map-card-next' : ''} ${selectedStage === i ? 'stage-map-card-selected' : ''} ${isLocked ? 'stage-map-card-locked' : ''} ${i === HIDDEN_FINAL_STAGE_INDEX ? 'stage-map-card-hidden-finale' : ''}`}
                  ref={isCurrent ? currentCardRef : undefined}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <div className="stage-thumb-wrap">
                    <StageThumbnail stageIndex={i} cleared={isCleared} />
                    {isCleared && (
                      <span className="stage-map-badge">CLEAR</span>
                    )}
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
                    {i === HIDDEN_FINAL_STAGE_INDEX && (
                      <span className="stage-map-badge stage-map-badge-hidden-finale">
                        TRUE FINAL
                      </span>
                    )}
                    {isPortalStage && (
                      <span className="stage-map-badge stage-map-badge-portal">
                        PORTAL ×{portalCount}
                      </span>
                    )}
                    {/* Hazard-type badges (push/pull/damage) share bottom-right
                        positioning and can now co-occur on a single stage
                        (Chaos Rift remixes up to 3 at once), so they're
                        stacked in a flex column instead of each claiming the
                        same absolute corner. */}
                    <div className="stage-map-hazard-badges">
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
        </>
      )}

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
