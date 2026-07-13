# Phase 3-3. Layout Patterns

> This is a draft. Details will be finalized after discussion.

## Goal

- Design various ball layout patterns to encourage strategic play

## Design

- Stage-starting balls begin at x positions evenly distributed across the screen width
- Adjacent balls are arranged with horizontal velocities in opposite directions so they don't overlap early on
- A platform-style obstacle is placed fixed at the center height of the screen: balls bounce off its top/bottom faces, and harpoons are blocked and despawn on it (referencing the obstacle element from the original Pang)
- Each stage uses a background themed around a different world landmark. Referencing the original Pang's actual stage order (Mt. Fuji -> Guilin -> Emerald Temple -> Angkor Wat -> Ayers Rock...), the 5 stages are: Stage 1 Mt. Fuji (Japan), Stage 2 Guilin (China), Stage 3 Emerald Temple (Thailand), Stage 4 Angkor Wat (Cambodia), Stage 5 Ayers Rock (Australia)
