const SEEN_HAZARDS_KEY = 'pang.seen_hazards.v1'

function readSeenIds(): Set<string> {
  try {
    const stored = JSON.parse(
      localStorage.getItem(SEEN_HAZARDS_KEY) ?? '[]',
    ) as unknown
    return new Set(Array.isArray(stored) ? stored : [])
  } catch {
    return new Set()
  }
}

export function hasSeenHazard(id: string): boolean {
  return readSeenIds().has(id)
}

export function markHazardSeen(id: string): void {
  const seen = readSeenIds()
  seen.add(id)
  localStorage.setItem(SEEN_HAZARDS_KEY, JSON.stringify([...seen]))
}
