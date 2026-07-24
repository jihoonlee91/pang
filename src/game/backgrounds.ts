import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'
const STAGE_IMAGE_URLS = import.meta.glob(
  '../assets/backgrounds/stages/stage*.webp',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>

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
  'Fume Bog (Toxic Marsh)',
  'Sludge Delta (Toxic Marsh)',
  'Corroded Refinery (Toxic Marsh)',
  'Weeping Mangrove (Toxic Marsh)',
  'Caustic Falls (Toxic Marsh)',
  'Rust Wetlands (Toxic Marsh)',
  'Miasma Hollow (Toxic Marsh)',
  'Tainted Reservoir (Toxic Marsh)',
  'Verdigris Ruins (Toxic Marsh)',
  'The Toxic Delta (Toxic Marsh)',
  'Glacier Approach (Frozen Summit)',
  'Frostbite Ridge (Frozen Summit)',
  'Crystal Icefall (Frozen Summit)',
  'Windward Col (Frozen Summit)',
  'Rime Cavern (Frozen Summit)',
  'Blizzard Plateau (Frozen Summit)',
  'Frozen Cathedral (Frozen Summit)',
  'Aurora Cornice (Frozen Summit)',
  'Permafrost Spire (Frozen Summit)',
  'The Frozen Summit (Frozen Summit)',
  'Flare Horizon (Solar Storm)',
  'Sunspot Array (Solar Storm)',
  'Corona Reach (Solar Storm)',
  'Magnetic Field (Solar Storm)',
  'Photosphere Rim (Solar Storm)',
  'Radiant Chasm (Solar Storm)',
  'Prominence Arc (Solar Storm)',
  'Ion Cascade (Solar Storm)',
  'Solar Maximum (Solar Storm)',
  'The Blinding Zenith (Solar Storm)',
  'Fractured Lab (Quantum Rift)',
  'Phase Corridor (Quantum Rift)',
  'Superposition Hall (Quantum Rift)',
  'Entangled Chamber (Quantum Rift)',
  'Probability Well (Quantum Rift)',
  'Decoherence Zone (Quantum Rift)',
  'Parallel Fold (Quantum Rift)',
  'Wavefunction Collapse (Quantum Rift)',
  'Quantum Foam (Quantum Rift)',
  'The Rift Core (Quantum Rift)',
  'Redline Gate (Overdrive Nexus)',
  'Overclocked Core (Overdrive Nexus)',
  'Chaos Convergence (Overdrive Nexus)',
  'Twin Polarity (Overdrive Nexus)',
  'Maelstrom Grid (Overdrive Nexus)',
  'Final Ascent (Overdrive Nexus)',
  'Critical Mass (Overdrive Nexus)',
  'The Last Stand (Overdrive Nexus)',
  'Ultimate Overdrive (Overdrive Nexus)',
  "Orbit's End (Overdrive Nexus)",
  'Fracture Threshold (Fractured Gateway)',
  'Crimson Fault (Fractured Gateway)',
  'Cobalt Breach (Fractured Gateway)',
  'Shattered Meridian (Fractured Gateway)',
  'Riftward Gate (Fractured Gateway)',
  'Sundered Horizon (Fractured Gateway)',
  'Paradox Arch (Fractured Gateway)',
  'Broken Continuum (Fractured Gateway)',
  'Twinfire Passage (Fractured Gateway)',
  'Gateway Zero (Fractured Gateway)',
  'Stormbound Bastion (Storm Citadel)',
  'Lightning Keep (Storm Citadel)',
  'Citadel Drift (Storm Citadel)',
  'Thunder Crown (Storm Citadel)',
  'Tempest Rampart (Storm Citadel)',
  'Skyfall Fortress (Storm Citadel)',
  'Violet Battlement (Storm Citadel)',
  'Cyclone Spire (Storm Citadel)',
  'Eye of the Citadel (Storm Citadel)',
  'Storm Throne (Storm Citadel)',
  'Magma Spiral (Molten Maelstrom)',
  'Plasma Torrent (Molten Maelstrom)',
  'Ember Orbit (Molten Maelstrom)',
  'Molten Moonfall (Molten Maelstrom)',
  'Stellar Crucible (Molten Maelstrom)',
  'Cinder Maelstrom (Molten Maelstrom)',
  'Bluefire Vortex (Molten Maelstrom)',
  'Planetbreaker Flow (Molten Maelstrom)',
  'Inferno Helix (Molten Maelstrom)',
  'Cosmic Furnace (Molten Maelstrom)',
  'Prism Divide (Prism Collapse)',
  'Crystal Paradox (Prism Collapse)',
  'Refracted Void (Prism Collapse)',
  'Spectrum Fold (Prism Collapse)',
  'Mirrored Rupture (Prism Collapse)',
  'Impossible Facet (Prism Collapse)',
  'Chromatic Abyss (Prism Collapse)',
  'Shattered Rainbow (Prism Collapse)',
  'Reality Kaleidoscope (Prism Collapse)',
  'Prismatic Collapse (Prism Collapse)',
  'First Lightfall (Final Singularity)',
  'Radiant Convergence (Final Singularity)',
  'Golden Eventide (Final Singularity)',
  'Starforge Terminus (Final Singularity)',
  'Final Meridian (Final Singularity)',
  'Crown of Orbits (Final Singularity)',
  'Last Horizon (Final Singularity)',
  'Singularity Ascendant (Final Singularity)',
  'The White-Hot Core (Final Singularity)',
  "Orbit's Final Dawn (Final Singularity)",
  'Eclipse Zero (Hidden Finale)',
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

function fillEllipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
) {
  ctx.beginPath()
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawJapanBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#7dc8f0', '#cdeafd')

  ctx.fillStyle = '#ffffffaa'
  fillEllipse(ctx, 120, 90, 34, 16)
  fillEllipse(ctx, 160, 80, 26, 14)
  fillEllipse(ctx, 740, 130, 30, 15)

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
  fillEllipse(ctx, 700, 110, 60, 14)
  fillEllipse(ctx, 150, 160, 70, 16)

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

// One hand-drawn Canvas scene per chapter (World Tour excluded — it
// already cycles through the 10 landmark scenes above), used as the
// "not cleared yet" placeholder so it actually reads as that chapter's
// theme instead of a random earlier landmark.

function drawWorldTour2Background(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f6c893', '#fde8c8')
  ctx.fillStyle = '#ffffffaa'
  fillEllipse(ctx, 150, 100, 40, 18)
  fillEllipse(ctx, 700, 140, 36, 16)
  const cx = CANVAS_WIDTH / 2
  const baseY = GROUND_Y
  ctx.fillStyle = '#8a7358'
  ctx.fillRect(cx - 16, baseY - 180, 32, 180)
  ctx.beginPath()
  ctx.moveTo(cx - 40, baseY - 180)
  ctx.lineTo(cx, baseY - 240)
  ctx.lineTo(cx + 40, baseY - 180)
  ctx.closePath()
  ctx.fill()
  drawGround(ctx, '#d8c79a', '#b8a479')
}

function drawDimensionXBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1b1035', '#3a1d5c')
  ctx.strokeStyle = '#ff2fd0aa'
  ctx.lineWidth = 2
  for (let i = -4; i <= 4; i += 1) {
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2 + i * 80, GROUND_Y)
    ctx.lineTo(CANVAS_WIDTH / 2 + i * 220, GROUND_Y - 260)
    ctx.stroke()
  }
  ctx.fillStyle = '#4dfff2aa'
  fillEllipse(ctx, 180, 120, 30, 30)
  fillEllipse(ctx, 760, 90, 22, 22)
  drawGround(ctx, '#150a28', '#0a0518')
}

function drawTrenchBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a3350', '#0c5a7a')
  ctx.fillStyle = '#ffffff33'
  for (const [x, y, r] of [
    [120, 300, 6],
    [260, 220, 4],
    [500, 340, 5],
    [680, 180, 3],
    [820, 280, 5],
  ]) {
    fillEllipse(ctx, x, y, r, r)
  }
  ctx.fillStyle = '#04283f'
  ctx.beginPath()
  ctx.moveTo(340, GROUND_Y)
  ctx.lineTo(420, GROUND_Y - 60)
  ctx.lineTo(520, GROUND_Y - 30)
  ctx.lineTo(600, GROUND_Y)
  ctx.closePath()
  ctx.fill()
  drawGround(ctx, '#062338', '#03141f')
}

function drawStellarForgeBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0714', '#241030')
  ctx.fillStyle = '#ffffff'
  for (const [x, y] of [
    [100, 80],
    [220, 140],
    [360, 60],
    [600, 110],
    [760, 70],
    [840, 160],
  ]) {
    fillEllipse(ctx, x, y, 2, 2)
  }
  const glow = ctx.createRadialGradient(
    CANVAS_WIDTH / 2,
    220,
    10,
    CANVAS_WIDTH / 2,
    220,
    140,
  )
  glow.addColorStop(0, '#ffd27a')
  glow.addColorStop(1, '#ffd27a00')
  ctx.fillStyle = glow
  ctx.fillRect(CANVAS_WIDTH / 2 - 140, 80, 280, 280)
  ctx.fillStyle = '#ff9d3d'
  fillEllipse(ctx, CANVAS_WIDTH / 2, 220, 46, 46)
  drawGround(ctx, '#2a1a12', '#160c08')
}

function drawCosmicFrontierBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#170a2e', '#3a1a5c')
  ctx.fillStyle = '#a855f755'
  fillEllipse(ctx, 260, 160, 140, 70)
  ctx.fillStyle = '#38bdf855'
  fillEllipse(ctx, 620, 220, 160, 80)
  ctx.fillStyle = '#fef08a'
  fillEllipse(ctx, CANVAS_WIDTH / 2, 250, 30, 30)
  drawGround(ctx, '#1a0f2e', '#0d0818')
}

function drawVortexFrontierBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#050510', '#1a0a2e')
  const cx = CANVAS_WIDTH / 2
  const cy = 240
  ctx.strokeStyle = '#c084fc88'
  ctx.lineWidth = 4
  for (let r = 30; r < 160; r += 30) {
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.4, 0.4, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#f5f3ff'
  fillEllipse(ctx, cx, cy, 14, 14)
  drawGround(ctx, '#0d0818', '#05030c')
}

function drawHellBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#3a0a0a', '#8a2b12')
  const baseY = GROUND_Y
  const peaks: [number, number][] = [
    [80, 60],
    [220, 140],
    [380, 90],
    [540, 160],
    [700, 100],
    [860, 70],
  ]
  ctx.fillStyle = '#1a0503'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  for (const [x, h] of peaks) ctx.lineTo(x, baseY - h)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#ff7a1e'
  for (const [x] of peaks) fillEllipse(ctx, x, baseY - 10, 5, 5)
  drawGround(ctx, '#3a0e04', '#170502')
}

function drawVoidBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#030308', '#0a0a14')
  ctx.fillStyle = '#ffffff'
  for (const [x, y] of [
    [100, 90],
    [300, 180],
    [500, 60],
    [700, 220],
    [820, 120],
    [180, 260],
    [600, 300],
  ]) {
    fillEllipse(ctx, x, y, 1.5, 1.5)
  }
  drawGround(ctx, '#08080f', '#020204')
}

function drawToxicMarshBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#33401c', '#6b7a2e')
  ctx.fillStyle = '#1c2b12'
  fillEllipse(ctx, 700, GROUND_Y - 10, 220, 26)
  fillEllipse(ctx, 200, GROUND_Y - 20, 180, 20)
  ctx.strokeStyle = '#0a1206'
  ctx.lineWidth = 6
  for (const x of [140, 260, 620, 780]) {
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x - 10, GROUND_Y - 90)
    ctx.stroke()
  }
  drawGround(ctx, '#4c5a22', '#2c3714')
}

function drawFrozenSummitBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#bfe3f5', '#eef8ff')
  const baseY = GROUND_Y
  const peaks: [number, number][] = [
    [100, 180],
    [300, 260],
    [500, 200],
    [700, 280],
    [880, 160],
  ]
  ctx.fillStyle = '#c9e6f5'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  for (const [x, h] of peaks) ctx.lineTo(x, baseY - h)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  for (const [x, h] of peaks) fillEllipse(ctx, x, baseY - h + 10, 14, 8)
  drawGround(ctx, '#eaf6ff', '#c8e4f2')
}

function drawSolarStormBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#3a0f00', '#ff8a1e')
  const cx = CANVAS_WIDTH / 2
  const cy = 220
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220)
  glow.addColorStop(0, '#fff3c4')
  glow.addColorStop(1, '#fff3c400')
  ctx.fillStyle = glow
  ctx.fillRect(cx - 220, cy - 220, 440, 440)
  ctx.strokeStyle = '#ffd27a'
  ctx.lineWidth = 3
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60)
    ctx.lineTo(cx + Math.cos(a) * 180, cy + Math.sin(a) * 180)
    ctx.stroke()
  }
  ctx.fillStyle = '#fff7de'
  fillEllipse(ctx, cx, cy, 50, 50)
  drawGround(ctx, '#4a1400', '#220900')
}

function drawQuantumRiftBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0f1e', '#141b33')
  ctx.strokeStyle = '#4dfff2'
  ctx.lineWidth = 2
  ctx.strokeRect(140, 80, 220, 180)
  ctx.strokeStyle = '#ff2fd0'
  ctx.strokeRect(170, 110, 220, 180)
  ctx.strokeStyle = '#facc15'
  ctx.strokeRect(560, 140, 200, 160)
  drawGround(ctx, '#0d1226', '#060a14')
}

function drawOverdriveNexusBackground(ctx: CanvasRenderingContext2D) {
  const cx = CANVAS_WIDTH / 2
  const sky = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0)
  sky.addColorStop(0, '#3f0f1c')
  sky.addColorStop(0.5, '#150a28')
  sky.addColorStop(1, '#0a1a3f')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
  ctx.fillStyle = '#e83e48'
  fillEllipse(ctx, cx - 140, 220, 36, 36)
  ctx.fillStyle = '#38bdf8'
  fillEllipse(ctx, cx + 140, 220, 36, 36)
  drawGround(ctx, '#1a0a1e', '#0a0512')
}

function drawFracturedGatewayBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#2a0a1e', '#0a1a3f')
  const cx = CANVAS_WIDTH / 2
  ctx.strokeStyle = '#e879f9'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(cx - 120, GROUND_Y)
  ctx.quadraticCurveTo(cx - 120, 100, cx, 80)
  ctx.quadraticCurveTo(cx + 120, 100, cx + 120, GROUND_Y)
  ctx.stroke()
  ctx.strokeStyle = '#38bdf8aa'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 30, 150)
  ctx.lineTo(cx + 10, 220)
  ctx.lineTo(cx - 10, 260)
  ctx.stroke()
  drawGround(ctx, '#1a0a18', '#0a0410')
}

function drawStormCitadelBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#1a2438', '#38506e')
  const cx = CANVAS_WIDTH / 2
  ctx.fillStyle = '#0f1622'
  ctx.fillRect(cx - 30, GROUND_Y - 200, 60, 200)
  ctx.fillRect(cx - 90, GROUND_Y - 120, 40, 120)
  ctx.fillRect(cx + 50, GROUND_Y - 140, 40, 140)
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(300, 60)
  ctx.lineTo(330, 140)
  ctx.lineTo(310, 140)
  ctx.lineTo(340, 220)
  ctx.stroke()
  drawGround(ctx, '#2a3548', '#141c2a')
}

function drawMoltenMaelstromBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#2a0500', '#7a2000')
  const cx = CANVAS_WIDTH / 2
  const cy = 240
  ctx.strokeStyle = '#ff7a1eaa'
  ctx.lineWidth = 5
  for (let r = 20; r < 160; r += 28) {
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.5, 0.3, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#ffd27a'
  fillEllipse(ctx, cx, cy, 16, 16)
  drawGround(ctx, '#3a0a00', '#1a0400')
}

function drawPrismCollapseBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a0a1e', '#1a1030')
  const shards: [string, number, number][] = [
    ['#38bdf8', 160, 120],
    ['#e879f9', 360, 90],
    ['#facc15', 560, 140],
    ['#4ade80', 740, 110],
  ]
  for (const [color, x, y] of shards) {
    ctx.fillStyle = color + 'aa'
    ctx.beginPath()
    ctx.moveTo(x, y - 40)
    ctx.lineTo(x + 28, y)
    ctx.lineTo(x, y + 50)
    ctx.lineTo(x - 28, y)
    ctx.closePath()
    ctx.fill()
  }
  drawGround(ctx, '#100a20', '#080512')
}

function drawFinalSingularityBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#fff7de', '#ffd27a')
  const cx = CANVAS_WIDTH / 2
  const cy = 230
  const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 240)
  glow.addColorStop(0, '#ffffff')
  glow.addColorStop(0.4, '#fff3c4')
  glow.addColorStop(1, '#fff3c400')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
  ctx.fillStyle = '#ffffff'
  fillEllipse(ctx, cx, cy, 26, 26)
  drawGround(ctx, '#ffe9b8', '#f4c877')
}

function drawHiddenFinaleBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#000000', '#0a0510')
  const cx = CANVAS_WIDTH / 2
  const cy = 230
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cy, 70, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#000000'
  fillEllipse(ctx, cx, cy, 64, 64)
  drawGround(ctx, '#050208', '#000000')
}

// Keyed by chapter name (getStageChapters()) rather than position, so
// reordering/inserting chapters there can't silently desync this list.
const CHAPTER_UNREVEALED_BACKGROUNDS: Record<
  string,
  (ctx: CanvasRenderingContext2D) => void
> = {
  'World Tour II': drawWorldTour2Background,
  'Dimension X': drawDimensionXBackground,
  'The Trench': drawTrenchBackground,
  'Stellar Forge': drawStellarForgeBackground,
  'Cosmic Frontier': drawCosmicFrontierBackground,
  'Vortex Frontier': drawVortexFrontierBackground,
  Hell: drawHellBackground,
  Void: drawVoidBackground,
  'Toxic Marsh': drawToxicMarshBackground,
  'Frozen Summit': drawFrozenSummitBackground,
  'Solar Storm': drawSolarStormBackground,
  'Quantum Rift': drawQuantumRiftBackground,
  'Overdrive Nexus': drawOverdriveNexusBackground,
  'Fractured Gateway': drawFracturedGatewayBackground,
  'Storm Citadel': drawStormCitadelBackground,
  'Molten Maelstrom': drawMoltenMaelstromBackground,
  'Prism Collapse': drawPrismCollapseBackground,
  'Final Singularity': drawFinalSingularityBackground,
  'Hidden Finale': drawHiddenFinaleBackground,
}

// Raw URL for a stage's illustrated image, if it has one — used outside
// the Canvas renderer (e.g. an <img> for the clear-reveal transition).
export function getStageImageUrl(stageIndex: number): string | undefined {
  const stageNumber = stageIndex + 1
  const key = `../assets/backgrounds/stages/stage${String(stageNumber).padStart(
    3,
    '0',
  )}.webp`
  return STAGE_IMAGE_URLS[key]
}

function drawIllustrationLoadingBackground(ctx: CanvasRenderingContext2D) {
  const loadingGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  loadingGradient.addColorStop(0, '#111827')
  loadingGradient.addColorStop(1, '#020617')
  ctx.fillStyle = loadingGradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function createUniqueIllustratedBackground(src: string) {
  let image: HTMLImageElement | null = null

  return (ctx: CanvasRenderingContext2D) => {
    if (image?.complete && image.naturalWidth > 0) {
      ctx.save()
      // The exported stage image already includes the game's readability
      // grade, so bypass the outer filter instead of applying it twice.
      ctx.filter = 'none'
      ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.restore()
      return
    }

    drawIllustrationLoadingBackground(ctx)
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

const RAW_BACKGROUNDS = STAGE_NAMES.map((_, index) => {
  const stageNumber = index + 1
  const key = `../assets/backgrounds/stages/stage${String(stageNumber).padStart(
    3,
    '0',
  )}.webp`
  const src = STAGE_IMAGE_URLS[key]
  return src
    ? createUniqueIllustratedBackground(src)
    : (BASE_BACKGROUNDS[index] ?? drawIllustrationLoadingBackground)
})

export const BACKGROUNDS = RAW_BACKGROUNDS.map(
  (draw) => (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.filter = 'saturate(0.76) brightness(0.96)'
    draw(ctx)
    ctx.restore()
  },
)

function drawGroundLine(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#00000022'
  ctx.beginPath()
  ctx.moveTo(0, CANVAS_HEIGHT - 4)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 4)
  ctx.stroke()
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  stageIndex: number,
) {
  const draw = BACKGROUNDS[stageIndex % BACKGROUNDS.length]
  draw(ctx)
  drawGroundLine(ctx)
}

// Placeholder shown for a stage the player hasn't cleared yet — cycles
// through the 10 hand-drawn Canvas scenes (the only ones left after the
// illustrated-background pass replaced every other stage's Canvas
// function) rather than trying to fake per-stage uniqueness with no art
// to back it. Clearing the stage swaps this out for its real illustrated
// image (see the reveal transition in App.tsx).
export function drawUnrevealedBackground(
  ctx: CanvasRenderingContext2D,
  stageIndex: number,
) {
  ctx.save()
  ctx.filter = 'saturate(0.76) brightness(0.96)'
  const chapter = getStageChapters().find(
    (c) => stageIndex >= c.start && stageIndex <= c.end,
  )
  const themed = chapter
    ? CHAPTER_UNREVEALED_BACKGROUNDS[chapter.name]
    : undefined
  if (themed) themed(ctx)
  else BASE_BACKGROUNDS[stageIndex % BASE_BACKGROUNDS.length](ctx)
  ctx.restore()
  drawGroundLine(ctx)
}

export type StageChapter = {
  name: string
  start: number
  end: number
}

// Groups the flat stage list into named chapters — stages 1-30 (World
// Tour + World Tour II) don't share a common name suffix (each has its
// own country), everything after is derived from the shared
// "(Chapter Name)" suffix already in STAGE_NAMES, so a new chapter added
// there is picked up automatically with no separate range table to keep
// in sync.
export function getStageChapters(): StageChapter[] {
  // Stages 1-30 (World Tour + World Tour II) each carry their own
  // per-stage country in parens, not a shared chapter suffix like every
  // block after — so both ranges are hardcoded rather than derived.
  const chapters: StageChapter[] = [
    { name: 'World Tour', start: 0, end: 19 },
    { name: 'World Tour II', start: 20, end: 29 },
  ]
  let i = 30
  while (i < STAGE_NAMES.length) {
    const label = STAGE_NAMES[i].match(/\(([^)]+)\)$/)?.[1] ?? 'Unknown'
    let end = i
    while (
      end + 1 < STAGE_NAMES.length &&
      (STAGE_NAMES[end + 1].match(/\(([^)]+)\)$/)?.[1] ?? 'Unknown') === label
    ) {
      end += 1
    }
    chapters.push({ name: label, start: i, end })
    i = end + 1
  }
  return chapters
}
