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
    version: '1.23.0',
    date: '2026-07-20',
    notes: [
      'Watch AI Play got a pro-gamer upgrade: it now only fires shots it has verified will land, dodges using every ball’s full flight path (not just where it will drop), knows which power-ups are worth a detour — and which dynamite grabs are suicide — and plays under the real stage time limit, pacing itself against the clock.',
    ],
  },
  {
    version: '1.22.0',
    date: '2026-07-20',
    notes: [
      "What's New now opens on its own the first time you load the game after an update, instead of waiting for you to check Settings.",
      "Every 10th stage's certificate screen now shows how you're tracking against your personal best score.",
    ],
  },
  {
    version: '1.21.5',
    date: '2026-07-20',
    notes: [
      'Drag-to-move now reaches the screen edges reliably — holding your finger near the left/right edge walks the ship all the way there instead of stalling partway.',
    ],
  },
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
]
