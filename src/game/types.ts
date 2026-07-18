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
  baseY?: number
  kind?: 'normal' | 'powerWire' | 'vulcan'
  expiresAt?: number
}

export type ItemType =
  | 'doubleWire'
  | 'powerWire'
  | 'vulcan'
  | 'clock'
  | 'hourglass'
  | 'barrier'
  | 'oneUp'
  | 'dynamite'
  | 'speedBoost'
  | 'invincible'
  | 'timePlus'
  | 'scoreBonus'
  | 'stabilizer'
  | 'novaSurge'
  | 'fireproof'
  | 'anchor'

export type Item = {
  id: number
  x: number
  y: number
  vy: number
  type: ItemType
}

export type StageResult = 'clear' | 'gameover'
