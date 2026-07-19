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
    version: '1.16.3',
    date: '2026-07-19',
    notes: [
      "Fixed a timing bug where the 3-second start invulnerability could already be expired the instant a new stage began, letting Hell's fire zones (or balls) hit before you'd even had a chance to move.",
      "Hell's fire zones now telegraph longer and clearer before igniting — a visibly rising glow previews where and how tall the flame will be, instead of a brief blinking floor strip.",
      'Running out of time now shows "Time Over" on the end screen instead of a generic "Game Over", so it\'s clear why the run ended.',
    ],
  },
  {
    version: '1.16.2',
    date: '2026-07-18',
    notes: [
      'Raised the minimum stage time budget from 12 to 20 seconds — the old floor left barely enough time to land the hits needed to clear a full board of balls, even with perfect aim.',
    ],
  },
  {
    version: '1.16.1',
    date: '2026-07-18',
    notes: [
      'Fixed Clock and Hourglass not affecting the stage timer — the clock now stops while Clock is active and slows to match while Hourglass is active, instead of counting down at normal speed.',
    ],
  },
  {
    version: '1.16.0',
    date: '2026-07-18',
    notes: [
      'Platform layouts stopped repeating the same shape past stage 20 — 8 distinct hand-designed arrangements now cycle across stages 21-100.',
      'Two new items: Fireproof (Hell, stage 81+) grants brief immunity to fire zones, and Anchor (Void, stage 91+) briefly restores normal gravity.',
      'Fixed ball speed climbing unbounded past stage 80 — it now caps at the same speed as the original 80-stage design, so Hell and Void stay winnable.',
    ],
  },
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
]
