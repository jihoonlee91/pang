import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'

export function canvasDisplaySize(
  availableWidth: number,
  availableHeight: number,
) {
  const scale = Math.max(
    0,
    Math.min(availableWidth / CANVAS_WIDTH, availableHeight / CANVAS_HEIGHT),
  )
  return {
    width: Math.floor(CANVAS_WIDTH * scale),
    height: Math.floor(CANVAS_HEIGHT * scale),
    scale,
  }
}

export function pointerToCanvas(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
) {
  return {
    x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  }
}
