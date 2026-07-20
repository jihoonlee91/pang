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
    version: '1.21.4',
    date: '2026-07-20',
    notes: [
      'Fixed drag-to-move outside the game screen sometimes not registering on a single touch — a page-scroll gesture was quietly competing with it.',
    ],
  },
  {
    version: '1.21.3',
    date: '2026-07-20',
    notes: [
      'Firing is now exclusively the Fire button (tapping/dragging to move never fires by accident anymore), and holding Fire no longer interferes with a drag-to-move happening at the same time.',
    ],
  },
  {
    version: '1.21.2',
    date: '2026-07-19',
    notes: [
      'In portrait mode, you can now swipe left/right anywhere below the game screen (not just directly on it) to move your ship — no more reaching for a small letterboxed canvas.',
    ],
  },
  {
    version: '1.21.1',
    date: '2026-07-19',
    notes: [
      'Stage Map now has a "Jump to stage" quick-nav, so finding a specific stage in the now much longer list takes one search instead of a long scroll.',
    ],
  },
  {
    version: '1.21.0',
    date: '2026-07-19',
    notes: [
      'The game now goes all the way to stage 150! Five new theme blocks: Toxic Marsh (telegraphed acid rain), Frozen Summit (icy gusts that push you sideways), Solar Storm (a screen-wide flare that slows you down), Quantum Rift (balls that randomly phase-jump), and the finale Overdrive Nexus (twin gravity wells that flip between pulling and pushing).',
      'Five new items pair with the new hazards: Umbrella, Grip Boots, Visor, Lock-On, and the capstone Overdrive (blocks all hazard damage and boosts your score for 8 seconds).',
    ],
  },
  {
    version: '1.20.0',
    date: '2026-07-19',
    notes: [
      'New Glossary page (from the main menu) shows every item and map hazard with its actual in-game icon and what it does.',
      'The first time you reach a stage with a brand-new hazard, a one-time popup explains it before you have to figure it out the hard way.',
    ],
  },
  {
    version: '1.19.0',
    date: '2026-07-19',
    notes: [
      'The main screen now shows how far you\'ve unlocked ("Unlocked: Stage N / 100") and adds a "Continue" button that jumps straight into your highest unlocked stage.',
    ],
  },
]
