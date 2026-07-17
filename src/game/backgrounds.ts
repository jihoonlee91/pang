import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'
import neuschwansteinUrl from '../assets/backgrounds/stage11-neuschwanstein.webp'
import colosseumUrl from '../assets/backgrounds/stage12-colosseum.webp'
import santoriniUrl from '../assets/backgrounds/stage13-santorini.webp'
import sagradaFamiliaUrl from '../assets/backgrounds/stage14-sagrada-familia.webp'
import marrakeshUrl from '../assets/backgrounds/stage15-marrakesh.webp'
import serengetiUrl from '../assets/backgrounds/stage16-serengeti.webp'
import rioUrl from '../assets/backgrounds/stage17-rio.webp'
import machuPicchuUrl from '../assets/backgrounds/stage18-machu-picchu.webp'
import grandCanyonUrl from '../assets/backgrounds/stage19-grand-canyon.webp'
import auroraVillageUrl from '../assets/backgrounds/stage20-aurora-village.webp'

export const GROUND_Y = CANVAS_HEIGHT - 90
export const BACKGROUND_READY_EVENT = 'pang-background-ready'

export const STAGE_NAMES = [
  'Mt. Fuji (Japan)',
  'Guilin (China)',
  'Emerald Temple (Thailand)',
  'Angkor Wat (Cambodia)',
  'Ayers Rock (Australia)',
  'Taj Mahal (India)',
  'Pyramids of Giza (Egypt)',
  'Eiffel Tower (France)',
  'Big Ben (UK)',
  'Red Square (Russia)',
  'Neuschwanstein (Germany)',
  'Colosseum (Italy)',
  'Santorini (Greece)',
  'Sagrada Familia (Spain)',
  'Marrakesh (Morocco)',
  'Serengeti (Tanzania)',
  'Christ the Redeemer (Brazil)',
  'Machu Picchu (Peru)',
  'Grand Canyon (USA)',
  'Aurora Village (Canada)',
  'Great Wall of China (China)',
  'Petra (Jordan)',
  'Sydney Opera House (Australia)',
  'Statue of Liberty (USA)',
  'Niagara Falls (Canada)',
  'Chichen Itza (Mexico)',
  'Venice Canals (Italy)',
  'Table Mountain (South Africa)',
  'Geysir (Iceland)',
  'Milford Sound (New Zealand)',
  'Neon Megacity (Dimension X)',
  'Orbital Dock (Dimension X)',
  'Crystal Moon (Dimension X)',
  'Cyber Desert (Dimension X)',
  'Quantum Reactor (Dimension X)',
  'Void Cathedral (Dimension X)',
  'Plasma Ocean (Dimension X)',
  'Clockwork Nebula (Dimension X)',
  'Singularity Gate (Dimension X)',
  'Orbit Core (Dimension X)',
  'Kelp Gate (The Trench)',
  'Bioluminescent Shoal (The Trench)',
  'Sunken Galleon (The Trench)',
  'Coral Spires (The Trench)',
  'Jellyfish Current (The Trench)',
  'Thermal Vent (The Trench)',
  'Anglerfish Deep (The Trench)',
  'Pressure Ridge (The Trench)',
  'Abyssal Plain (The Trench)',
  'The Trench Floor (The Trench)',
  'Ember Nebula (Stellar Forge)',
  'Comet Fields (Stellar Forge)',
  'Forge Ring (Stellar Forge)',
  'Collapsing Star (Stellar Forge)',
  'Molten Asteroid Belt (Stellar Forge)',
  'Solar Furnace (Stellar Forge)',
  'Nova Remnant (Stellar Forge)',
  'Event Horizon (Stellar Forge)',
  'The Last Forge (Stellar Forge)',
  'Orbit Star (Stellar Forge)',
  'Inner Orbit (Solar System)',
  'Asteroid Belt (Solar System)',
  'Ringed Giant (Solar System)',
  'Spiral Arm (Galaxy)',
  'Star Nursery (Galaxy)',
  'Galactic Core (Galaxy)',
  'Silent Void (Deep Space)',
  'Dark Expanse (Deep Space)',
  'Edge of Everything (Deep Space)',
  'Hellfire Core (Cosmic Frontier)',
  'Event Horizon Prime (Vortex Frontier)',
  'Wormhole Threshold (Vortex Frontier)',
  'Shattered Moon (Vortex Frontier)',
  'Ion Storm (Vortex Frontier)',
  'Binary Collapse (Vortex Frontier)',
  'Comet Maelstrom (Vortex Frontier)',
  'Graviton Well (Vortex Frontier)',
  'Pulsar Vortex (Vortex Frontier)',
  'Nebula Funnel (Vortex Frontier)',
  'The Singularity (Vortex Frontier)',
]

function drawSky(ctx: CanvasRenderingContext2D, top: string, bottom: string) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y)
  sky.addColorStop(0, top)
  sky.addColorStop(1, bottom)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  top: string,
  bottom: string,
) {
  const ground = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT)
  ground.addColorStop(0, top)
  ground.addColorStop(1, bottom)
  ctx.fillStyle = ground
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y)
}

function drawJapanBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#7dc8f0', '#cdeafd')

  ctx.fillStyle = '#ffffffaa'
  ctx.beginPath()
  ctx.ellipse(120, 90, 34, 16, 0, 0, Math.PI * 2)
  ctx.ellipse(160, 80, 26, 14, 0, 0, Math.PI * 2)
  ctx.ellipse(740, 130, 30, 15, 0, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const topY = baseY - 220
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#7a86a8'
  ctx.beginPath()
  ctx.moveTo(cx - 220, baseY)
  ctx.lineTo(cx, topY)
  ctx.lineTo(cx + 220, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(cx, topY)
  ctx.lineTo(cx + 38, topY + 60)
  ctx.lineTo(cx + 14, topY + 50)
  ctx.lineTo(cx - 2, topY + 70)
  ctx.lineTo(cx - 22, topY + 46)
  ctx.lineTo(cx - 40, topY + 58)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#7cc86e', '#4f9b45')
}

function drawKarstPeak(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number,
  height: number,
  color: string,
) {
  const top = baseY - height
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx - width / 2, baseY)
  ctx.bezierCurveTo(
    cx - width / 2,
    top + height * 0.5,
    cx - width * 0.22,
    top + height * 0.1,
    cx,
    top,
  )
  ctx.bezierCurveTo(
    cx + width * 0.22,
    top + height * 0.1,
    cx + width / 2,
    top + height * 0.5,
    cx + width / 2,
    baseY,
  )
  ctx.closePath()
  ctx.fill()
}

function drawGuilinBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#bfe3e0', '#eaf6f2')

  ctx.fillStyle = '#ffffff88'
  ctx.beginPath()
  ctx.ellipse(700, 110, 60, 14, 0, 0, Math.PI * 2)
  ctx.ellipse(150, 160, 70, 16, 0, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const farPeaks = [
    { cx: 120, w: 160, h: 150 },
    { cx: 320, w: 200, h: 190 },
    { cx: 560, w: 170, h: 160 },
    { cx: 800, w: 210, h: 200 },
  ]
  for (const p of farPeaks) {
    drawKarstPeak(ctx, p.cx, baseY - 20, p.w, p.h, '#9db8ae')
  }

  const nearPeaks = [
    { cx: 220, w: 190, h: 230 },
    { cx: 480, w: 230, h: 260 },
    { cx: 720, w: 200, h: 240 },
  ]
  for (const p of nearPeaks) {
    drawKarstPeak(ctx, p.cx, baseY, p.w, p.h, '#5f8a76')
  }

  const river = ctx.createLinearGradient(0, baseY - 10, 0, baseY + 20)
  river.addColorStop(0, '#cdeee6')
  river.addColorStop(1, '#a9d8cd')
  ctx.fillStyle = river
  ctx.fillRect(0, baseY - 10, CANVAS_WIDTH, 30)

  drawGround(ctx, '#8fbf9a', '#5c9468')
}

function drawEmeraldTempleBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#ffd97a', '#ffe9c2')

  ctx.fillStyle = '#fff3d1'
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH - 130, 90, 44, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  const tiers = [
    { w: 340, h: 26, y: 0 },
    { w: 280, h: 24, y: -60 },
    { w: 220, h: 22, y: -114 },
    { w: 150, h: 20, y: -160 },
  ]
  for (const t of tiers) {
    const y = baseY - 90 + t.y
    ctx.fillStyle = '#c23b3b'
    ctx.beginPath()
    ctx.moveTo(cx - t.w / 2, y + t.h)
    ctx.lineTo(cx, y - t.h * 1.4)
    ctx.lineTo(cx + t.w / 2, y + t.h)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#f2b73a'
    ctx.fillRect(cx - t.w / 2, y + t.h - 6, t.w, 6)
  }

  ctx.fillStyle = '#f2b73a'
  ctx.beginPath()
  ctx.moveTo(cx - 8, baseY - 250)
  ctx.lineTo(cx, baseY - 300)
  ctx.lineTo(cx + 8, baseY - 250)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#e8c98a', '#c9a35f')
}

function drawAngkorWatBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f6b98a', '#ffe3c4')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#8a7156'
  ctx.fillRect(cx - 260, baseY - 70, 520, 70)

  function tower(x: number, height: number, width: number) {
    const y = baseY - 70 - height
    ctx.beginPath()
    ctx.moveTo(x - width / 2, baseY - 70)
    ctx.lineTo(x - width / 2, y + height * 0.35)
    ctx.lineTo(x, y)
    ctx.lineTo(x + width / 2, y + height * 0.35)
    ctx.lineTo(x + width / 2, baseY - 70)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = '#6b5842'
  tower(cx - 200, 90, 55)
  tower(cx + 200, 90, 55)
  ctx.fillStyle = '#7a6449'
  tower(cx - 100, 140, 65)
  tower(cx + 100, 140, 65)
  ctx.fillStyle = '#8a7150'
  tower(cx, 210, 80)

  drawGround(ctx, '#d9be93', '#b3946a')
}

function drawAyersRockBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#ff9d6c', '#ffd9a8')

  ctx.fillStyle = '#ffffffcc'
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH / 2, 100, 46, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const rockGradient = ctx.createLinearGradient(0, baseY - 160, 0, baseY)
  rockGradient.addColorStop(0, '#b5522f')
  rockGradient.addColorStop(1, '#7a3420')
  ctx.fillStyle = rockGradient
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH / 2 - 260, baseY)
  ctx.bezierCurveTo(
    CANVAS_WIDTH / 2 - 200,
    baseY - 150,
    CANVAS_WIDTH / 2 - 80,
    baseY - 170,
    CANVAS_WIDTH / 2,
    baseY - 160,
  )
  ctx.bezierCurveTo(
    CANVAS_WIDTH / 2 + 90,
    baseY - 150,
    CANVAS_WIDTH / 2 + 200,
    baseY - 110,
    CANVAS_WIDTH / 2 + 260,
    baseY,
  )
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#5c2717aa'
  ctx.lineWidth = 3
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2 - 150 + i * 90, baseY - 20 - i * 4)
    ctx.lineTo(CANVAS_WIDTH / 2 - 90 + i * 90, baseY - 90 - i * 6)
    ctx.stroke()
  }

  drawGround(ctx, '#e0925c', '#b56a3c')
}

function drawTajMahalBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#ffcf9e', '#ffe9cf')

  ctx.fillStyle = '#fff3d1'
  ctx.beginPath()
  ctx.arc(120, 100, 42, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#f2ede1'
  ctx.fillRect(cx - 160, baseY - 30, 320, 30)

  function minaret(x: number) {
    ctx.fillRect(x - 8, baseY - 150, 16, 120)
    ctx.beginPath()
    ctx.arc(x, baseY - 150, 8, Math.PI, 0)
    ctx.fill()
  }
  ctx.fillStyle = '#f7f2e6'
  minaret(cx - 150)
  minaret(cx + 150)
  minaret(cx - 110)
  minaret(cx + 110)

  ctx.fillStyle = '#f7f2e6'
  ctx.fillRect(cx - 90, baseY - 190, 180, 130)

  ctx.beginPath()
  ctx.arc(cx, baseY - 190, 90, Math.PI, 0)
  ctx.fill()

  ctx.fillStyle = '#e8dcc0'
  ctx.beginPath()
  ctx.arc(cx, baseY - 260, 26, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(cx - 4, baseY - 300, 8, 40)

  drawGround(ctx, '#8fbf9a', '#5c9468')
}

function drawPyramidsBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#ffd394', '#ffe9c7')

  ctx.fillStyle = '#fff4d6'
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH - 120, 90, 40, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const pyramids = [
    { cx: CANVAS_WIDTH / 2 - 160, height: 170, width: 200, color: '#d9a86a' },
    { cx: CANVAS_WIDTH / 2 + 120, height: 130, width: 160, color: '#c9925a' },
    { cx: CANVAS_WIDTH / 2 - 20, height: 210, width: 240, color: '#e0b57a' },
  ]
  for (const p of pyramids) {
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.moveTo(p.cx - p.width / 2, baseY)
    ctx.lineTo(p.cx, baseY - p.height)
    ctx.lineTo(p.cx + p.width / 2, baseY)
    ctx.closePath()
    ctx.fill()
  }

  drawGround(ctx, '#e6c58a', '#c9a35f')
}

function drawEiffelTowerBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#8ca9d6', '#dbe6f5')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2
  const topY = baseY - 300

  ctx.fillStyle = '#5b5f6b'
  ctx.beginPath()
  ctx.moveTo(cx - 90, baseY)
  ctx.lineTo(cx - 24, baseY - 140)
  ctx.lineTo(cx - 30, baseY - 140)
  ctx.lineTo(cx - 10, baseY - 230)
  ctx.lineTo(cx - 12, baseY - 230)
  ctx.lineTo(cx, topY)
  ctx.lineTo(cx + 12, baseY - 230)
  ctx.lineTo(cx + 10, baseY - 230)
  ctx.lineTo(cx + 30, baseY - 140)
  ctx.lineTo(cx + 24, baseY - 140)
  ctx.lineTo(cx + 90, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#5b5f6b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx - 60, baseY - 60)
  ctx.lineTo(cx + 60, baseY - 60)
  ctx.moveTo(cx - 35, baseY - 150)
  ctx.lineTo(cx + 35, baseY - 150)
  ctx.stroke()

  drawGround(ctx, '#c9c9d1', '#9a9aa5')
}

function drawBigBenBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#aab4bd', '#d8dee3')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2
  const towerWidth = 90
  const towerTop = baseY - 260

  ctx.fillStyle = '#8a7a5c'
  ctx.fillRect(cx - towerWidth / 2, towerTop, towerWidth, baseY - towerTop)

  ctx.fillStyle = '#a89572'
  ctx.beginPath()
  ctx.moveTo(cx - towerWidth / 2 - 6, towerTop)
  ctx.lineTo(cx, towerTop - 70)
  ctx.lineTo(cx + towerWidth / 2 + 6, towerTop)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#f2ede1'
  ctx.beginPath()
  ctx.arc(cx, towerTop + 50, 24, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#3a3226'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx, towerTop + 50)
  ctx.lineTo(cx, towerTop + 34)
  ctx.moveTo(cx, towerTop + 50)
  ctx.lineTo(cx + 14, towerTop + 50)
  ctx.stroke()

  drawGround(ctx, '#9aa7ad', '#71818a')
}

function drawRedSquareBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#8fa8d6', '#c9d8ee')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#c94f4f'
  ctx.fillRect(cx - 200, baseY - 90, 400, 90)

  function onionDome(x: number, height: number, color: string) {
    const domeBaseY = baseY - 90
    ctx.fillStyle = '#e8d9b5'
    ctx.fillRect(x - 12, domeBaseY - height, 24, height)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x - 18, domeBaseY - height)
    ctx.quadraticCurveTo(
      x - 24,
      domeBaseY - height - 30,
      x,
      domeBaseY - height - 46,
    )
    ctx.quadraticCurveTo(
      x + 24,
      domeBaseY - height - 30,
      x + 18,
      domeBaseY - height,
    )
    ctx.closePath()
    ctx.fill()
  }

  onionDome(cx - 120, 60, '#3b8f4f')
  onionDome(cx - 60, 90, '#e0a530')
  onionDome(cx, 130, '#d94f4f')
  onionDome(cx + 60, 90, '#3f7fc4')
  onionDome(cx + 120, 60, '#e0a530')

  drawGround(ctx, '#c9c2a8', '#a89e80')
}

const BASE_BACKGROUNDS = [
  drawJapanBackground,
  drawGuilinBackground,
  drawEmeraldTempleBackground,
  drawAngkorWatBackground,
  drawAyersRockBackground,
  drawTajMahalBackground,
  drawPyramidsBackground,
  drawEiffelTowerBackground,
  drawBigBenBackground,
  drawRedSquareBackground,
]

function drawGreatWallBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#8fb8d8', '#d9ecf5')

  ctx.fillStyle = '#ffffff99'
  ctx.beginPath()
  ctx.ellipse(680, 100, 40, 16, 0, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y
  const ridge = (x: number) => baseY - 60 - Math.sin(x / 130) * 55

  ctx.fillStyle = '#6f9a5c'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  for (let x = 0; x <= CANVAS_WIDTH; x += 20) ctx.lineTo(x, ridge(x) + 40)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#c9a875'
  ctx.lineWidth = 20
  ctx.beginPath()
  ctx.moveTo(0, ridge(0))
  for (let x = 0; x <= CANVAS_WIDTH; x += 20) ctx.lineTo(x, ridge(x))
  ctx.stroke()

  ctx.fillStyle = '#c9a875'
  for (let x = 6; x < CANVAS_WIDTH; x += 24) {
    ctx.fillRect(x - 5, ridge(x) - 20, 10, 10)
  }
  ctx.fillStyle = '#a98955'
  for (let x = 90; x < CANVAS_WIDTH; x += 260) {
    ctx.fillRect(x - 16, ridge(x) - 34, 32, 32)
  }

  drawGround(ctx, '#7cb06a', '#4f8b45')
}

function drawPetraBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f0b98a', '#fbe0bd')

  const baseY = GROUND_Y
  ctx.fillStyle = '#c9704a'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  ctx.lineTo(0, baseY - 320)
  ctx.lineTo(150, baseY - 280)
  ctx.lineTo(120, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH, baseY)
  ctx.lineTo(CANVAS_WIDTH, baseY - 320)
  ctx.lineTo(CANVAS_WIDTH - 150, baseY - 280)
  ctx.lineTo(CANVAS_WIDTH - 120, baseY)
  ctx.closePath()
  ctx.fill()

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#d98a5e'
  ctx.fillRect(cx - 160, baseY - 200, 320, 200)

  ctx.fillStyle = '#c9704a'
  for (const dx of [-130, -75, 75, 130]) {
    ctx.fillRect(cx + dx - 8, baseY - 200, 16, 190)
  }

  ctx.beginPath()
  ctx.moveTo(cx - 170, baseY - 200)
  ctx.lineTo(cx, baseY - 250)
  ctx.lineTo(cx + 170, baseY - 200)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#a85a3a'
  ctx.fillRect(cx - 40, baseY - 130, 80, 130)
  ctx.beginPath()
  ctx.arc(cx, baseY - 130, 40, Math.PI, 0)
  ctx.fill()

  ctx.fillStyle = '#8a4a30'
  ctx.beginPath()
  ctx.ellipse(cx, baseY - 268, 14, 20, 0, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#d9a56f', '#b57a45')
}

function drawSydneyOperaHouseBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#6fc2e0', '#c9ecf7')

  ctx.fillStyle = '#ffffffcc'
  ctx.beginPath()
  ctx.arc(140, 90, 38, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y - 30
  ctx.fillStyle = '#e8e2d5'
  ctx.fillRect(CANVAS_WIDTH / 2 - 280, baseY, 560, 30)

  function shell(x: number, height: number, width: number) {
    ctx.beginPath()
    ctx.moveTo(x - width / 2, baseY)
    ctx.quadraticCurveTo(x - width * 0.15, baseY - height, x, baseY - height)
    ctx.quadraticCurveTo(
      x + width * 0.1,
      baseY - height * 0.6,
      x + width / 2,
      baseY,
    )
    ctx.closePath()
    ctx.fill()
  }
  ctx.fillStyle = '#ffffff'
  shell(CANVAS_WIDTH / 2 - 160, 90, 130)
  shell(CANVAS_WIDTH / 2 - 40, 140, 150)
  shell(CANVAS_WIDTH / 2 + 100, 110, 140)
  shell(CANVAS_WIDTH / 2 + 220, 70, 100)

  ctx.strokeStyle = '#4a6a80'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(140, baseY + 20, 90, Math.PI, Math.PI * 1.6)
  ctx.stroke()

  ctx.fillStyle = '#2f6a8a'
  ctx.fillRect(0, baseY + 30, CANVAS_WIDTH, GROUND_Y - baseY - 30)

  drawGround(ctx, '#2f6a8a', '#1f4a63')
}

function drawStatueOfLibertyBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#a8c8e0', '#e0eef8')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#8a8a7a'
  ctx.beginPath()
  ctx.moveTo(cx - 70, baseY)
  ctx.lineTo(cx - 55, baseY - 60)
  ctx.lineTo(cx + 55, baseY - 60)
  ctx.lineTo(cx + 70, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#5b9c8a'
  ctx.beginPath()
  ctx.moveTo(cx - 30, baseY - 60)
  ctx.quadraticCurveTo(cx - 50, baseY - 170, cx - 18, baseY - 240)
  ctx.lineTo(cx + 18, baseY - 240)
  ctx.quadraticCurveTo(cx + 45, baseY - 170, cx + 30, baseY - 60)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cx, baseY - 258, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#5b9c8a'
  ctx.lineWidth = 4
  for (let spike = -2; spike <= 2; spike += 1) {
    ctx.beginPath()
    ctx.moveTo(cx + spike * 6, baseY - 272)
    ctx.lineTo(cx + spike * 9, baseY - 290)
    ctx.stroke()
  }

  ctx.strokeStyle = '#5b9c8a'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(cx + 22, baseY - 220)
  ctx.lineTo(cx + 55, baseY - 300)
  ctx.stroke()
  ctx.fillStyle = '#f2c14e'
  ctx.beginPath()
  ctx.arc(cx + 58, baseY - 312, 12, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#7fa8c2'
  ctx.fillRect(0, baseY - 6, CANVAS_WIDTH, 6)

  drawGround(ctx, '#7fa8c2', '#4a7590')
}

function drawNiagaraFallsBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#a9c9d9', '#e6f2f5')

  const baseY = GROUND_Y
  ctx.fillStyle = '#6f9a5c'
  ctx.fillRect(0, baseY - 140, 180, 140)
  ctx.fillRect(CANVAS_WIDTH - 180, baseY - 160, 180, 160)

  const cx = CANVAS_WIDTH / 2
  const fall = ctx.createLinearGradient(0, baseY - 220, 0, baseY)
  fall.addColorStop(0, '#eaf6fb')
  fall.addColorStop(1, '#bcdbe6')
  ctx.fillStyle = fall
  ctx.beginPath()
  ctx.moveTo(cx - 260, baseY - 180)
  ctx.quadraticCurveTo(cx - 200, baseY - 220, cx - 60, baseY - 200)
  ctx.quadraticCurveTo(cx + 80, baseY - 230, cx + 250, baseY - 170)
  ctx.lineTo(cx + 220, baseY)
  ctx.lineTo(cx - 230, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#ffffffaa'
  ctx.lineWidth = 2
  for (let i = 0; i < 14; i += 1) {
    const x = cx - 240 + i * 36
    ctx.beginPath()
    ctx.moveTo(x, baseY - 190 + (i % 3) * 8)
    ctx.lineTo(x + 6, baseY)
    ctx.stroke()
  }

  ctx.fillStyle = '#ffffffcc'
  ctx.beginPath()
  ctx.ellipse(cx - 40, baseY - 10, 120, 34, 0, 0, Math.PI * 2)
  ctx.ellipse(cx + 60, baseY, 100, 28, 0, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#8fbf9a', '#5c9468')
}

function drawChichenItzaBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#7dc8e8', '#cdeefd')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#4a8a4f'
  for (let tree = 0; tree < 10; tree += 1) {
    const x = tree * 96 + 20
    const height = 40 + (tree % 3) * 16
    ctx.beginPath()
    ctx.arc(x, baseY - height, 34, 0, Math.PI * 2)
    ctx.fill()
  }

  const tierCount = 5
  for (let tier = 0; tier < tierCount; tier += 1) {
    const w = 260 - tier * 42
    const h = 34
    const y = baseY - 20 - tier * h
    ctx.fillStyle = tier % 2 === 0 ? '#c9a56a' : '#b8935a'
    ctx.fillRect(cx - w / 2, y - h, w, h)
  }
  ctx.fillStyle = '#8a6c40'
  ctx.fillRect(cx - 18, baseY - 20 - tierCount * 34, 36, tierCount * 34)
  ctx.fillStyle = '#a8875a'
  ctx.fillRect(cx - 40, baseY - 20 - tierCount * 34 - 30, 80, 30)

  drawGround(ctx, '#6fa85e', '#457a3f')
}

function drawVeniceCanalsBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f6c98a', '#fde8c4')

  const baseY = GROUND_Y - 40
  const buildings = [
    { x: 0, w: 130, h: 150, color: '#e0956a' },
    { x: 130, w: 110, h: 190, color: '#e8c96a' },
    { x: 240, w: 100, h: 160, color: '#c97a6a' },
    { x: 620, w: 120, h: 170, color: '#d99a6a' },
    { x: 740, w: 150, h: 200, color: '#e8b06a' },
  ]
  for (const b of buildings) {
    ctx.fillStyle = b.color
    ctx.fillRect(b.x, baseY - b.h, b.w, b.h)
    ctx.fillStyle = '#ffffff88'
    for (let wy = baseY - b.h + 20; wy < baseY - 10; wy += 30) {
      for (let wx = b.x + 14; wx < b.x + b.w - 14; wx += 30) {
        ctx.fillRect(wx, wy, 10, 14)
      }
    }
  }

  const cx = CANVAS_WIDTH / 2
  ctx.strokeStyle = '#c9b088'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(cx, baseY + 20, 70, Math.PI, 0)
  ctx.stroke()

  ctx.fillStyle = '#5a8ca0'
  ctx.fillRect(0, baseY, CANVAS_WIDTH, GROUND_Y - baseY + 40)

  ctx.fillStyle = '#1c1c1c'
  ctx.beginPath()
  ctx.moveTo(cx - 220, baseY + 30)
  ctx.quadraticCurveTo(cx - 260, baseY + 20, cx - 250, baseY + 5)
  ctx.lineTo(cx - 160, baseY + 8)
  ctx.quadraticCurveTo(cx - 150, baseY + 25, cx - 180, baseY + 32)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#1c1c1c'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx - 240, baseY + 5)
  ctx.lineTo(cx - 240, baseY - 30)
  ctx.stroke()

  drawGround(ctx, '#5a8ca0', '#3a6a80')
}

function drawTableMountainBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#89b8d8', '#d5eaf5')

  ctx.fillStyle = '#ffffffaa'
  ctx.beginPath()
  ctx.ellipse(700, 90, 60, 14, 0, 0, Math.PI * 2)
  ctx.fill()

  const baseY = GROUND_Y - 60
  ctx.fillStyle = '#6a7a6a'
  ctx.beginPath()
  ctx.moveTo(120, baseY)
  ctx.lineTo(190, baseY - 190)
  ctx.lineTo(620, baseY - 190)
  ctx.lineTo(690, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#5a6a5a'
  ctx.fillRect(190, baseY - 194, 430, 10)

  ctx.fillStyle = '#d9d2c0'
  for (let b = 0; b < 10; b += 1) {
    const x = 40 + b * 74
    const h = 16 + (b % 4) * 10
    ctx.fillRect(x, baseY - h, 40, h)
  }

  ctx.fillStyle = '#3f7a9a'
  ctx.fillRect(0, baseY, CANVAS_WIDTH, GROUND_Y - baseY + 60)

  drawGround(ctx, '#3f7a9a', '#2a5570')
}

function drawGeysirBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#9fb8c9', '#dbe6ec')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2

  ctx.fillStyle = '#8a9a8a'
  ctx.beginPath()
  ctx.moveTo(0, baseY - 30)
  ctx.quadraticCurveTo(200, baseY - 70, 400, baseY - 30)
  ctx.quadraticCurveTo(650, baseY - 60, CANVAS_WIDTH, baseY - 20)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.lineTo(0, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#7a8f95'
  ctx.beginPath()
  ctx.ellipse(cx, baseY - 6, 80, 20, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#eaf3f5'
  ctx.beginPath()
  ctx.moveTo(cx - 20, baseY - 10)
  ctx.quadraticCurveTo(cx - 40, baseY - 160, cx - 10, baseY - 260)
  ctx.quadraticCurveTo(cx, baseY - 300, cx + 10, baseY - 260)
  ctx.quadraticCurveTo(cx + 40, baseY - 160, cx + 20, baseY - 10)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#ffffffaa'
  for (let cloud = 0; cloud < 6; cloud += 1) {
    const x = cx + (cloud - 3) * 50
    const y = baseY - 220 - (cloud % 3) * 30
    ctx.beginPath()
    ctx.ellipse(x, y, 34, 16, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  drawGround(ctx, '#8a8f85', '#5f6a5a')
}

function drawMilfordSoundBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#8ba8b8', '#d5e5ea')

  const baseY = GROUND_Y - 40
  ctx.fillStyle = '#4a5f5a'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  ctx.lineTo(0, baseY - 280)
  ctx.lineTo(220, baseY - 180)
  ctx.lineTo(160, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#3a4f4a'
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH, baseY)
  ctx.lineTo(CANVAS_WIDTH, baseY - 320)
  ctx.lineTo(CANVAS_WIDTH - 260, baseY - 200)
  ctx.lineTo(CANVAS_WIDTH - 190, baseY)
  ctx.closePath()
  ctx.fill()

  const fall = ctx.createLinearGradient(0, baseY - 260, 0, baseY)
  fall.addColorStop(0, '#eaf6fb')
  fall.addColorStop(1, '#bcdbe6')
  ctx.fillStyle = fall
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH - 250, baseY - 240)
  ctx.lineTo(CANVAS_WIDTH - 210, baseY - 240)
  ctx.lineTo(CANVAS_WIDTH - 195, baseY)
  ctx.lineTo(CANVAS_WIDTH - 260, baseY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#6a807a88'
  ctx.beginPath()
  ctx.moveTo(220, baseY - 180)
  ctx.lineTo(420, baseY - 320)
  ctx.lineTo(620, baseY - 190)
  ctx.lineTo(220, baseY - 180)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#2f5a70'
  ctx.fillRect(0, baseY, CANVAS_WIDTH, GROUND_Y - baseY + 40)

  drawGround(ctx, '#2f5a70', '#1f3f50')
}

const WORLD_TOUR_2_BACKGROUNDS = [
  drawGreatWallBackground,
  drawPetraBackground,
  drawSydneyOperaHouseBackground,
  drawStatueOfLibertyBackground,
  drawNiagaraFallsBackground,
  drawChichenItzaBackground,
  drawVeniceCanalsBackground,
  drawTableMountainBackground,
  drawGeysirBackground,
  drawMilfordSoundBackground,
]

const NIGHT_TINTS = [
  '#17255466',
  '#134e4a55',
  '#581c8755',
  '#7c2d1255',
  '#1e3a8a55',
]

const NIGHT_BACKGROUNDS = BASE_BACKGROUNDS.map(
  (draw, index) => (ctx: CanvasRenderingContext2D) => {
    draw(ctx)
    ctx.save()
    ctx.fillStyle = NIGHT_TINTS[index % NIGHT_TINTS.length]
    ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
    ctx.fillStyle = '#fffde8'
    for (let star = 0; star < 18; star += 1) {
      const x = (star * 137 + index * 71) % CANVAS_WIDTH
      const y = 28 + ((star * 53 + index * 31) % 170)
      ctx.globalAlpha = 0.35 + (star % 4) * 0.14
      ctx.fillRect(x, y, 2, 2)
    }
    ctx.restore()
  },
)

const LATE_STAGE_IMAGE_URLS = [
  neuschwansteinUrl,
  colosseumUrl,
  santoriniUrl,
  sagradaFamiliaUrl,
  marrakeshUrl,
  serengetiUrl,
  rioUrl,
  machuPicchuUrl,
  grandCanyonUrl,
  auroraVillageUrl,
]

function createIllustratedBackground(
  src: string,
  fallback: (ctx: CanvasRenderingContext2D) => void,
) {
  let image: HTMLImageElement | null = null

  return (ctx: CanvasRenderingContext2D) => {
    if (image?.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      return
    }

    fallback(ctx)
    if (image || typeof Image === 'undefined') return

    image = new Image()
    image.decoding = 'async'
    image.addEventListener('load', () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(BACKGROUND_READY_EVENT))
      }
    })
    image.src = src
  }
}

const ILLUSTRATED_BACKGROUNDS = LATE_STAGE_IMAGE_URLS.map((src, index) =>
  createIllustratedBackground(src, NIGHT_BACKGROUNDS[index]),
)

const DIMENSION_COLORS = [
  ['#07051f', '#172554', '#22d3ee'],
  ['#09051d', '#3b0764', '#f472b6'],
  ['#020617', '#164e63', '#67e8f9'],
  ['#160827', '#7c2d12', '#fb923c'],
  ['#08051f', '#312e81', '#a78bfa'],
] as const

function drawDimensionBackground(
  ctx: CanvasRenderingContext2D,
  dimensionIndex: number,
) {
  const [top, bottom, neon] =
    DIMENSION_COLORS[dimensionIndex % DIMENSION_COLORS.length]
  drawSky(ctx, top, bottom)

  ctx.save()
  for (let star = 0; star < 44; star += 1) {
    const x = (star * 173 + dimensionIndex * 97) % CANVAS_WIDTH
    const y = 18 + ((star * 61 + dimensionIndex * 43) % 300)
    ctx.globalAlpha = 0.25 + (star % 5) * 0.13
    ctx.fillStyle = star % 3 === 0 ? neon : '#f8fafc'
    ctx.fillRect(x, y, star % 7 === 0 ? 3 : 2, star % 7 === 0 ? 3 : 2)
  }

  const orbX = 150 + ((dimensionIndex * 137) % 660)
  const orbY = 86 + (dimensionIndex % 3) * 34
  const orb = ctx.createRadialGradient(orbX - 12, orbY - 12, 4, orbX, orbY, 58)
  orb.addColorStop(0, '#ffffff')
  orb.addColorStop(0.18, neon)
  orb.addColorStop(1, '#111827')
  ctx.fillStyle = orb
  ctx.beginPath()
  ctx.arc(orbX, orbY, 58, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = neon
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.ellipse(orbX, orbY, 88, 20, -0.18, 0, Math.PI * 2)
  ctx.stroke()

  ctx.globalAlpha = 0.74
  ctx.fillStyle = '#070718'
  const variant = dimensionIndex % 5
  for (let shape = 0; shape < 9; shape += 1) {
    const x = shape * 118 - 18
    const height = 60 + ((shape * 47 + dimensionIndex * 29) % 170)
    if (variant === 2) {
      ctx.beginPath()
      ctx.moveTo(x, GROUND_Y)
      ctx.lineTo(x + 50, GROUND_Y - height)
      ctx.lineTo(x + 100, GROUND_Y)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillRect(x, GROUND_Y - height, 86, height)
      ctx.fillStyle = neon
      ctx.globalAlpha = 0.25
      for (
        let windowY = GROUND_Y - height + 18;
        windowY < GROUND_Y;
        windowY += 24
      ) {
        ctx.fillRect(x + 13, windowY, 8, 5)
        ctx.fillRect(x + 53, windowY, 8, 5)
      }
      ctx.fillStyle = '#070718'
      ctx.globalAlpha = 0.74
    }
  }
  ctx.restore()

  drawGround(ctx, '#11142f', '#050611')
  ctx.save()
  ctx.strokeStyle = `${neon}66`
  ctx.lineWidth = 1
  for (let x = -CANVAS_WIDTH; x <= CANVAS_WIDTH * 2; x += 80) {
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, GROUND_Y)
    ctx.lineTo(x, CANVAS_HEIGHT)
    ctx.stroke()
  }
  for (let y = GROUND_Y + 12; y < CANVAS_HEIGHT; y += 16) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(CANVAS_WIDTH, y)
    ctx.stroke()
  }
  ctx.restore()
}

const DIMENSION_BACKGROUNDS = Array.from(
  { length: 10 },
  (_, index) => (ctx: CanvasRenderingContext2D) =>
    drawDimensionBackground(ctx, index),
)

const TRENCH_COLORS = [
  ['#031c2e', '#052e42', '#38bdf8'],
  ['#021420', '#0a2f3f', '#34d399'],
  ['#02101c', '#0c2b3a', '#a78bfa'],
  ['#03202f', '#0a3446', '#f472b6'],
  ['#011119', '#082738', '#67e8f9'],
] as const

function drawTrenchBackground(
  ctx: CanvasRenderingContext2D,
  depthIndex: number,
) {
  const [top, bottom, glow] = TRENCH_COLORS[depthIndex % TRENCH_COLORS.length]
  drawSky(ctx, top, bottom)

  ctx.save()
  for (let bubble = 0; bubble < 30; bubble += 1) {
    const x = (bubble * 149 + depthIndex * 83) % CANVAS_WIDTH
    const y = 24 + ((bubble * 67 + depthIndex * 37) % (GROUND_Y - 40))
    const size = 2 + (bubble % 4)
    ctx.globalAlpha = 0.16 + (bubble % 5) * 0.08
    ctx.strokeStyle = '#e0f2fe'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  function jellyfish(x: number, y: number, scale: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.globalAlpha = 0.55
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, 0, 22, Math.PI, 0)
    ctx.fill()
    ctx.strokeStyle = glow
    ctx.lineWidth = 2
    for (let tendril = -2; tendril <= 2; tendril += 1) {
      ctx.beginPath()
      ctx.moveTo(tendril * 7, 0)
      ctx.quadraticCurveTo(tendril * 9, 22, tendril * 6, 40)
      ctx.stroke()
    }
    ctx.restore()
  }
  jellyfish(140 + ((depthIndex * 61) % 620), 90 + (depthIndex % 3) * 30, 1)
  jellyfish(700 - ((depthIndex * 53) % 500), 140 + (depthIndex % 4) * 20, 0.7)

  ctx.globalAlpha = 0.8
  ctx.fillStyle = '#021018'
  const variant = depthIndex % 5
  if (variant === 2) {
    // Sunken galleon silhouette
    const baseY = GROUND_Y
    const cx = CANVAS_WIDTH / 2
    ctx.beginPath()
    ctx.moveTo(cx - 180, baseY)
    ctx.lineTo(cx - 140, baseY - 60)
    ctx.lineTo(cx + 150, baseY - 50)
    ctx.lineTo(cx + 190, baseY)
    ctx.closePath()
    ctx.fill()
    ctx.fillRect(cx - 6, baseY - 160, 10, 100)
    ctx.fillRect(cx - 70, baseY - 110, 8, 60)
  } else {
    for (let spire = 0; spire < 7; spire += 1) {
      const x = spire * 145 - 30
      const height = 50 + ((spire * 53 + depthIndex * 31) % 150)
      ctx.beginPath()
      ctx.moveTo(x, GROUND_Y)
      ctx.lineTo(x + 22, GROUND_Y - height)
      ctx.lineTo(x + 44, GROUND_Y)
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  drawGround(ctx, '#083344', '#021018')
}

const TRENCH_BACKGROUNDS = Array.from(
  { length: 10 },
  (_, index) => (ctx: CanvasRenderingContext2D) =>
    drawTrenchBackground(ctx, index),
)

const FORGE_COLORS = [
  ['#180402', '#3a0c05', '#fb923c'],
  ['#12030c', '#3a0b28', '#f472b6'],
  ['#1a0500', '#421400', '#fbbf24'],
  ['#0e0318', '#2c0b4a', '#a78bfa'],
  ['#1c0300', '#440a05', '#f87171'],
] as const

function drawStellarForgeBackground(
  ctx: CanvasRenderingContext2D,
  formIndex: number,
) {
  const [top, bottom, glow] = FORGE_COLORS[formIndex % FORGE_COLORS.length]
  drawSky(ctx, top, bottom)

  ctx.save()
  for (let star = 0; star < 50; star += 1) {
    const x = (star * 191 + formIndex * 113) % CANVAS_WIDTH
    const y = 14 + ((star * 71 + formIndex * 47) % 320)
    ctx.globalAlpha = 0.2 + (star % 6) * 0.12
    ctx.fillStyle = star % 4 === 0 ? glow : '#fff7ed'
    ctx.fillRect(x, y, star % 9 === 0 ? 3 : 1, star % 9 === 0 ? 3 : 1)
  }
  ctx.restore()

  const coreX = 150 + ((formIndex * 151) % 660)
  const coreY = 90 + (formIndex % 3) * 30
  const core = ctx.createRadialGradient(
    coreX,
    coreY,
    6,
    coreX,
    coreY,
    70 + (formIndex % 4) * 10,
  )
  core.addColorStop(0, '#fff7ed')
  core.addColorStop(0.22, glow)
  core.addColorStop(1, '#180402')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(coreX, coreY, 70 + (formIndex % 4) * 10, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = glow
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.6
  for (let ring = 0; ring < 2; ring += 1) {
    ctx.beginPath()
    ctx.ellipse(
      coreX,
      coreY,
      95 + ring * 18,
      26 + ring * 6,
      0.4 + ring * 0.3,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  ctx.fillStyle = '#0c0403'
  for (let spire = 0; spire < 8; spire += 1) {
    const x = spire * 128 - 24
    const height = 70 + ((spire * 61 + formIndex * 37) % 180)
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x + 18, GROUND_Y - height)
    ctx.lineTo(x + 36, GROUND_Y - height * 0.6)
    ctx.lineTo(x + 54, GROUND_Y)
    ctx.closePath()
    ctx.fill()
  }

  drawGround(ctx, '#2c0b04', '#0c0201')
  ctx.save()
  ctx.strokeStyle = `${glow}88`
  ctx.lineWidth = 1
  for (let x = 20; x < CANVAS_WIDTH; x += 70) {
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y + 8)
    ctx.lineTo(x + 30, CANVAS_HEIGHT)
    ctx.stroke()
  }
  ctx.restore()
}

const FORGE_BACKGROUNDS = Array.from(
  { length: 10 },
  (_, index) => (ctx: CanvasRenderingContext2D) =>
    drawStellarForgeBackground(ctx, index),
)

const SOLAR_SYSTEM_COLORS = [
  ['#050a1a', '#0b1a3a', '#fbbf24', '#38bdf8'],
  ['#060814', '#12102f', '#f472b6', '#a78bfa'],
  ['#040a12', '#0a1f2e', '#fb923c', '#67e8f9'],
] as const

function drawSolarSystemBackground(
  ctx: CanvasRenderingContext2D,
  variant: number,
) {
  const [top, bottom, planetColor, ringColor] =
    SOLAR_SYSTEM_COLORS[variant % SOLAR_SYSTEM_COLORS.length]
  drawSky(ctx, top, bottom)

  ctx.save()
  for (let star = 0; star < 46; star += 1) {
    const x = (star * 163 + variant * 89) % CANVAS_WIDTH
    const y = 14 + ((star * 59 + variant * 41) % 300)
    ctx.globalAlpha = 0.2 + (star % 5) * 0.12
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(x, y, star % 8 === 0 ? 3 : 1, star % 8 === 0 ? 3 : 1)
  }
  ctx.restore()

  const planetX = 180 + ((variant * 211) % 600)
  const planetY = 96 + (variant % 3) * 26
  const planetR = 46 + (variant % 3) * 8
  const planet = ctx.createRadialGradient(
    planetX - 14,
    planetY - 14,
    4,
    planetX,
    planetY,
    planetR,
  )
  planet.addColorStop(0, '#fff7ed')
  planet.addColorStop(0.32, planetColor)
  planet.addColorStop(1, '#050a1a')
  ctx.fillStyle = planet
  ctx.beginPath()
  ctx.arc(planetX, planetY, planetR, 0, Math.PI * 2)
  ctx.fill()

  if (variant % 3 === 1) {
    ctx.save()
    ctx.strokeStyle = ringColor
    ctx.globalAlpha = 0.7
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.ellipse(
      planetX,
      planetY,
      planetR * 1.7,
      planetR * 0.4,
      -0.25,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
    ctx.restore()
  }

  // Distant sun glow low in the sky.
  const sunX = CANVAS_WIDTH - 90
  const sun = ctx.createRadialGradient(sunX, 60, 4, sunX, 60, 40)
  sun.addColorStop(0, '#fff7ed')
  sun.addColorStop(1, 'rgba(255,247,237,0)')
  ctx.fillStyle = sun
  ctx.beginPath()
  ctx.arc(sunX, 60, 40, 0, Math.PI * 2)
  ctx.fill()

  // Asteroid belt band.
  ctx.save()
  ctx.fillStyle = '#1e293b'
  for (let rock = 0; rock < 26; rock += 1) {
    const x = (rock * 137 + variant * 53) % CANVAS_WIDTH
    const y = GROUND_Y - 30 - ((rock * 31 + variant * 17) % 40)
    const size = 3 + (rock % 4)
    ctx.globalAlpha = 0.5 + (rock % 3) * 0.15
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#12213f', '#040a12')
}

const SOLAR_SYSTEM_BACKGROUNDS = Array.from(
  { length: 3 },
  (_, index) => (ctx: CanvasRenderingContext2D) =>
    drawSolarSystemBackground(ctx, index),
)

const GALAXY_COLORS = [
  ['#0a0416', '#1c0a38', '#c084fc'],
  ['#08051c', '#170b3c', '#38bdf8'],
  ['#0c0312', '#210a34', '#f472b6'],
] as const

function drawGalaxyBackground(ctx: CanvasRenderingContext2D, variant: number) {
  const [top, bottom, glow] = GALAXY_COLORS[variant % GALAXY_COLORS.length]
  drawSky(ctx, top, bottom)

  ctx.save()
  for (let star = 0; star < 70; star += 1) {
    const x = (star * 149 + variant * 97) % CANVAS_WIDTH
    const y = 10 + ((star * 73 + variant * 53) % 310)
    ctx.globalAlpha = 0.18 + (star % 6) * 0.12
    ctx.fillStyle = star % 5 === 0 ? glow : '#f8fafc'
    ctx.fillRect(x, y, star % 9 === 0 ? 3 : 1, star % 9 === 0 ? 3 : 1)
  }
  ctx.restore()

  // Spiral galaxy silhouette: a stack of rotated, offset ellipses fanning
  // out from a bright core to suggest spiral arms without needing a
  // true particle-system spiral.
  const coreX = 220 + ((variant * 233) % 520)
  const coreY = 110 + (variant % 3) * 24
  ctx.save()
  ctx.translate(coreX, coreY)
  ctx.rotate(variant * 0.6)
  for (let arm = 0; arm < 5; arm += 1) {
    ctx.globalAlpha = 0.16 + arm * 0.03
    ctx.strokeStyle = glow
    ctx.lineWidth = 6 - arm
    ctx.beginPath()
    ctx.ellipse(0, 0, 30 + arm * 22, 10 + arm * 7, arm * 0.5, 0, Math.PI * 1.5)
    ctx.stroke()
  }
  ctx.restore()

  const core = ctx.createRadialGradient(coreX, coreY, 2, coreX, coreY, 34)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.4, glow)
  core.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(coreX, coreY, 34, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#150a2c', '#08051c')
}

const GALAXY_BACKGROUNDS = Array.from(
  { length: 3 },
  (_, index) => (ctx: CanvasRenderingContext2D) =>
    drawGalaxyBackground(ctx, index),
)

const DEEP_SPACE_COLORS = [
  ['#010103', '#03040a', '#60a5fa'],
  ['#000000', '#020208', '#a78bfa'],
  ['#010102', '#040509', '#67e8f9'],
] as const

function drawDeepSpaceBackground(
  ctx: CanvasRenderingContext2D,
  variant: number,
) {
  const [top, bottom, glow] =
    DEEP_SPACE_COLORS[variant % DEEP_SPACE_COLORS.length]
  drawSky(ctx, top, bottom)

  ctx.save()
  for (let star = 0; star < 24; star += 1) {
    const x = (star * 211 + variant * 131) % CANVAS_WIDTH
    const y = 8 + ((star * 89 + variant * 61) % 320)
    ctx.globalAlpha = 0.12 + (star % 4) * 0.08
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  // A distant void/dark-matter ring — the only real focal point in an
  // otherwise near-empty sky, on purpose (contrast before the finale).
  const voidX = 200 + ((variant * 271) % 560)
  const voidY = 130 + (variant % 3) * 30
  ctx.save()
  ctx.strokeStyle = glow
  ctx.globalAlpha = 0.35
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(voidX, voidY, 26, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#000000'
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.arc(voidX, voidY, 22, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  drawGround(ctx, '#050608', '#000000')
}

const DEEP_SPACE_BACKGROUNDS = Array.from(
  { length: 3 },
  (_, index) => (ctx: CanvasRenderingContext2D) =>
    drawDeepSpaceBackground(ctx, index),
)

function drawHellfireBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1a0300', '#5a1206')

  const glow = ctx.createRadialGradient(
    CANVAS_WIDTH / 2,
    GROUND_Y,
    20,
    CANVAS_WIDTH / 2,
    GROUND_Y,
    340,
  )
  glow.addColorStop(0, '#fbbf24')
  glow.addColorStop(0.4, '#f97316')
  glow.addColorStop(1, 'rgba(26,3,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)

  // Jagged hellscape spires with glowing cracks.
  ctx.fillStyle = '#0c0100'
  for (let spire = 0; spire < 8; spire += 1) {
    const x = spire * 128 - 20
    const height = 90 + ((spire * 61) % 160)
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x + 16, GROUND_Y - height)
    ctx.lineTo(x + 34, GROUND_Y - height * 0.55)
    ctx.lineTo(x + 52, GROUND_Y)
    ctx.closePath()
    ctx.fill()
    ctx.save()
    ctx.strokeStyle = '#fb923c'
    ctx.globalAlpha = 0.7
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + 26, GROUND_Y - height * 0.3)
    ctx.lineTo(x + 20, GROUND_Y - height * 0.1)
    ctx.stroke()
    ctx.restore()
  }

  // Rising embers.
  ctx.save()
  for (let ember = 0; ember < 34; ember += 1) {
    const x = (ember * 127) % CANVAS_WIDTH
    const y = GROUND_Y - ((ember * 71) % (GROUND_Y - 20))
    ctx.globalAlpha = 0.25 + (ember % 5) * 0.12
    ctx.fillStyle = ember % 3 === 0 ? '#fde047' : '#fb923c'
    ctx.beginPath()
    ctx.arc(x, y, 1.5 + (ember % 3), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#5a1206', '#0c0100')
}

const HELLFIRE_BACKGROUNDS = [drawHellfireBackground]

function drawStarfield(ctx: CanvasRenderingContext2D, seed: number) {
  ctx.save()
  for (let star = 0; star < 40; star += 1) {
    const x = (star * 191 + seed * 37) % CANVAS_WIDTH
    const y = 10 + ((star * 71 + seed * 23) % 320)
    ctx.globalAlpha = 0.15 + (star % 5) * 0.1
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()
}

function drawEventHorizonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#050108', '#14030a')
  drawStarfield(ctx, 1)

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  ctx.save()
  for (let ring = 6; ring >= 0; ring -= 1) {
    const t = ring / 6
    ctx.strokeStyle = `rgba(${251 - t * 40}, ${146 + t * 60}, ${60 + t * 140}, ${0.5 - t * 0.05})`
    ctx.lineWidth = 10 - ring
    ctx.beginPath()
    ctx.ellipse(cx, cy, 60 + ring * 20, 16 + ring * 5, 0.15, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(cx, cy, 44, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#0a0208', '#000000')
}

function drawWormholeThresholdBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020617', '#0b1440')

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  ctx.save()
  for (let ring = 10; ring >= 1; ring -= 1) {
    const r = ring * 22
    ctx.strokeStyle = `rgba(96, 165, 250, ${0.5 - ring * 0.03})`
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.32, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(1, '#1e3a8a')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#0b1440', '#020617')
}

function drawShatteredMoonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0812', '#1c1830')
  drawStarfield(ctx, 3)

  const cx = 260
  const cy = 160
  ctx.fillStyle = '#c9c2d4'
  ctx.beginPath()
  ctx.arc(cx, cy, 50, 0.4, Math.PI * 1.5)
  ctx.arc(cx, cy, 50, Math.PI * 1.6, Math.PI * 2)
  ctx.fill()

  const fragments: [number, number, number][] = [
    [cx + 110, cy - 30, 16],
    [cx + 170, cy + 40, 10],
    [cx - 90, cy + 70, 12],
    [cx + 60, cy + 110, 8],
  ]
  ctx.fillStyle = '#a8a0b8'
  for (const [x, y, r] of fragments) {
    ctx.beginPath()
    ctx.moveTo(x - r, y)
    ctx.lineTo(x, y - r)
    ctx.lineTo(x + r, y)
    ctx.lineTo(x, y + r)
    ctx.closePath()
    ctx.fill()
  }

  drawGround(ctx, '#1c1830', '#0a0812')
}

function drawIonStormBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0f1c', '#1a2b4a')

  ctx.save()
  for (let cloud = 0; cloud < 5; cloud += 1) {
    const x = cloud * 190 + 40
    ctx.fillStyle = '#312e5988'
    ctx.beginPath()
    ctx.ellipse(x, 60 + (cloud % 2) * 30, 100, 30, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 2
  const bolts: [number, number][][] = [
    [
      [120, 20],
      [160, 90],
      [110, 140],
      [180, 220],
    ],
    [
      [520, 10],
      [480, 80],
      [560, 150],
      [500, 240],
    ],
    [
      [720, 30],
      [690, 100],
      [760, 170],
      [700, 250],
    ],
  ]
  for (const bolt of bolts) {
    ctx.globalAlpha = 0.8
    ctx.beginPath()
    ctx.moveTo(bolt[0][0], bolt[0][1])
    for (const [x, y] of bolt.slice(1)) ctx.lineTo(x, y)
    ctx.stroke()
  }
  ctx.restore()

  drawGround(ctx, '#1a2b4a', '#0a0f1c')
}

function drawBinaryCollapseBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#160418', '#3a0a2a')
  drawStarfield(ctx, 5)

  const starA = { x: 300, y: 150, r: 40, color: '#fb923c' }
  const starB = { x: 400, y: 190, r: 26, color: '#60a5fa' }

  for (const s of [starA, starB]) {
    const g = ctx.createRadialGradient(s.x, s.y, 2, s.x, s.y, s.r)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.4, s.color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = '#f472b688'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(starA.x + 20, starA.y + 10)
  ctx.quadraticCurveTo(350, 220, starB.x - 14, starB.y - 6)
  ctx.stroke()

  drawGround(ctx, '#3a0a2a', '#160418')
}

function drawCometMaelstromBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020a12', '#0a2436')

  const cx = CANVAS_WIDTH / 2
  const cy = 180
  ctx.save()
  for (let comet = 0; comet < 5; comet += 1) {
    const angle = (comet / 5) * Math.PI * 2
    const hx = cx + Math.cos(angle) * 220
    const hy = cy + Math.sin(angle) * 90
    const tx = cx + Math.cos(angle + 0.6) * 120
    const ty = cy + Math.sin(angle + 0.6) * 50

    const tail = ctx.createLinearGradient(tx, ty, hx, hy)
    tail.addColorStop(0, 'rgba(103, 232, 249, 0)')
    tail.addColorStop(1, '#67e8f9')
    ctx.strokeStyle = tail
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(hx, hy)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(hx, hy, 5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#0a2436', '#020a12')
}

function drawGravitonWellBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#04070f', '#0e1b33')

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  ctx.save()
  ctx.strokeStyle = '#38bdf866'
  ctx.lineWidth = 1
  for (let y = 20; y < GROUND_Y; y += 36) {
    ctx.beginPath()
    for (let x = 0; x <= CANVAS_WIDTH; x += 24) {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.max(Math.hypot(dx, dy), 1)
      const pull = Math.min(2200 / dist, 220)
      const bendX = x - (dx / dist) * pull
      const bendY = y - (dy / dist) * pull
      if (x === 0) ctx.moveTo(bendX, bendY)
      else ctx.lineTo(bendX, bendY)
    }
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = '#0a0f1c'
  ctx.beginPath()
  ctx.arc(cx, cy, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#93c5fd'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, 20, 0, Math.PI * 2)
  ctx.stroke()

  drawGround(ctx, '#0e1b33', '#04070f')
}

function drawPulsarVortexBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#050510', '#160b2e')
  drawStarfield(ctx, 8)

  const cx = CANVAS_WIDTH / 2
  const cy = 180
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(0.4)
  const beam = ctx.createLinearGradient(-360, 0, 360, 0)
  beam.addColorStop(0, 'rgba(244, 114, 182, 0)')
  beam.addColorStop(0.5, 'rgba(244, 114, 182, 0.55)')
  beam.addColorStop(1, 'rgba(244, 114, 182, 0)')
  ctx.fillStyle = beam
  ctx.fillRect(-360, -8, 720, 16)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = beam
  ctx.fillRect(-360, -8, 720, 16)
  ctx.restore()

  const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, 26)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(1, '#f472b6')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 26, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#160b2e', '#050510')
}

function drawNebulaFunnelBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0418', '#241040')

  const cx = CANVAS_WIDTH / 2
  ctx.save()
  for (let band = 8; band >= 1; band -= 1) {
    const y = 30 + band * 22
    const width = 40 + (8 - band) * 42
    ctx.strokeStyle = `rgba(167, 139, 250, ${0.5 - band * 0.04})`
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.ellipse(cx, y, width, 14, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx, 40, 8, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#241040', '#0a0418')
}

function drawTheSingularityBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#0c0210')

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  ctx.save()
  for (let arm = 0; arm < 4; arm += 1) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((arm / 4) * Math.PI * 2)
    ctx.strokeStyle = '#f8fafc'
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    for (let t = 0; t <= 40; t += 1) {
      const angle = t * 0.25
      const r = t * 4
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r * 0.4)
    }
    ctx.stroke()
    ctx.restore()
  }
  ctx.restore()

  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, Math.PI * 2)
  ctx.stroke()

  drawGround(ctx, '#0c0210', '#000000')
}

const VORTEX_FRONTIER_BACKGROUNDS = [
  drawEventHorizonBackground,
  drawWormholeThresholdBackground,
  drawShatteredMoonBackground,
  drawIonStormBackground,
  drawBinaryCollapseBackground,
  drawCometMaelstromBackground,
  drawGravitonWellBackground,
  drawPulsarVortexBackground,
  drawNebulaFunnelBackground,
  drawTheSingularityBackground,
]

const RAW_BACKGROUNDS = [
  ...BASE_BACKGROUNDS,
  ...ILLUSTRATED_BACKGROUNDS,
  ...WORLD_TOUR_2_BACKGROUNDS,
  ...DIMENSION_BACKGROUNDS,
  ...TRENCH_BACKGROUNDS,
  ...FORGE_BACKGROUNDS,
  ...SOLAR_SYSTEM_BACKGROUNDS,
  ...GALAXY_BACKGROUNDS,
  ...DEEP_SPACE_BACKGROUNDS,
  ...HELLFIRE_BACKGROUNDS,
  ...VORTEX_FRONTIER_BACKGROUNDS,
]

export const BACKGROUNDS = RAW_BACKGROUNDS.map(
  (draw) => (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.filter = 'saturate(0.76) brightness(0.96)'
    draw(ctx)
    ctx.restore()
  },
)

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  stageIndex: number,
) {
  const draw = BACKGROUNDS[stageIndex % BACKGROUNDS.length]
  draw(ctx)

  ctx.strokeStyle = '#00000022'
  ctx.beginPath()
  ctx.moveTo(0, CANVAS_HEIGHT - 4)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 4)
  ctx.stroke()
}
