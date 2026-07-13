import type { StageResult } from './types'

const KEY = 'pang_scores'
const NAME_KEY = 'pang_player_name'
const MAX_ENTRIES = 50
const DEFAULT_NAME = 'Player'

export type ScoreEntry = {
  score: number
  stageReached: number
  result: StageResult
  playedAt: string
  name: string
}

export function getPlayerName(): string {
  return localStorage.getItem(NAME_KEY) ?? DEFAULT_NAME
}

export function setPlayerName(name: string): void {
  const trimmed = name.trim()
  localStorage.setItem(NAME_KEY, trimmed.length > 0 ? trimmed : DEFAULT_NAME)
}

export function loadScoreHistory(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function recordScore(entry: Omit<ScoreEntry, 'name'>): {
  history: ScoreEntry[]
  rank: number
  entry: ScoreEntry
} {
  const fullEntry: ScoreEntry = { ...entry, name: getPlayerName() }
  const combined = [...loadScoreHistory(), fullEntry].sort(
    (a, b) => b.score - a.score,
  )
  const rank = combined.indexOf(fullEntry) + 1
  const trimmed = combined.slice(0, MAX_ENTRIES)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
  return { history: trimmed, rank, entry: fullEntry }
}

export function renameEntry(playedAt: string, name: string): ScoreEntry[] {
  setPlayerName(name)
  const history = loadScoreHistory()
  const index = history.findIndex((e) => e.playedAt === playedAt)
  if (index !== -1) {
    history[index] = { ...history[index], name: getPlayerName() }
    localStorage.setItem(KEY, JSON.stringify(history))
  }
  return history
}
