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
  'Neon Megacity (Dimension X)',
  'Orbital Dock (Dimension X)',
  'Crystal Moon (Dimension X)',
  'Cyber Desert (Dimension X)',
  'Quantum Reactor (Dimension X)',
  'Void Cathedral (Dimension X)',
  'Plasma Ocean (Dimension X)',
  'Clockwork Nebula (Dimension X)',
  'Singularity Gate (Dimension X)',
  'Pang Core (Dimension X)',
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
  'Pang Star (Stellar Forge)',
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

const RAW_BACKGROUNDS = [
  ...BASE_BACKGROUNDS,
  ...ILLUSTRATED_BACKGROUNDS,
  ...DIMENSION_BACKGROUNDS,
  ...TRENCH_BACKGROUNDS,
  ...FORGE_BACKGROUNDS,
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
