# Phase 1-4. Game End

## Goal

- Show the end screen on game over/clear, and implement the restart/return-to-main flow

## Design

- Show the title "Game Clear" on the end screen if the last stage is cleared, "Time Over" if the stage's time budget ran out, or "Game Over" if HP reaches 0 from a hit — distinguishing the two loss causes (`gameOverReason` in `App.tsx`, threaded from `GamePlay`'s `onGameOver(score, reason?)`) so a time-out death doesn't read as a generic loss
- The end screen also shows this play's final score along with the locally stored high score (see `docs/design/phase4_2.md`)
- The high score is updated by comparing against the current score at the moment the end screen is entered, so if this run is a new record, the updated value is shown immediately
- Clicking the "Main" button returns to the main screen (Phase 1-1); to start the game again, the player goes through the game-selection screen (Phase 1-2) again (there is no separate "Restart" button)
