export type ReleaseNote = {
  version: string
  date: string
  notes: string[]
}

// Newest first. Written for players, not developers — keep it short and
// skip internal-only changes (chores, test-only commits). Only the most
// recent releases are kept; older entries can be dropped.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '1.15.0',
    date: '2026-07-17',
    notes: [
      '20 more stages! Hell (81-90) adds periodic lava-burst floor zones, and Void (91-100) drops gravity to near-zero — the game now runs 100 stages deep.',
      'Cosmic Frontier (61-70) reworked into one continuous "flight into a nebula" theme, with a new hazard (Nebula Field) and a new item, Nova Surge, that doubles score gained from hitting balls for 10 seconds.',
    ],
  },
  {
    version: '1.14.0',
    date: '2026-07-17',
    notes: [
      '20 new stages! World Tour II (21-30) adds 10 more real-world landmarks, and the game now ends with Vortex Frontier (71-80) — a spinning gravity well that curves balls into an orbit.',
      'Every stage from 21 onward shifted up by 10 to make room: Dimension X is now 31-40, The Trench 41-50, Stellar Forge 51-60, Cosmic Frontier 61-70.',
    ],
  },
  {
    version: '1.13.0',
    date: '2026-07-17',
    notes: [
      '10 new stages! Cosmic Frontier travels outward from the solar system through the galaxy into deep space, ending on a Hellfire finale.',
    ],
  },
  {
    version: '1.12.1',
    date: '2026-07-17',
    notes: [
      'Fixed AI Play permanently freezing if it died on stage 1 (the attract loop now always recovers, no matter which stage it dies on).',
    ],
  },
  {
    version: '1.12.0',
    date: '2026-07-17',
    notes: [
      'AI Play clears balls much faster now — it commits to shots instead of over-cautiously avoiding the very ball it just aimed at.',
      'AI Play also plays smarter around items: no false predictions during Clock/Hourglass, and it plays fearless while Invincible is active.',
    ],
  },
  {
    version: '1.11.0',
    date: '2026-07-17',
    notes: [
      'AI Play dodges much more reliably now — it plans further ahead and searches for genuinely safe ground instead of just nudging away from danger.',
    ],
  },
  {
    version: '1.10.0',
    date: '2026-07-17',
    notes: [
      'Watch AI Play is a real playthrough now: the AI takes damage, dodges incoming balls, and can lose a run — no more scripted invincibility.',
    ],
  },
]
