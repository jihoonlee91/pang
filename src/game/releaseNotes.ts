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
    version: '1.9.0',
    date: '2026-07-17',
    notes: [
      'New item: Stabilizer. From stage 31 onward, it neutralizes the current/gravity-well hazard for 8 seconds.',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-07-17',
    notes: ['Added this "What\'s New" screen, in Settings.'],
  },
  {
    version: '1.7.2',
    date: '2026-07-17',
    notes: [
      'Browsers with weak install support (Samsung Internet, Firefox) now suggest switching to Chrome for the smoothest setup.',
    ],
  },
  {
    version: '1.7.1',
    date: '2026-07-17',
    notes: ['Samsung Internet now gets its own install instructions.'],
  },
  {
    version: '1.7.0',
    date: '2026-07-17',
    notes: [
      'Item buff timers blink red once 3 seconds or less remain, so an effect running out is never a surprise.',
    ],
  },
  {
    version: '1.6.1',
    date: '2026-07-17',
    notes: ['Background music volume raised slightly.'],
  },
  {
    version: '1.6.0',
    date: '2026-07-17',
    notes: [
      'Added an "Install App" button on the main screen, plus an install hint for iOS Safari.',
    ],
  },
]
