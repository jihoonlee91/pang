import type { GameSettings } from './settings'

let audioCtx: AudioContext | null = null
let bgmTimer: ReturnType<typeof setInterval> | null = null
let masterVolume = 0.8
let musicVolume = 0.45
let effectsVolume = 0.8

export function configureAudio(settings: GameSettings) {
  masterVolume = settings.masterVolume
  musicVolume = settings.musicVolume
  effectsVolume = settings.effectsVolume
}

export function unlockAudio() {
  const context = getContext()
  void context?.resume().catch(() => undefined)
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtor) return null
    audioCtx = new AudioCtor()
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => undefined)
  }
  return audioCtx
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType,
  volume: number,
  delaySec = 0,
  music = false,
) {
  const ctx = getContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq

  const startTime = ctx.currentTime + delaySec
  const channelVolume = music ? musicVolume : effectsVolume
  gain.gain.setValueAtTime(volume * masterVolume * channelVolume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + durationSec)
}

export function playHitSound(level: number) {
  const freq = 440 + (2 - level) * 220
  playTone(freq, 0.15, 'square', 0.06)
}

export function playPlayerHitSound() {
  playTone(180, 0.3, 'sawtooth', 0.08)
}

export function playClearSound() {
  ;[523, 659, 784, 1047].forEach((freq, i) => {
    playTone(freq, 0.2, 'triangle', 0.07, i * 0.12)
  })
}

// A longer, brighter fanfare for milestone (every-10-stage) and full-game
// clears, distinct from the brief per-stage playClearSound jingle.
export function playVictoryFanfare() {
  ;[523, 659, 784, 1047, 1319, 1047, 1319, 1568].forEach((freq, i) => {
    playTone(freq, 0.28, 'triangle', 0.08, i * 0.11)
  })
  ;[261, 329, 392].forEach((freq, i) => {
    playTone(freq, 0.9, 'sine', 0.05, i * 0.11)
  })
}

export function playGameOverSound() {
  ;[392, 330, 262, 196].forEach((freq, i) => {
    playTone(freq, 0.3, 'sawtooth', 0.07, i * 0.15)
  })
}

export function playItemSound() {
  playTone(880, 0.12, 'sine', 0.07)
  playTone(1320, 0.12, 'sine', 0.06, 0.08)
}

// One note pattern per world-tour stage theme (Fuji, Guilin, Emerald Temple,
// Angkor Wat, Ayers Rock). These are original abstract arpeggios chosen for
// mood (bright/exotic/stately/spacious), not real traditional melodies.
const BGM_PATTERNS = [
  [262, 294, 330, 392, 440, 392, 330, 294],
  [294, 330, 392, 440, 494, 440, 392, 330],
  [262, 311, 349, 392, 466, 392, 349, 311],
  [220, 262, 294, 330, 294, 262, 220, 196],
  [196, 294, 196, 392, 196, 294, 196, 392],
]

export function startBgm(stageIndex = 0) {
  const ctx = getContext()
  if (!ctx) return
  stopBgm()

  const pattern = BGM_PATTERNS[stageIndex % BGM_PATTERNS.length]
  let i = 0
  bgmTimer = setInterval(() => {
    playTone(pattern[i % pattern.length], 0.35, 'sine', 0.035, 0, true)
    i += 1
  }, 400)
}

export function stopBgm() {
  if (bgmTimer) {
    clearInterval(bgmTimer)
    bgmTimer = null
  }
}
