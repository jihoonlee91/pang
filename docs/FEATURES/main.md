# Main Screen Features

## Purpose

Defines the first screen shown when entering the game and its flow.

## Components

- Title (PANG, with a gradient shimmer animation)
- "Select Game" button

## Flow

In the initial design, when there was only one mission, clicking the start button led directly to the
play screen. But once a separate game-selection screen was introduced in Phase 1-2, the flow was
finalized as follows (see `docs/design/phase1_2.md`, `docs/design/phase1_3.md`).

1. Show the main screen when the game loads
2. Click the "Select Game" button -> transition to the game selection screen
3. Click the "Mission 1" button on the game selection screen -> transition directly to the gameplay screen (since there's only one mission, selecting and starting are combined into a single action)

The end screen shown after game over/clear and the restart flow are covered in `docs/design/phase1_4.md`.
