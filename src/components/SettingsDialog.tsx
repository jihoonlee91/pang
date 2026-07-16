import type { GameSettings } from '../game/settings'

type Props = {
  settings: GameSettings
  onChange: (settings: GameSettings) => void
  onClose: () => void
  onReplayTutorial: () => void
}

export default function SettingsDialog({
  settings,
  onChange,
  onClose,
  onReplayTutorial,
}: Props) {
  const update = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) => onChange({ ...settings, [key]: value })

  return (
    <div
      className="screen settings-screen"
      role="dialog"
      aria-labelledby="settings-title"
    >
      <h1 id="settings-title">Settings</h1>
      {(
        [
          ['masterVolume', 'Master volume'],
          ['musicVolume', 'Music volume'],
          ['effectsVolume', 'Effects volume'],
        ] as const
      ).map(([key, label]) => (
        <label className="setting-row" key={key}>
          {label}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings[key]}
            onChange={(event) => update(key, Number(event.target.value))}
          />
        </label>
      ))}
      <label className="setting-row">
        Touch button size
        <input
          type="range"
          min="56"
          max="88"
          step="4"
          value={settings.touchButtonSize}
          onChange={(event) =>
            update('touchButtonSize', Number(event.target.value))
          }
        />
      </label>
      <label className="setting-row">
        Touch opacity
        <input
          type="range"
          min="0.4"
          max="1"
          step="0.05"
          value={settings.touchButtonOpacity}
          onChange={(event) =>
            update('touchButtonOpacity', Number(event.target.value))
          }
        />
      </label>
      {(
        [
          ['screenShake', 'Screen shake'],
          ['reducedMotion', 'Reduced motion'],
          ['vibration', 'Vibration'],
          ['showFps', 'Show FPS'],
        ] as const
      ).map(([key, label]) => (
        <label className="setting-check" key={key}>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={(event) => update(key, event.target.checked)}
          />
          {label}
        </label>
      ))}
      <button type="button" className="screen-button" onClick={onClose}>
        Done
      </button>
      <button
        type="button"
        className="screen-button screen-button-secondary"
        onClick={onReplayTutorial}
      >
        Replay Tutorial
      </button>
    </div>
  )
}
