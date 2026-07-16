export type GameSettings = {
  masterVolume: number
  musicVolume: number
  effectsVolume: number
  touchButtonSize: number
  touchButtonOpacity: number
  reducedMotion: boolean
  screenShake: boolean
  vibration: boolean
  showFps: boolean
}

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  musicVolume: 0.45,
  effectsVolume: 0.8,
  touchButtonSize: 68,
  touchButtonOpacity: 0.82,
  reducedMotion: false,
  screenShake: true,
  vibration: true,
  showFps: false,
}

const KEY = 'pang.settings.v1'

export function loadSettings(): GameSettings {
  try {
    const stored = JSON.parse(
      localStorage.getItem(KEY) ?? '{}',
    ) as Partial<GameSettings>
    return { ...DEFAULT_SETTINGS, ...stored }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: GameSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings))
}
