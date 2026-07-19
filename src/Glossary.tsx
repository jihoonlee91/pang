import { useEffect, useRef } from 'react'
import type { ItemType } from './game/types'
import {
  ITEM_COLORS,
  ITEM_TITLES,
  ITEM_DESCRIPTIONS,
  drawFallingItemIcon,
} from './game/itemDisplay'
import { HAZARD_CATALOG } from './game/hazardCatalog'

const ITEM_TYPES = Object.keys(ITEM_TITLES) as ItemType[]
const ICON_SIZE = 56

function ItemIcon({ type }: { type: ItemType }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE)
    ctx.save()
    ctx.translate(ICON_SIZE / 2, ICON_SIZE / 2)
    const color = ITEM_COLORS[type]
    ctx.beginPath()
    ctx.arc(0, 0, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#07142f'
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = color
    ctx.stroke()
    drawFallingItemIcon(ctx, type, color)
    ctx.restore()
  }, [type])

  return (
    <canvas
      ref={canvasRef}
      width={ICON_SIZE}
      height={ICON_SIZE}
      className="glossary-icon"
    />
  )
}

type Props = {
  onBack: () => void
}

function Glossary({ onBack }: Props) {
  return (
    <div className="screen glossary-screen">
      <h1>Glossary</h1>
      <p className="glossary-intro">
        Every item and map hazard in the game, with what it does.
      </p>

      <h2 className="glossary-section-title">Items</h2>
      <div className="glossary-grid">
        {ITEM_TYPES.map((type) => (
          <div key={type} className="glossary-card">
            <ItemIcon type={type} />
            <div className="glossary-card-text">
              <p className="glossary-card-title">{ITEM_TITLES[type]}</p>
              <p className="glossary-card-desc">{ITEM_DESCRIPTIONS[type]}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="glossary-section-title">Hazards</h2>
      <div className="glossary-grid">
        {HAZARD_CATALOG.map((hazard) => (
          <div key={hazard.id} className="glossary-card">
            <div className="glossary-hazard-badge" aria-hidden="true">
              {hazard.startStage + 1}
            </div>
            <div className="glossary-card-text">
              <p className="glossary-card-title">
                {hazard.name} · Stage {hazard.startStage + 1}+
              </p>
              <p className="glossary-card-desc">{hazard.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glossary-actions">
        <button
          type="button"
          className="screen-button screen-button-secondary"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default Glossary
