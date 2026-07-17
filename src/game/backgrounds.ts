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
  "Nebula's Edge (Cosmic Frontier)",
  'Drifting Debris (Cosmic Frontier)',
  'Ringed Sentinel (Cosmic Frontier)',
  'Spiral Descent (Cosmic Frontier)',
  'Stellar Cradle (Cosmic Frontier)',
  'Blazing Heart (Cosmic Frontier)',
  'Silent Approach (Cosmic Frontier)',
  'Fading Light (Cosmic Frontier)',
  'Threshold of Fire (Cosmic Frontier)',
  'The Core Ignites (Cosmic Frontier)',
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
  'Cinder Gate (Hell)',
  'Molten Canyon (Hell)',
  'Brimstone Spires (Hell)',
  'Ashfall (Hell)',
  'Obsidian Throne (Hell)',
  'Infernal Forge (Hell)',
  'Charred Wastes (Hell)',
  'Ember Storm (Hell)',
  'The Furnace Gate (Hell)',
  'Abyssal Inferno (Hell)',
  'Weightless Drift (Void)',
  'Silent Expanse (Void)',
  'Fractured Reality (Void)',
  'Entropy Field (Void)',
  'The Unmoored (Void)',
  'Null Horizon (Void)',
  'Zero Point (Void)',
  'The Hollow (Void)',
  'Event Zero (Void)',
  'The Absolute Void (Void)',
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

function drawNeonMegacityBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#07051f', '#172554')
  drawStarfield(ctx, 30)

  const buildings = [
    { x: 20, w: 70, h: 210, color: '#0b0a24' },
    { x: 100, w: 50, h: 300, color: '#0e0d2c' },
    { x: 160, w: 90, h: 170, color: '#0b0a24' },
    { x: 470, w: 60, h: 260, color: '#0e0d2c' },
    { x: 540, w: 100, h: 340, color: '#0b0a24' },
    { x: 650, w: 70, h: 220, color: '#0e0d2c' },
    { x: 730, w: 90, h: 290, color: '#0b0a24' },
  ]
  for (const b of buildings) {
    ctx.fillStyle = b.color
    ctx.fillRect(b.x, GROUND_Y - b.h, b.w, b.h)
    ctx.fillStyle = '#22d3ee'
    ctx.globalAlpha = 0.35
    for (let wy = GROUND_Y - b.h + 14; wy < GROUND_Y - 8; wy += 20) {
      for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 18) {
        if ((wx + wy) % 37 < 22) ctx.fillRect(wx, wy, 8, 6)
      }
    }
    ctx.globalAlpha = 1
  }

  // Two flying-vehicle light streaks cutting across the skyline.
  ctx.strokeStyle = '#f472b6'
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  ctx.moveTo(250, 130)
  ctx.lineTo(420, 150)
  ctx.stroke()
  ctx.strokeStyle = '#22d3ee'
  ctx.beginPath()
  ctx.moveTo(500, 210)
  ctx.lineTo(700, 190)
  ctx.stroke()
  ctx.globalAlpha = 1

  drawGround(ctx, '#11142f', '#050611')
}

function drawOrbitalDockBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#09051d', '#3b0764')
  drawStarfield(ctx, 31)

  const planetX = 150
  const planetY = 150
  const planet = ctx.createRadialGradient(
    planetX - 20,
    planetY - 20,
    6,
    planetX,
    planetY,
    90,
  )
  planet.addColorStop(0, '#a78bfa')
  planet.addColorStop(1, '#1e1033')
  ctx.fillStyle = planet
  ctx.beginPath()
  ctx.arc(planetX, planetY, 90, 0, Math.PI * 2)
  ctx.fill()

  const cx = CANVAS_WIDTH / 2 + 60
  const cy = 230
  ctx.fillStyle = '#c4b5fd'
  ctx.fillRect(cx - 90, cy - 14, 180, 28)
  ctx.fillRect(cx - 14, cy - 60, 28, 120)
  ctx.strokeStyle = '#f472b6'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(cx - 130, cy)
  ctx.lineTo(cx - 90, cy)
  ctx.moveTo(cx + 90, cy)
  ctx.lineTo(cx + 150, cy - 30)
  ctx.stroke()

  // Docked cargo ship silhouette.
  ctx.fillStyle = '#8b7ab8'
  ctx.beginPath()
  ctx.moveTo(cx + 150, cy - 30)
  ctx.lineTo(cx + 210, cy - 40)
  ctx.lineTo(cx + 220, cy - 10)
  ctx.lineTo(cx + 150, cy)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#1e1033', '#09051d')
}

function drawCrystalMoonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020617', '#164e63')
  drawStarfield(ctx, 32)

  const baseY = GROUND_Y
  ctx.fillStyle = '#0e2a33'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  ctx.quadraticCurveTo(200, baseY - 70, 420, baseY - 30)
  ctx.quadraticCurveTo(650, baseY - 10, CANVAS_WIDTH, baseY - 60)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()

  function crystal(x: number, height: number, width: number, hue: string) {
    ctx.fillStyle = hue
    ctx.beginPath()
    ctx.moveTo(x - width / 2, baseY - 20)
    ctx.lineTo(x, baseY - 20 - height)
    ctx.lineTo(x + width / 2, baseY - 20)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#67e8f9'
    ctx.globalAlpha = 0.6
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, baseY - 20 - height)
    ctx.lineTo(x, baseY - 20)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
  crystal(180, 190, 60, '#164e63')
  crystal(260, 260, 70, '#0e3a45')
  crystal(560, 230, 65, '#164e63')
  crystal(650, 160, 55, '#0e3a45')

  drawGround(ctx, '#0e2a33', '#020617')
}

function drawCyberDesertBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#160827', '#7c2d12')

  ctx.fillStyle = '#fb923c'
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH / 2, 130, 50, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // Distant glowing digital pyramid.
  const cx = CANVAS_WIDTH / 2
  ctx.strokeStyle = '#fb923c'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 90, GROUND_Y - 30)
  ctx.lineTo(cx, GROUND_Y - 190)
  ctx.lineTo(cx + 90, GROUND_Y - 30)
  ctx.closePath()
  ctx.stroke()

  // Undulating dune ridges with a perspective wire grid.
  ctx.fillStyle = '#4a1f0f'
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y)
  ctx.quadraticCurveTo(220, GROUND_Y - 60, 460, GROUND_Y - 10)
  ctx.quadraticCurveTo(680, GROUND_Y + 30, CANVAS_WIDTH, GROUND_Y - 20)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.lineTo(0, CANVAS_HEIGHT)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#3a180c', '#160827')
  ctx.save()
  ctx.strokeStyle = '#fb923c66'
  ctx.lineWidth = 1
  for (let x = -CANVAS_WIDTH; x <= CANVAS_WIDTH * 2; x += 70) {
    ctx.beginPath()
    ctx.moveTo(cx, GROUND_Y)
    ctx.lineTo(x, CANVAS_HEIGHT)
    ctx.stroke()
  }
  ctx.restore()
}

function drawQuantumReactorBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#08051f', '#312e81')
  drawStarfield(ctx, 34)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  const core = ctx.createRadialGradient(cx, cy, 4, cx, cy, 46)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.4, '#a78bfa')
  core.addColorStop(1, '#1e1b4b')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 46, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 4
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.globalAlpha = 0.65 - ring * 0.15
    ctx.beginPath()
    ctx.ellipse(
      cx,
      cy,
      70 + ring * 32,
      18 + ring * 8,
      ring * 0.5,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Containment struts.
  ctx.fillStyle = '#3730a3'
  for (const dx of [-140, 140]) {
    ctx.fillRect(cx + dx - 10, cy - 80, 20, 160)
  }

  drawGround(ctx, '#1e1b4b', '#08051f')
}

function drawVoidCathedralBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020617', '#164e63')
  drawStarfield(ctx, 35)

  const cx = CANVAS_WIDTH / 2
  function arch(x: number, height: number, width: number) {
    ctx.fillStyle = '#0b1a2b'
    ctx.beginPath()
    ctx.moveTo(x - width / 2, GROUND_Y)
    ctx.lineTo(x - width / 2, GROUND_Y - height * 0.5)
    ctx.quadraticCurveTo(
      x,
      GROUND_Y - height,
      x + width / 2,
      GROUND_Y - height * 0.5,
    )
    ctx.lineTo(x + width / 2, GROUND_Y)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#67e8f9'
    ctx.globalAlpha = 0.35
    ctx.beginPath()
    ctx.arc(x, GROUND_Y - height * 0.6, width * 0.16, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  arch(cx - 240, 190, 110)
  arch(cx - 90, 280, 130)
  arch(cx + 90, 280, 130)
  arch(cx + 240, 190, 110)

  drawGround(ctx, '#0b1a2b', '#020617')
}

function drawPlasmaOceanBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#160827', '#7c2d12')

  const baseY = GROUND_Y - 30
  const wave = ctx.createLinearGradient(0, baseY - 30, 0, CANVAS_HEIGHT)
  wave.addColorStop(0, '#fb923c')
  wave.addColorStop(1, '#7c2d12')
  ctx.fillStyle = wave
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
    ctx.lineTo(x, baseY + Math.sin(x / 60) * 14)
  }
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.lineTo(0, CANVAS_HEIGHT)
  ctx.closePath()
  ctx.fill()

  // Rising plasma geysers.
  for (const gx of [180, 420, 660]) {
    const geyser = ctx.createLinearGradient(0, baseY - 140, 0, baseY)
    geyser.addColorStop(0, '#fde68a')
    geyser.addColorStop(1, 'rgba(253,230,138,0)')
    ctx.fillStyle = geyser
    ctx.beginPath()
    ctx.moveTo(gx - 10, baseY)
    ctx.lineTo(gx - 3, baseY - 140)
    ctx.lineTo(gx + 3, baseY - 140)
    ctx.lineTo(gx + 10, baseY)
    ctx.closePath()
    ctx.fill()
  }

  drawGround(ctx, '#7c2d12', '#2e0a03')
}

function drawClockworkNebulaBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#08051f', '#312e81')
  drawStarfield(ctx, 38)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  ctx.save()
  ctx.translate(cx, cy)
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.rotate(0.4)
    ctx.strokeStyle = '#a78bfa'
    ctx.globalAlpha = 0.6 - ring * 0.12
    ctx.lineWidth = 3
    const r = 40 + ring * 40
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
    for (let tooth = 0; tooth < 8; tooth += 1) {
      const angle = (tooth / 8) * Math.PI * 2
      ctx.save()
      ctx.rotate(angle)
      ctx.fillStyle = '#a78bfa'
      ctx.fillRect(r - 4, -6, 14, 12)
      ctx.restore()
    }
  }
  ctx.restore()
  ctx.globalAlpha = 1

  const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, 26)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(1, '#a78bfa')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 26, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#1e1b4b', '#08051f')
}

function drawSingularityGateBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020617', '#164e63')
  drawStarfield(ctx, 39)

  const cx = CANVAS_WIDTH / 2
  const cy = 210
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.ellipse(cx, cy, 130, 150, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.ellipse(cx, cy, 150, 170, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  const inner = ctx.createRadialGradient(cx, cy, 4, cx, cy, 110)
  inner.addColorStop(0, '#ffffff')
  inner.addColorStop(0.5, '#67e8f9')
  inner.addColorStop(1, '#0b1a2b')
  ctx.fillStyle = inner
  ctx.beginPath()
  ctx.ellipse(cx, cy, 110, 130, 0, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#0b1a2b', '#020617')
}

function drawOrbitCoreBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#09051d', '#3b0764')
  drawStarfield(ctx, 40)

  const cx = CANVAS_WIDTH / 2
  const cy = GROUND_Y + 60
  ctx.fillStyle = '#f472b6'
  ctx.beginPath()
  ctx.arc(cx, cy, 130, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#c4b5fd'
  ctx.lineWidth = 3
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.globalAlpha = 0.6 - ring * 0.15
    ctx.beginPath()
    ctx.ellipse(
      cx,
      cy,
      160 + ring * 40,
      40 + ring * 12,
      0,
      Math.PI,
      Math.PI * 2,
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  drawGround(ctx, '#3b0764', '#09051d')
}

const DIMENSION_BACKGROUNDS = [
  drawNeonMegacityBackground,
  drawOrbitalDockBackground,
  drawCrystalMoonBackground,
  drawCyberDesertBackground,
  drawQuantumReactorBackground,
  drawVoidCathedralBackground,
  drawPlasmaOceanBackground,
  drawClockworkNebulaBackground,
  drawSingularityGateBackground,
  drawOrbitCoreBackground,
]

function drawKelpGateBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#031c2e', '#052e42')

  function kelp(x: number, height: number, sway: number) {
    ctx.strokeStyle = '#34d399'
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.quadraticCurveTo(
      x + sway,
      GROUND_Y - height * 0.6,
      x,
      GROUND_Y - height,
    )
    ctx.stroke()
  }
  kelp(140, 320, 40)
  kelp(190, 260, -30)
  kelp(660, 320, -40)
  kelp(710, 260, 30)

  ctx.save()
  for (let bubble = 0; bubble < 16; bubble += 1) {
    const x = (bubble * 149) % CANVAS_WIDTH
    const y = 24 + ((bubble * 67) % (GROUND_Y - 40))
    ctx.globalAlpha = 0.2
    ctx.strokeStyle = '#e0f2fe'
    ctx.beginPath()
    ctx.arc(x, y, 2 + (bubble % 4), 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  drawGround(ctx, '#083344', '#021018')
}

function drawBioluminescentShoalBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#021420', '#0a2f3f')

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  ctx.save()
  for (let fish = 0; fish < 24; fish += 1) {
    const angle = (fish / 24) * Math.PI * 2
    const radius = 70 + (fish % 3) * 40
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius * 0.5
    ctx.fillStyle = '#34d399'
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.moveTo(x - 6, y)
    ctx.lineTo(x + 4, y - 3)
    ctx.lineTo(x + 4, y + 3)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#083344', '#021018')
}

function drawSunkenGalleonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#02101c', '#0c2b3a')

  const baseY = GROUND_Y
  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#021018'
  ctx.beginPath()
  ctx.moveTo(cx - 200, baseY)
  ctx.lineTo(cx - 160, baseY - 70)
  ctx.lineTo(cx + 170, baseY - 60)
  ctx.lineTo(cx + 210, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(cx - 6, baseY - 190, 10, 120)
  ctx.fillRect(cx - 80, baseY - 130, 8, 70)
  ctx.fillRect(cx + 60, baseY - 150, 8, 90)

  // Tattered sail silhouette on the mast.
  ctx.fillStyle = '#0c2b3a'
  ctx.globalAlpha = 0.7
  ctx.beginPath()
  ctx.moveTo(cx - 4, baseY - 190)
  ctx.lineTo(cx + 50, baseY - 170)
  ctx.lineTo(cx - 4, baseY - 130)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.save()
  for (let bubble = 0; bubble < 14; bubble += 1) {
    const x = (bubble * 149 + 40) % CANVAS_WIDTH
    const y = 24 + ((bubble * 67) % (GROUND_Y - 40))
    ctx.globalAlpha = 0.18
    ctx.strokeStyle = '#e0f2fe'
    ctx.beginPath()
    ctx.arc(x, y, 2 + (bubble % 3), 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  drawGround(ctx, '#083344', '#021018')
}

function drawCoralSpiresBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#03202f', '#0a3446')

  function coral(x: number, height: number, color: string) {
    ctx.strokeStyle = color
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x, GROUND_Y - height)
    ctx.stroke()
    for (const dx of [-1, 1]) {
      ctx.lineWidth = 7
      ctx.beginPath()
      ctx.moveTo(x, GROUND_Y - height * 0.6)
      ctx.lineTo(x + dx * 30, GROUND_Y - height * 0.85)
      ctx.stroke()
    }
    ctx.lineCap = 'butt'
  }
  coral(150, 220, '#f472b6')
  coral(260, 170, '#fb923c')
  coral(560, 240, '#f472b6')
  coral(690, 180, '#fbbf24')

  drawGround(ctx, '#083344', '#021018')
}

function drawJellyfishCurrentBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#011119', '#082738')

  function jellyfish(x: number, y: number, scale: number, color: string) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.globalAlpha = 0.6
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(0, 0, 22, Math.PI, 0)
    ctx.fill()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    for (let tendril = -2; tendril <= 2; tendril += 1) {
      ctx.beginPath()
      ctx.moveTo(tendril * 7, 0)
      ctx.quadraticCurveTo(tendril * 9, 22, tendril * 6, 40)
      ctx.stroke()
    }
    ctx.restore()
  }
  jellyfish(200, 120, 1.2, '#67e8f9')
  jellyfish(340, 220, 0.8, '#a78bfa')
  jellyfish(560, 150, 1, '#67e8f9')
  jellyfish(700, 250, 0.7, '#a78bfa')

  drawGround(ctx, '#083344', '#021018')
}

function drawThermalVentBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#021420', '#0a2f3f')

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#0a2f3f'
  ctx.beginPath()
  ctx.moveTo(cx - 40, GROUND_Y)
  ctx.lineTo(cx - 14, GROUND_Y - 90)
  ctx.lineTo(cx + 14, GROUND_Y - 90)
  ctx.lineTo(cx + 40, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  const plume = ctx.createLinearGradient(0, GROUND_Y - 260, 0, GROUND_Y - 90)
  plume.addColorStop(0, 'rgba(251, 146, 60, 0)')
  plume.addColorStop(1, '#fb923c')
  ctx.fillStyle = plume
  ctx.beginPath()
  ctx.moveTo(cx - 20, GROUND_Y - 90)
  ctx.quadraticCurveTo(cx - 55, GROUND_Y - 180, cx - 15, GROUND_Y - 260)
  ctx.quadraticCurveTo(cx, GROUND_Y - 220, cx + 15, GROUND_Y - 260)
  ctx.quadraticCurveTo(cx + 55, GROUND_Y - 180, cx + 20, GROUND_Y - 90)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#083344', '#021018')
}

function drawAnglerfishDeepBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#02101c', '#0c2b3a')

  const x = CANVAS_WIDTH / 2 - 20
  const y = 210
  ctx.fillStyle = '#021018'
  ctx.beginPath()
  ctx.ellipse(x, y, 70, 40, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x + 60, y)
  ctx.lineTo(x + 100, y - 20)
  ctx.lineTo(x + 100, y + 20)
  ctx.closePath()
  ctx.fill()

  // Glowing lure.
  ctx.strokeStyle = '#021018'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x - 40, y - 30)
  ctx.quadraticCurveTo(x - 70, y - 70, x - 50, y - 100)
  ctx.stroke()
  const lure = ctx.createRadialGradient(x - 50, y - 100, 2, x - 50, y - 100, 22)
  lure.addColorStop(0, '#fde68a')
  lure.addColorStop(1, 'rgba(253,230,138,0)')
  ctx.fillStyle = lure
  ctx.beginPath()
  ctx.arc(x - 50, y - 100, 22, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#083344', '#021018')
}

function drawPressureRidgeBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#02101c', '#0c2b3a')

  ctx.fillStyle = '#021018'
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y)
  ctx.lineTo(120, GROUND_Y - 150)
  ctx.lineTo(220, GROUND_Y - 80)
  ctx.lineTo(360, GROUND_Y - 220)
  ctx.lineTo(500, GROUND_Y - 100)
  ctx.lineTo(640, GROUND_Y - 200)
  ctx.lineTo(760, GROUND_Y - 90)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y - 160)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#083344', '#021018')
}

function drawAbyssalPlainBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#011119', '#082738')

  ctx.save()
  for (let glow = 0; glow < 20; glow += 1) {
    const x = (glow * 173) % CANVAS_WIDTH
    const y = GROUND_Y - 20 - ((glow * 41) % 160)
    ctx.globalAlpha = 0.3 + (glow % 4) * 0.1
    ctx.fillStyle = '#67e8f9'
    ctx.beginPath()
    ctx.arc(x, y, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  // A whale-fall skeleton, half buried.
  const cx = CANVAS_WIDTH / 2
  ctx.strokeStyle = '#0c2b3a'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(cx - 140, GROUND_Y - 10)
  ctx.quadraticCurveTo(cx, GROUND_Y - 40, cx + 140, GROUND_Y - 10)
  ctx.stroke()
  for (let rib = -4; rib <= 4; rib += 1) {
    ctx.beginPath()
    ctx.moveTo(cx + rib * 26, GROUND_Y - 20)
    ctx.lineTo(cx + rib * 26, GROUND_Y - 5)
    ctx.stroke()
  }

  drawGround(ctx, '#04222e', '#011119')
}

function drawTrenchFloorBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#010a12', '#04202b')

  ctx.fillStyle = '#010a12'
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y - 10)
  ctx.lineTo(180, GROUND_Y + 20)
  ctx.lineTo(360, GROUND_Y - 30)
  ctx.lineTo(540, GROUND_Y + 10)
  ctx.lineTo(720, GROUND_Y - 20)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.lineTo(0, CANVAS_HEIGHT)
  ctx.closePath()
  ctx.fill()

  // Glowing cracks at the deepest point.
  ctx.strokeStyle = '#fb923c'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.7
  for (const x of [200, 400, 620]) {
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x + 14, GROUND_Y + 14)
    ctx.lineTo(x - 6, GROUND_Y + 24)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  drawGround(ctx, '#04202b', '#010a12')
}

const TRENCH_BACKGROUNDS = [
  drawKelpGateBackground,
  drawBioluminescentShoalBackground,
  drawSunkenGalleonBackground,
  drawCoralSpiresBackground,
  drawJellyfishCurrentBackground,
  drawThermalVentBackground,
  drawAnglerfishDeepBackground,
  drawPressureRidgeBackground,
  drawAbyssalPlainBackground,
  drawTrenchFloorBackground,
]

function drawEmberNebulaBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#180402', '#3a0c05')
  drawStarfield(ctx, 51)

  ctx.save()
  for (let band = 6; band >= 1; band -= 1) {
    const y = 60 + band * 30
    ctx.strokeStyle = `rgba(251, 146, 60, ${0.45 - band * 0.05})`
    ctx.lineWidth = 20
    ctx.beginPath()
    ctx.ellipse(
      CANVAS_WIDTH / 2,
      y,
      60 + (6 - band) * 50,
      18,
      0,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
  }
  ctx.restore()

  drawGround(ctx, '#2c0b04', '#0c0201')
}

function drawCometFieldsBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#12030c', '#3a0b28')
  drawStarfield(ctx, 52)

  for (const [hx, hy, angle] of [
    [200, 100, 0.4],
    [520, 160, 0.6],
    [700, 90, 0.3],
  ] as const) {
    const tx = hx - Math.cos(angle) * 140
    const ty = hy - Math.sin(angle) * 70
    const tail = ctx.createLinearGradient(tx, ty, hx, hy)
    tail.addColorStop(0, 'rgba(244, 114, 182, 0)')
    tail.addColorStop(1, '#f472b6')
    ctx.strokeStyle = tail
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(hx, hy)
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(hx, hy, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  drawGround(ctx, '#3a0b28', '#12030c')
}

function drawForgeRingBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1a0500', '#421400')
  drawStarfield(ctx, 53)

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  const core = ctx.createRadialGradient(cx, cy, 4, cx, cy, 60)
  core.addColorStop(0, '#fff7ed')
  core.addColorStop(0.3, '#fbbf24')
  core.addColorStop(1, '#421400')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 60, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 14
  ctx.beginPath()
  ctx.ellipse(cx, cy, 110, 30, 0.15, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 4
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.ellipse(cx, cy, 130, 38, 0.15, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  drawGround(ctx, '#421400', '#0c0201')
}

function drawCollapsingStarBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0e0318', '#2c0b4a')
  drawStarfield(ctx, 54)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 2
  for (let shard = 0; shard < 10; shard += 1) {
    const angle = (shard / 10) * Math.PI * 2
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * 30, cy + Math.sin(angle) * 30)
    ctx.lineTo(cx + Math.cos(angle) * 90, cy + Math.sin(angle) * 90)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(1, '#a78bfa')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 28, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#2c0b4a', '#0e0318')
}

function drawMoltenAsteroidBeltBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1c0300', '#440a05')
  drawStarfield(ctx, 55)

  ctx.save()
  for (let rock = 0; rock < 20; rock += 1) {
    const x = (rock * 137 + 40) % CANVAS_WIDTH
    const y = 60 + ((rock * 53) % 260)
    const size = 5 + (rock % 5)
    ctx.fillStyle = rock % 3 === 0 ? '#fb923c' : '#450a05'
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    if (rock % 3 === 0) {
      ctx.strokeStyle = '#fde68a'
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.arc(x, y, size + 3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }
  ctx.restore()

  drawGround(ctx, '#440a05', '#1c0300')
}

function drawSolarFurnaceBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1a0500', '#421400')

  const cx = CANVAS_WIDTH / 2
  const cy = GROUND_Y + 40
  const core = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220)
  core.addColorStop(0, '#fff7ed')
  core.addColorStop(0.3, '#fbbf24')
  core.addColorStop(0.7, '#f97316')
  core.addColorStop(1, 'rgba(26,5,0,0)')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 220, 0, Math.PI * 2)
  ctx.fill()

  // Flare arcs.
  ctx.strokeStyle = '#fde68a'
  ctx.lineWidth = 4
  ctx.globalAlpha = 0.7
  for (const angle of [-0.6, -0.2, 0.4]) {
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * 120, cy - Math.sin(angle) * 120)
    ctx.quadraticCurveTo(
      cx + Math.cos(angle) * 200,
      cy - Math.sin(angle) * 280,
      cx + Math.cos(angle) * 260,
      cy - Math.sin(angle) * 200,
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  drawGround(ctx, '#421400', '#0c0201')
}

function drawNovaRemnantBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#12030c', '#3a0b28')
  drawStarfield(ctx, 57)

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  ctx.save()
  for (let shell = 5; shell >= 0; shell -= 1) {
    ctx.strokeStyle = `rgba(244, 114, 182, ${0.55 - shell * 0.08})`
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(cx, cy, 30 + shell * 26, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx, cy, 10, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#3a0b28', '#12030c')
}

function drawForgeHorizonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0e0318', '#2c0b4a')
  drawStarfield(ctx, 58)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  const glow = ctx.createRadialGradient(cx, cy, 30, cx, cy, 100)
  glow.addColorStop(0, 'rgba(0,0,0,0)')
  glow.addColorStop(0.7, 'rgba(251, 191, 36, 0.4)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy, 100, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(cx, cy, 46, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.arc(cx, cy, 48, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  drawGround(ctx, '#2c0b4a', '#0e0318')
}

function drawTheLastForgeBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1c0300', '#440a05')
  drawStarfield(ctx, 59)

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#0c0201'
  ctx.beginPath()
  ctx.moveTo(cx - 120, GROUND_Y)
  ctx.lineTo(cx - 90, GROUND_Y - 220)
  ctx.lineTo(cx - 30, GROUND_Y - 180)
  ctx.lineTo(cx, GROUND_Y - 260)
  ctx.lineTo(cx + 30, GROUND_Y - 180)
  ctx.lineTo(cx + 90, GROUND_Y - 220)
  ctx.lineTo(cx + 120, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.7
  ctx.beginPath()
  ctx.moveTo(cx - 10, GROUND_Y - 260)
  ctx.lineTo(cx + 6, GROUND_Y - 140)
  ctx.lineTo(cx - 8, GROUND_Y - 40)
  ctx.stroke()
  ctx.globalAlpha = 1

  drawGround(ctx, '#440a05', '#1c0300')
}

function drawOrbitStarBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1c0300', '#440a05')
  drawStarfield(ctx, 60)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  const core = ctx.createRadialGradient(cx, cy, 4, cx, cy, 44)
  core.addColorStop(0, '#fff7ed')
  core.addColorStop(1, '#f97316')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 44, 0, Math.PI * 2)
  ctx.fill()

  for (let ember = 0; ember < 6; ember += 1) {
    const angle = (ember / 6) * Math.PI * 2
    const r = 80
    ctx.fillStyle = '#fde68a'
    ctx.beginPath()
    ctx.arc(
      cx + Math.cos(angle) * r,
      cy + Math.sin(angle) * r * 0.4,
      5,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  drawGround(ctx, '#440a05', '#1c0300')
}

const FORGE_BACKGROUNDS = [
  drawEmberNebulaBackground,
  drawCometFieldsBackground,
  drawForgeRingBackground,
  drawCollapsingStarBackground,
  drawMoltenAsteroidBeltBackground,
  drawSolarFurnaceBackground,
  drawNovaRemnantBackground,
  drawForgeHorizonBackground,
  drawTheLastForgeBackground,
  drawOrbitStarBackground,
]

// A shared drifting-nebula-cloud layer, called by every Cosmic Frontier
// (61-70) background so the block reads as one continuous flight into a
// nebula toward its blazing core, rather than the disconnected solar
// system/galaxy/deep-space/hellfire sub-themes it used to be. `intensity`
// climbs across the block (thin wisps at the edge, dense haze near the
// core) so the shared layer also carries the block's sense of progression.
function drawNebulaVeil(
  ctx: CanvasRenderingContext2D,
  seed: number,
  intensity: number,
) {
  const hues = ['196, 132, 252', '244, 114, 182', '96, 165, 250'] as const
  ctx.save()
  for (let band = 3; band >= 0; band -= 1) {
    const y = 50 + band * 65 + (seed % 5) * 6
    const width = 150 + band * 90
    const hue = hues[(seed + band) % hues.length]
    ctx.strokeStyle = `rgba(${hue}, ${(0.1 + band * 0.03) * intensity})`
    ctx.lineWidth = 24
    ctx.beginPath()
    ctx.ellipse(
      CANVAS_WIDTH / 2 + (((seed * 53) % 200) - 100),
      y,
      width,
      20,
      0,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
  }
  ctx.restore()
}

function drawInnerOrbitBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#050a1a', '#0b1a3a')
  drawStarfield(ctx, 61)
  drawNebulaVeil(ctx, 61, 0.35)

  const cx = CANVAS_WIDTH / 2
  const cy = 220
  const planet = ctx.createRadialGradient(cx - 20, cy - 20, 6, cx, cy, 100)
  planet.addColorStop(0, '#fff7ed')
  planet.addColorStop(0.35, '#38bdf8')
  planet.addColorStop(1, '#050a1a')
  ctx.fillStyle = planet
  ctx.beginPath()
  ctx.arc(cx, cy, 100, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.arc(cx + 160, cy - 100, 26, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#12213f', '#040a12')
}

function drawAsteroidBeltBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#060814', '#12102f')
  drawStarfield(ctx, 62)
  drawNebulaVeil(ctx, 62, 0.42)

  ctx.save()
  for (let rock = 0; rock < 34; rock += 1) {
    const x = (rock * 97) % CANVAS_WIDTH
    const y = GROUND_Y - 60 - ((rock * 43) % 220)
    const size = 3 + (rock % 5)
    ctx.fillStyle = '#94a3b8'
    ctx.globalAlpha = 0.5 + (rock % 3) * 0.15
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#12213f', '#040a12')
}

function drawRingedGiantBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#040a12', '#0a1f2e')
  drawStarfield(ctx, 63)
  drawNebulaVeil(ctx, 63, 0.5)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  const planet = ctx.createRadialGradient(cx - 20, cy - 20, 6, cx, cy, 80)
  planet.addColorStop(0, '#fff7ed')
  planet.addColorStop(0.35, '#fb923c')
  planet.addColorStop(1, '#040a12')
  ctx.fillStyle = planet
  ctx.beginPath()
  ctx.arc(cx, cy, 80, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#67e8f9'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.ellipse(cx, cy, 150, 32, -0.2, 0, Math.PI * 2)
  ctx.stroke()

  drawGround(ctx, '#0a1f2e', '#040a12')
}

function drawSpiralArmBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0416', '#1c0a38')
  drawStarfield(ctx, 64)

  drawNebulaVeil(ctx, 64, 0.58)

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  ctx.save()
  ctx.translate(cx, cy)
  for (let arm = 0; arm < 5; arm += 1) {
    ctx.globalAlpha = 0.18 + arm * 0.04
    ctx.strokeStyle = '#c084fc'
    ctx.lineWidth = 7 - arm
    ctx.beginPath()
    ctx.ellipse(0, 0, 30 + arm * 24, 10 + arm * 8, arm * 0.5, 0, Math.PI * 1.5)
    ctx.stroke()
  }
  ctx.restore()

  const core = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.4, '#c084fc')
  core.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 32, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#150a2c', '#08051c')
}

function drawStarNurseryBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#08051c', '#170b3c')
  drawStarfield(ctx, 65)
  drawNebulaVeil(ctx, 65, 0.66)

  ctx.save()
  for (let cloud = 0; cloud < 5; cloud += 1) {
    const x = 100 + cloud * 150
    const y = 100 + (cloud % 3) * 40
    ctx.fillStyle = cloud % 2 === 0 ? '#f472b688' : '#38bdf888'
    ctx.beginPath()
    ctx.ellipse(x, y, 80, 34, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let star = 0; star < 6; star += 1) {
    const x = 130 + star * 110
    const y = 130 + (star % 3) * 30
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#150a2c', '#08051c')
}

function drawGalacticCoreBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0c0312', '#210a34')
  drawStarfield(ctx, 66)
  drawNebulaVeil(ctx, 66, 0.72)

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  const core = ctx.createRadialGradient(cx, cy, 4, cx, cy, 130)
  core.addColorStop(0, '#ffffff')
  core.addColorStop(0.25, '#f472b6')
  core.addColorStop(0.6, '#7c3aed')
  core.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, 130, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#210a34', '#0c0312')
}

function drawSilentVoidBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#010103', '#03040a')
  drawNebulaVeil(ctx, 67, 0.8)

  ctx.save()
  for (let star = 0; star < 12; star += 1) {
    const x = (star * 251) % CANVAS_WIDTH
    const y = 8 + ((star * 97) % 320)
    ctx.globalAlpha = 0.2
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  drawGround(ctx, '#03040a', '#000000')
}

function drawDarkExpanseBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#020208')
  drawNebulaVeil(ctx, 68, 0.88)

  ctx.save()
  for (let star = 0; star < 16; star += 1) {
    const x = (star * 233) % CANVAS_WIDTH
    const y = 8 + ((star * 113) % 320)
    ctx.globalAlpha = 0.16
    ctx.fillStyle = '#a78bfa'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  const voidX = CANVAS_WIDTH / 2
  const voidY = 150
  ctx.strokeStyle = '#a78bfa'
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(voidX, voidY, 30, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(voidX, voidY, 26, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#020208', '#000000')
}

function drawEdgeOfEverythingBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#010102', '#040509')
  drawNebulaVeil(ctx, 69, 0.95)

  ctx.save()
  for (let star = 0; star < 6; star += 1) {
    const x = (star * 331) % CANVAS_WIDTH
    const y = 8 + ((star * 151) % 320)
    ctx.globalAlpha = 0.14
    ctx.fillStyle = '#67e8f9'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  drawGround(ctx, '#040509', '#000000')
}

const COSMIC_FRONTIER_BACKGROUNDS = [
  drawInnerOrbitBackground,
  drawAsteroidBeltBackground,
  drawRingedGiantBackground,
  drawSpiralArmBackground,
  drawStarNurseryBackground,
  drawGalacticCoreBackground,
  drawSilentVoidBackground,
  drawDarkExpanseBackground,
  drawEdgeOfEverythingBackground,
  drawHellfireBackground,
]

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

function drawCinderGateBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1a0300', '#4a0c02')

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#0c0100'
  ctx.beginPath()
  ctx.moveTo(cx - 220, GROUND_Y)
  ctx.lineTo(cx - 180, GROUND_Y - 260)
  ctx.lineTo(cx - 140, GROUND_Y)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + 140, GROUND_Y)
  ctx.lineTo(cx + 180, GROUND_Y - 260)
  ctx.lineTo(cx + 220, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#fb923c'
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.7
  for (const dx of [-180, 180]) {
    ctx.beginPath()
    ctx.moveTo(cx + dx, GROUND_Y - 40)
    ctx.lineTo(cx + dx - 10, GROUND_Y - 140)
    ctx.lineTo(cx + dx + 6, GROUND_Y - 200)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  drawGround(ctx, '#4a0c02', '#0c0100')
}

function drawMoltenCanyonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#200400', '#5a1206')

  ctx.fillStyle = '#0c0100'
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y - 60)
  ctx.lineTo(220, GROUND_Y - 180)
  ctx.lineTo(460, GROUND_Y - 90)
  ctx.lineTo(700, GROUND_Y - 200)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y - 100)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
  ctx.lineTo(0, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  const lava = ctx.createLinearGradient(0, GROUND_Y - 20, 0, GROUND_Y + 20)
  lava.addColorStop(0, '#fde047')
  lava.addColorStop(1, '#f97316')
  ctx.fillStyle = lava
  ctx.fillRect(0, GROUND_Y - 4, CANVAS_WIDTH, 10)

  drawGround(ctx, '#5a1206', '#0c0100')
}

function drawBrimstoneSpiresBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#241000', '#5a3006')

  for (let spire = 0; spire < 6; spire += 1) {
    const x = spire * 138 - 10
    const height = 120 + ((spire * 53) % 140)
    ctx.fillStyle = spire % 2 === 0 ? '#2d1a04' : '#3a2306'
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x + 20, GROUND_Y - height)
    ctx.lineTo(x + 40, GROUND_Y)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#a3e635'
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.ellipse(x + 20, GROUND_Y - height + 10, 10, 20, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  drawGround(ctx, '#5a3006', '#241000')
}

function drawAshfallBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#180800', '#3a1502')

  ctx.fillStyle = '#0c0402'
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y)
  ctx.quadraticCurveTo(300, GROUND_Y - 40, 600, GROUND_Y - 10)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y - 30)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.lineTo(0, CANVAS_HEIGHT)
  ctx.closePath()
  ctx.fill()

  ctx.save()
  for (let ash = 0; ash < 40; ash += 1) {
    const x = (ash * 113) % CANVAS_WIDTH
    const y = 20 + ((ash * 67) % (GROUND_Y - 20))
    ctx.globalAlpha = 0.2 + (ash % 4) * 0.1
    ctx.fillStyle = ash % 3 === 0 ? '#fb923c' : '#7c7c7c'
    ctx.beginPath()
    ctx.arc(x, y, 1.5 + (ash % 2), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#3a1502', '#0c0402')
}

function drawObsidianThroneBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#150300', '#420a02')

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#050101'
  ctx.beginPath()
  ctx.moveTo(cx - 130, GROUND_Y)
  ctx.lineTo(cx - 110, GROUND_Y - 130)
  ctx.lineTo(cx - 60, GROUND_Y - 220)
  ctx.lineTo(cx, GROUND_Y - 250)
  ctx.lineTo(cx + 60, GROUND_Y - 220)
  ctx.lineTo(cx + 110, GROUND_Y - 130)
  ctx.lineTo(cx + 130, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.moveTo(cx, GROUND_Y - 250)
  ctx.lineTo(cx - 6, GROUND_Y - 120)
  ctx.lineTo(cx + 4, GROUND_Y - 30)
  ctx.stroke()
  ctx.globalAlpha = 1

  drawGround(ctx, '#420a02', '#050101')
}

function drawInfernalForgeBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#200400', '#5a1206')

  const cx = CANVAS_WIDTH / 2
  const glow = ctx.createRadialGradient(
    cx,
    GROUND_Y - 30,
    10,
    cx,
    GROUND_Y - 30,
    170,
  )
  glow.addColorStop(0, '#fde047')
  glow.addColorStop(0.5, '#f97316')
  glow.addColorStop(1, 'rgba(32,4,0,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, GROUND_Y - 30, 170, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#0c0100'
  ctx.fillRect(cx - 90, GROUND_Y - 140, 180, 140)
  ctx.beginPath()
  ctx.moveTo(cx - 90, GROUND_Y - 140)
  ctx.lineTo(cx, GROUND_Y - 190)
  ctx.lineTo(cx + 90, GROUND_Y - 140)
  ctx.closePath()
  ctx.fill()

  drawGround(ctx, '#5a1206', '#0c0100')
}

function drawCharredWastesBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1c0a00', '#402005')

  ctx.strokeStyle = '#f97316'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  for (let crack = 0; crack < 6; crack += 1) {
    const x = crack * 140 + 40
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x + 20, GROUND_Y - 12)
    ctx.lineTo(x - 6, GROUND_Y - 24)
    ctx.lineTo(x + 14, GROUND_Y - 40)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  ctx.fillStyle = '#0c0402'
  for (let rock = 0; rock < 8; rock += 1) {
    const x = rock * 105 + 20
    const h = 14 + (rock % 3) * 10
    ctx.beginPath()
    ctx.arc(x, GROUND_Y - h / 2, h, 0, Math.PI * 2)
    ctx.fill()
  }

  drawGround(ctx, '#402005', '#0c0402')
}

function drawEmberStormBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#180500', '#420f02')

  ctx.save()
  for (let ember = 0; ember < 50; ember += 1) {
    const x = (ember * 97) % CANVAS_WIDTH
    const y = 10 + ((ember * 61) % (GROUND_Y - 10))
    ctx.globalAlpha = 0.25 + (ember % 5) * 0.12
    ctx.fillStyle = ember % 2 === 0 ? '#fde047' : '#fb923c'
    ctx.beginPath()
    ctx.arc(x, y, 1.5 + (ember % 3), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#420f02', '#0c0100')
}

function drawFurnaceGateBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#140200', '#3a0a00')

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#050101'
  ctx.fillRect(cx - 150, GROUND_Y - 260, 300, 260)
  const doorGlow = ctx.createRadialGradient(
    cx,
    GROUND_Y - 80,
    10,
    cx,
    GROUND_Y - 80,
    100,
  )
  doorGlow.addColorStop(0, '#fde047')
  doorGlow.addColorStop(0.5, '#f97316')
  doorGlow.addColorStop(1, '#3a0a00')
  ctx.fillStyle = doorGlow
  ctx.beginPath()
  ctx.arc(cx, GROUND_Y - 80, 90, Math.PI, 0)
  ctx.fill()
  ctx.fillRect(cx - 90, GROUND_Y - 80, 180, 80)

  ctx.strokeStyle = '#450a02'
  ctx.lineWidth = 8
  for (let bar = -3; bar <= 3; bar += 1) {
    ctx.beginPath()
    ctx.moveTo(cx + bar * 24, GROUND_Y - 170)
    ctx.lineTo(cx + bar * 24, GROUND_Y)
    ctx.stroke()
  }

  drawGround(ctx, '#3a0a00', '#050101')
}

function drawAbyssalInfernoBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#100000', '#520a00')

  const cx = CANVAS_WIDTH / 2
  const glow = ctx.createRadialGradient(cx, GROUND_Y, 20, cx, GROUND_Y, 380)
  glow.addColorStop(0, '#fef08a')
  glow.addColorStop(0.35, '#fb923c')
  glow.addColorStop(0.7, '#dc2626')
  glow.addColorStop(1, 'rgba(16,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)

  ctx.fillStyle = '#050000'
  for (let spire = 0; spire < 9; spire += 1) {
    const x = spire * 114 - 20
    const height = 100 + ((spire * 67) % 190)
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x + 18, GROUND_Y - height)
    ctx.lineTo(x + 38, GROUND_Y - height * 0.5)
    ctx.lineTo(x + 56, GROUND_Y)
    ctx.closePath()
    ctx.fill()
  }

  ctx.save()
  for (let ember = 0; ember < 40; ember += 1) {
    const x = (ember * 131) % CANVAS_WIDTH
    const y = GROUND_Y - ((ember * 73) % (GROUND_Y - 20))
    ctx.globalAlpha = 0.3 + (ember % 5) * 0.1
    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.arc(x, y, 1.5 + (ember % 3), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  drawGround(ctx, '#520a00', '#050000')
}

const HELL_BACKGROUNDS = [
  drawCinderGateBackground,
  drawMoltenCanyonBackground,
  drawBrimstoneSpiresBackground,
  drawAshfallBackground,
  drawObsidianThroneBackground,
  drawInfernalForgeBackground,
  drawCharredWastesBackground,
  drawEmberStormBackground,
  drawFurnaceGateBackground,
  drawAbyssalInfernoBackground,
]

function drawWeightlessDriftBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020208', '#04041a')
  drawStarfield(ctx, 91)

  ctx.save()
  for (const [x, y, r] of [
    [180, 140, 18],
    [520, 220, 12],
    [700, 130, 22],
    [340, 260, 10],
  ] as const) {
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.5
    ctx.beginPath()
    ctx.rect(x - r / 2, y - r / 2, r, r)
    ctx.stroke()
  }
  ctx.restore()

  drawGround(ctx, '#04041a', '#000000')
}

function drawSilentExpanseBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#020212')

  ctx.save()
  for (let star = 0; star < 10; star += 1) {
    const x = (star * 271) % CANVAS_WIDTH
    const y = 10 + ((star * 109) % 320)
    ctx.globalAlpha = 0.16
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  drawGround(ctx, '#020212', '#000000')
}

function drawFracturedRealityBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020210', '#0a0a24')

  ctx.strokeStyle = '#818cf8'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  for (const [x1, y1, x2, y2] of [
    [100, 40, 260, 180],
    [400, 20, 320, 200],
    [600, 60, 780, 220],
    [200, 220, 500, 100],
  ] as const) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  drawGround(ctx, '#0a0a24', '#020210')
}

function drawEntropyFieldBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#050510', '#0e0e28')

  ctx.save()
  for (let p = 0; p < 30; p += 1) {
    const x = (p * 151) % CANVAS_WIDTH
    const y = 20 + ((p * 83) % 300)
    ctx.globalAlpha = 0.15 + (p % 5) * 0.08
    ctx.fillStyle = p % 3 === 0 ? '#a78bfa' : '#64748b'
    ctx.fillRect(x, y, 2, 2)
  }
  ctx.restore()

  drawGround(ctx, '#0e0e28', '#050510')
}

function drawTheUnmooredBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#020208', '#08081c')
  drawStarfield(ctx, 95)

  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#334155'
  ctx.beginPath()
  ctx.moveTo(cx - 100, 160)
  ctx.lineTo(cx - 40, 130)
  ctx.lineTo(cx + 60, 150)
  ctx.lineTo(cx + 20, 200)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 2
  ctx.strokeRect(cx - 90, 150, 30, 20)

  drawGround(ctx, '#08081c', '#000000')
}

function drawNullHorizonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#050518')

  ctx.save()
  for (let star = 0; star < 8; star += 1) {
    const x = (star * 291) % CANVAS_WIDTH
    const y = 10 + ((star * 127) % 300)
    ctx.globalAlpha = 0.14
    ctx.fillStyle = '#c084fc'
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.restore()

  const fade = ctx.createLinearGradient(0, GROUND_Y - 60, 0, GROUND_Y)
  fade.addColorStop(0, 'rgba(192, 132, 252, 0)')
  fade.addColorStop(1, 'rgba(192, 132, 252, 0.15)')
  ctx.fillStyle = fade
  ctx.fillRect(0, GROUND_Y - 60, CANVAS_WIDTH, 60)

  drawGround(ctx, '#050518', '#000000')
}

function drawZeroPointBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#03030f')

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let ring = 1; ring <= 4; ring += 1) {
    ctx.globalAlpha = 0.18
    ctx.beginPath()
    ctx.arc(cx, cy, ring * 30, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx, cy, 3, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#03030f', '#000000')
}

function drawTheHollowBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#020208')

  const cx = CANVAS_WIDTH / 2
  const cy = 200
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.arc(cx, cy, 130, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  drawGround(ctx, '#020208', '#000000')
}

function drawEventZeroBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#020205')

  const cx = CANVAS_WIDTH / 2
  const cy = 190
  const anomaly = ctx.createRadialGradient(cx, cy, 1, cx, cy, 40)
  anomaly.addColorStop(0, '#ffffff')
  anomaly.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = anomaly
  ctx.beginPath()
  ctx.arc(cx, cy, 40, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#020205', '#000000')
}

function drawTheAbsoluteVoidBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#000000')

  const cx = CANVAS_WIDTH / 2
  const cy = CANVAS_HEIGHT / 2 - 40
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx, cy, 2, 0, Math.PI * 2)
  ctx.fill()

  drawGround(ctx, '#000000', '#000000')
}

const VOID_BACKGROUNDS = [
  drawWeightlessDriftBackground,
  drawSilentExpanseBackground,
  drawFracturedRealityBackground,
  drawEntropyFieldBackground,
  drawTheUnmooredBackground,
  drawNullHorizonBackground,
  drawZeroPointBackground,
  drawTheHollowBackground,
  drawEventZeroBackground,
  drawTheAbsoluteVoidBackground,
]

const RAW_BACKGROUNDS = [
  ...BASE_BACKGROUNDS,
  ...ILLUSTRATED_BACKGROUNDS,
  ...WORLD_TOUR_2_BACKGROUNDS,
  ...DIMENSION_BACKGROUNDS,
  ...TRENCH_BACKGROUNDS,
  ...FORGE_BACKGROUNDS,
  ...COSMIC_FRONTIER_BACKGROUNDS,
  ...VORTEX_FRONTIER_BACKGROUNDS,
  ...HELL_BACKGROUNDS,
  ...VOID_BACKGROUNDS,
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
