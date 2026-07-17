import { useState } from 'react'
import type { GameSettings } from '../game/settings'
import { clearAppCache } from '../game/updateCheck'

type Props = {
  settings: GameSettings
  onChange: (settings: GameSettings) => void
  onClose: () => void
  onReplayTutorial: () => void
  showIosInstallHint: boolean
}

export default function SettingsDialog({
  settings,
  onChange,
  onClose,
  onReplayTutorial,
  showIosInstallHint,
}: Props) {
  const update = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) => onChange({ ...settings, [key]: value })

  const [clearingCache, setClearingCache] = useState(false)

  const handleClearCache = async () => {
    setClearingCache(true)
    await clearAppCache()
    window.location.reload()
  }

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
          min="72"
          max="104"
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
      <div className="settings-actions">
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
      <button
        type="button"
        className="screen-button screen-button-secondary"
        disabled={clearingCache}
        onClick={() => void handleClearCache()}
      >
        {clearingCache ? 'Clearing Cache…' : 'Clear Cache'}
      </button>
      <p className="setting-hint">
        This device caches the game for offline play. Clear it if you're stuck
        on an old version.
      </p>
      {showIosInstallHint && (
        <p className="setting-hint">
          To install: tap Share, then "Add to Home Screen".
        </p>
      )}
      <p className="disclaimer">
        This is an independent game and is not affiliated with or endorsed by
        the owners of Pang or Buster Bros.
      </p>
    </div>
  )
}
