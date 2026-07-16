export type InputAction = 'left' | 'right' | 'fire'

export type InputSnapshot = Record<InputAction, boolean>

const EMPTY_INPUT: InputSnapshot = { left: false, right: false, fire: false }

export class InputController {
  private sources = new Map<string, InputSnapshot>()
  private fireQueued = false

  set(source: string, action: InputAction, pressed: boolean) {
    const current = this.sources.get(source) ?? { ...EMPTY_INPUT }
    this.sources.set(source, { ...current, [action]: pressed })
  }

  release(source: string) {
    this.sources.delete(source)
  }

  releaseAll() {
    this.sources.clear()
    this.fireQueued = false
  }

  queueFire() {
    this.fireQueued = true
  }

  consumeFire() {
    const queued = this.fireQueued
    this.fireQueued = false
    return queued
  }

  snapshot(): InputSnapshot {
    const result = { ...EMPTY_INPUT }
    for (const input of this.sources.values()) {
      result.left ||= input.left
      result.right ||= input.right
      result.fire ||= input.fire
    }
    return result
  }
}
