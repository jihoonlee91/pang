# Phase 4-4. Polish

> This is a draft. Details will be finalized after discussion.

## Goal

- Finish up polish with sound/effects and other presentation elements

## Design

- Sound/BGM are implemented by synthesizing directly with Web Audio API oscillators, without using copyrighted external audio
  - Sound effects: ball hit (pitch varies by level), player hit, stage clear, game over
  - BGM: background music that loops a short arpeggio pattern at low volume; playback starts after the first user interaction (clicking the start button), per browser autoplay policy
- Visual graphics are improved as follows
  - Background: a vertical gradient plus a ground line instead of a flat color
  - Balls: different colors per level (small = pink, medium = green, large = blue) plus a radial gradient for a sense of depth
  - Player: gradient coloring, with a glow effect during invulnerability
  - Harpoon: rendered as a line with a glow effect
