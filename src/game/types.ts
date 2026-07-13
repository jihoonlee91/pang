export type Ball = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  level: number
}

export type Harpoon = {
  x: number
  y: number
}

export type ItemType =
  'doubleWire' | 'clock' | 'hourglass' | 'barrier' | 'oneUp' | 'dynamite'

export type Item = {
  id: number
  x: number
  y: number
  vy: number
  type: ItemType
}

export type StageResult = 'clear' | 'gameover'
