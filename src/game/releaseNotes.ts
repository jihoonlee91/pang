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
  {
    version: '1.18.0',
    date: '2026-07-19',
    notes: [
      'Three new items: Magnet pulls dropped items toward you, Combo Lock keeps your combo alive even if you miss the timing window, and Shockwave instantly splits every ball on screen for a burst of score.',
    ],
  },
  {
    version: '1.17.0',
    date: '2026-07-19',
    notes: [
      'Vulcan (rapid-fire) no longer drops past stage 30 — it made the early-mid game too easy, so it now steps aside for the harder stages after.',
      'Power Harpoon shows up twice as often now, but each pickup is a shorter, punchier 6 seconds instead of 12.',
    ],
  },
  {
    version: '1.16.3',
    date: '2026-07-19',
    notes: [
      "Fixed a timing bug where the 3-second start invulnerability could already be expired the instant a new stage began, letting Hell's fire zones (or balls) hit before you'd even had a chance to move.",
      "Hell's fire zones now telegraph longer and clearer before igniting — a visibly rising glow previews where and how tall the flame will be, instead of a brief blinking floor strip.",
      'Running out of time now shows "Time Over" on the end screen instead of a generic "Game Over", so it\'s clear why the run ended.',
    ],
  },
]
