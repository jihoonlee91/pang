import { describe, expect, it } from 'vitest'
import { canvasDisplaySize, pointerToCanvas } from './layout'

describe('responsive canvas layout', () => {
  it('letterboxes without changing the logical aspect ratio', () => {
    expect(canvasDisplaySize(390, 500)).toEqual({
      width: 390,
      height: 219,
      scale: 0.40625,
    })
  })

  it('maps CSS pixels back to logical coordinates', () => {
    expect(
      pointerToCanvas(195, 109.5, { left: 0, top: 0, width: 390, height: 219 }),
    ).toEqual({ x: 480, y: 270 })
  })
})
