export const FIXED_DELTA_SECONDS = 1 / 60
export const MAX_FRAME_DELTA_SECONDS = 0.1

export function advanceFixedStep(
  accumulator: number,
  frameDelta: number,
  fixedDelta = FIXED_DELTA_SECONDS,
  maxFrameDelta = MAX_FRAME_DELTA_SECONDS,
  maxUpdates = 6,
) {
  const clampedFrame = Math.min(Math.max(frameDelta, 0), maxFrameDelta)
  const available = accumulator + clampedFrame
  const updates = Math.min(Math.floor(available / fixedDelta), maxUpdates)
  return {
    updates,
    accumulator: available - updates * fixedDelta,
  }
}
