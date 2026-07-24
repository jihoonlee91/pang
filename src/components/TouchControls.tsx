import type { InputAction } from '../game/input/InputController'

type Props = {
  disabled?: boolean
  size: number
  opacity: number
  hasLadder?: boolean
  onChange: (source: string, action: InputAction, pressed: boolean) => void
}

export default function TouchControls({
  disabled,
  size,
  opacity,
  hasLadder,
  onChange,
}: Props) {
  const bind = (action: InputAction, label: string) => ({
    'aria-label': label,
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      onChange(`pointer-${event.pointerId}`, action, true)
    },
    onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) =>
      onChange(`pointer-${event.pointerId}`, action, false),
    onPointerCancel: (event: React.PointerEvent<HTMLButtonElement>) =>
      onChange(`pointer-${event.pointerId}`, action, false),
    onLostPointerCapture: (event: React.PointerEvent<HTMLButtonElement>) =>
      onChange(`pointer-${event.pointerId}`, action, false),
  })

  return (
    <div
      className="touch-controls"
      style={
        {
          '--touch-size': `${size}px`,
          '--touch-opacity': opacity,
        } as React.CSSProperties
      }
      aria-label="Touch controls"
    >
      <div
        className="touch-move"
        aria-label={
          hasLadder ? 'Move, and climb the ladder' : 'Move left or right'
        }
      >
        {hasLadder && (
          <div className="touch-vertical" aria-label="Climb ladder">
            <button
              type="button"
              className="touch-button touch-up"
              {...bind('up', 'Climb up')}
            >
              ↑
            </button>
            <button
              type="button"
              className="touch-button touch-down"
              {...bind('down', 'Climb down')}
            >
              ↓
            </button>
          </div>
        )}
        <div className="touch-lr">
          <button
            type="button"
            className="touch-button touch-left"
            {...bind('left', 'Move left')}
          >
            ←
          </button>
          <button
            type="button"
            className="touch-button touch-right"
            {...bind('right', 'Move right')}
          >
            →
          </button>
        </div>
      </div>
      <button
        type="button"
        className="touch-button touch-fire"
        {...bind('fire', 'Fire')}
      >
        FIRE
      </button>
    </div>
  )
}
