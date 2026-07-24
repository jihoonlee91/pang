# Phase 6-11: Chapter World-Jump Transition

## Goal

Turn every ten-stage boundary into a visible journey to a new world instead of
moving directly from the milestone certificate to the ordinary stage countdown.

## Flow

- Clearing stages 10, 20, ... 190 keeps the existing achievement certificate.
- Continuing from that certificate opens a dedicated `World Jump` screen.
- The sequence lasts about four seconds: the completed world recedes, a portal
  expands around the player route, and the next chapter's colored horizon
  resolves with its chapter name and first stage title.
- Space, Enter, or the on-screen button skips immediately to the existing
  five-second stage-clear countdown. The animation also auto-advances.
- Stage 200 retains the bespoke hidden-stage reveal instead of using this
  generic transition.

## Visual language

- Use CSS-rendered star streaks, concentric gate rings, energy shards, and two
  opposing world horizons. Do not place this art over the gameplay Canvas.
- Destination color follows the same environment classification as the player
  outfit: travel amber, trench cyan, space blue, heat orange, toxic lime,
  alpine ice, rift violet, and hidden-eclipse magenta.
- Keep all important copy readable without animation and disable large movement
  under `prefers-reduced-motion`.

## Constraints

- Do not change stage unlocking, score, milestone timing, or gameplay physics.
- Chapter labels are derived from the actual destination stage title, with
  explicit labels for the three country-based world-tour blocks.
- The transition must clean up its timer when skipped or unmounted so it cannot
  advance twice.
