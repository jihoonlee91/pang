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
} | null

export type StageResult = 'clear' | 'gameover'
