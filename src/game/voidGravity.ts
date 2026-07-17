export const VOID_START_STAGE = 90
export const VOID_STAGE_COUNT = 10

// Near-zero gravity for the Void stages (91-100, 0-indexed 90-99) — balls
// drift and barely fall instead of arcing down predictably, so landing
// spots have to be read completely differently than every earlier stage.
// Gravity gets even weaker (floatier, harder to predict) across the block.
export function getStageGravityScale(stageIndex: number): number {
  if (
    stageIndex < VOID_START_STAGE ||
    stageIndex >= VOID_START_STAGE + VOID_STAGE_COUNT
  ) {
    return 1
  }

  const depth = stageIndex - VOID_START_STAGE
  return Math.max(0.08, 0.22 - depth * 0.015)
}
