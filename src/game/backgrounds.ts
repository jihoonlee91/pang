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

function drawNeuschwansteinBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#9fc6e8', '#dcecf7')
  const cx = CANVAS_WIDTH / 2
  const baseY = GROUND_Y
  ctx.fillStyle = '#6b8f5e'
  ctx.beginPath()
  ctx.moveTo(cx - 260, baseY)
  ctx.lineTo(cx - 60, baseY - 90)
  ctx.lineTo(cx + 260, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#e9e6df'
  ctx.fillRect(cx - 50, baseY - 210, 40, 130)
  ctx.fillRect(cx, baseY - 170, 60, 90)
  ctx.fillRect(cx + 70, baseY - 190, 30, 110)
  ctx.fillStyle = '#4a6fa5'
  ;[
    [cx - 30, baseY - 210, 22],
    [cx + 30, baseY - 170, 26],
    [cx + 85, baseY - 190, 18],
  ].forEach(([x, y, r]) => {
    ctx.beginPath()
    ctx.moveTo(x - r, y)
    ctx.lineTo(x, y - r * 1.3)
    ctx.lineTo(x + r, y)
    ctx.closePath()
    ctx.fill()
  })
  drawGround(ctx, '#7bb06a', '#54834a')
}

function drawColosseumBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f6c98a', '#fbe3bd')
  const cx = CANVAS_WIDTH / 2
  const baseY = GROUND_Y
  ctx.fillStyle = '#d8b88a'
  ctx.beginPath()
  ctx.ellipse(cx, baseY - 40, 240, 90, 0, Math.PI, 0, false)
  ctx.fill()
  ctx.fillStyle = '#f6c98a'
  ctx.strokeStyle = '#b89468'
  ctx.lineWidth = 3
  for (let i = -5; i <= 5; i += 1) {
    const x = cx + i * 40
    ctx.beginPath()
    ctx.arc(x, baseY - 40, 16, Math.PI, 0)
    ctx.stroke()
  }
  drawGround(ctx, '#d8c79a', '#b8a479')
}

function drawSantoriniBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#3fa9dc', '#a9e0f5')
  const baseY = GROUND_Y
  ctx.fillStyle = '#8c6a4a'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  ctx.lineTo(0, baseY - 80)
  ctx.lineTo(CANVAS_WIDTH, baseY - 40)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()
  const cubes: [number, number, number][] = [
    [160, 130, 60],
    [260, 100, 50],
    [420, 140, 70],
    [600, 90, 55],
    [720, 120, 65],
  ]
  for (const [x, h, w] of cubes) {
    ctx.fillStyle = '#f5f3ee'
    ctx.fillRect(x - w / 2, baseY - 60 - h, w, h)
    ctx.fillStyle = '#2a6fb5'
    fillEllipse(ctx, x, baseY - 60 - h, w / 2.4, w / 4)
  }
  drawGround(ctx, '#1f8fc0', '#0f5a80')
}

function drawSagradaFamiliaBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f0a94e', '#fbd9a0')
  const cx = CANVAS_WIDTH / 2
  const baseY = GROUND_Y
  ctx.fillStyle = '#c9a06a'
  const spires = [-140, -60, 0, 60, 140]
  for (const dx of spires) {
    const h = 200 - Math.abs(dx) * 0.6
    ctx.beginPath()
    ctx.moveTo(cx + dx - 18, baseY)
    ctx.lineTo(cx + dx - 10, baseY - h)
    ctx.lineTo(cx + dx, baseY - h - 30)
    ctx.lineTo(cx + dx + 10, baseY - h)
    ctx.lineTo(cx + dx + 18, baseY)
    ctx.closePath()
    ctx.fill()
  }
  drawGround(ctx, '#d8c79a', '#b8a479')
}

function drawMarrakeshBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f2a25a', '#fbd7a8')
  const baseY = GROUND_Y
  ctx.fillStyle = '#c98a4a'
  ctx.fillRect(CANVAS_WIDTH / 2 - 22, baseY - 220, 44, 220)
  ctx.beginPath()
  ctx.arc(CANVAS_WIDTH / 2, baseY - 220, 22, Math.PI, 0)
  ctx.fill()
  ctx.fillStyle = '#e8b072'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  ctx.quadraticCurveTo(200, baseY - 60, 420, baseY - 10)
  ctx.quadraticCurveTo(680, baseY + 30, CANVAS_WIDTH, baseY - 20)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()
  drawGround(ctx, '#e0a860', '#b87f3f')
}

function drawSerengetiBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f5b957', '#fbe0a0')
  const baseY = GROUND_Y
  ctx.strokeStyle = '#3a2a18'
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.moveTo(220, baseY)
  ctx.lineTo(240, baseY - 120)
  ctx.stroke()
  ctx.fillStyle = '#3a5a28'
  fillEllipse(ctx, 240, baseY - 150, 70, 26)
  fillEllipse(ctx, 190, baseY - 130, 40, 18)
  fillEllipse(ctx, 290, baseY - 135, 45, 18)
  drawGround(ctx, '#c9a850', '#a8863a')
}

function drawChristRedeemerBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#4fa8d8', '#bfe4f5')
  const cx = CANVAS_WIDTH / 2
  const baseY = GROUND_Y
  ctx.fillStyle = '#5a7a5e'
  ctx.beginPath()
  ctx.moveTo(cx - 200, baseY)
  ctx.lineTo(cx, baseY - 160)
  ctx.lineTo(cx + 200, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#e9e6df'
  ctx.fillRect(cx - 6, baseY - 250, 12, 90)
  ctx.fillRect(cx - 60, baseY - 210, 120, 12)
  fillEllipse(ctx, cx, baseY - 258, 10, 10)
  drawGround(ctx, '#7bb06a', '#54834a')
}

function drawMachuPicchuBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#8fb8c9', '#dcecf0')
  const baseY = GROUND_Y
  ctx.fillStyle = '#5f7a5a'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  ctx.lineTo(180, baseY - 180)
  ctx.lineTo(360, baseY - 60)
  ctx.lineTo(560, baseY - 200)
  ctx.lineTo(760, baseY - 40)
  ctx.lineTo(CANVAS_WIDTH, baseY - 100)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#c9b88a'
  for (let i = 0; i < 5; i += 1) {
    ctx.fillRect(300 + i * 30, baseY - 30 - i * 8, 26, 8 + i * 6)
  }
  drawGround(ctx, '#7bb06a', '#54834a')
}

function drawGrandCanyonBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#f0a85a', '#fbd9a8')
  const baseY = GROUND_Y
  const strata = ['#c9713f', '#d68a4f', '#b8622f', '#e0a05f']
  strata.forEach((color, i) => {
    ctx.fillStyle = color
    const top = baseY - 40 - i * 35
    ctx.beginPath()
    ctx.moveTo(0, top + 20)
    ctx.lineTo(300, top - 10)
    ctx.lineTo(620, top + 15)
    ctx.lineTo(CANVAS_WIDTH, top - 5)
    ctx.lineTo(CANVAS_WIDTH, baseY)
    ctx.lineTo(0, baseY)
    ctx.closePath()
    ctx.fill()
  })
  drawGround(ctx, '#c9713f', '#8a4a28')
}

function drawAuroraVillageBackground(ctx: CanvasRenderingContext2D) {
  drawSky(ctx, '#0a1a2e', '#173a4a')
  ctx.strokeStyle = '#4ade8099'
  ctx.lineWidth = 18
  ctx.beginPath()
  ctx.moveTo(60, 120)
  ctx.quadraticCurveTo(300, 40, 540, 140)
  ctx.quadraticCurveTo(720, 200, 900, 100)
  ctx.stroke()
  ctx.strokeStyle = '#a855f799'
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.moveTo(100, 170)
  ctx.quadraticCurveTo(320, 100, 560, 190)
  ctx.quadraticCurveTo(740, 240, 880, 160)
  ctx.stroke()
  const baseY = GROUND_Y
  ctx.fillStyle = '#1a2a3a'
  ctx.fillRect(CANVAS_WIDTH / 2 - 40, baseY - 50, 80, 50)
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH / 2 - 48, baseY - 50)
  ctx.lineTo(CANVAS_WIDTH / 2, baseY - 90)
  ctx.lineTo(CANVAS_WIDTH / 2 + 48, baseY - 50)
  ctx.closePath()
  ctx.fill()
  drawGround(ctx, '#eaf3f8', '#c8d8e2')
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
  drawNeuschwansteinBackground,
  drawColosseumBackground,
  drawSantoriniBackground,
  drawSagradaFamiliaBackground,
  drawMarrakeshBackground,
  drawSerengetiBackground,
  drawChristRedeemerBackground,
  drawMachuPicchuBackground,
  drawGrandCanyonBackground,
  drawAuroraVillageBackground,
]

// One hand-drawn Canvas scene per chapter (World Tour excluded — it
// already cycles through the 10 landmark scenes above), used as the
// "not cleared yet" placeholder so it actually reads as that chapter's
// theme instead of a random earlier landmark.

function drawWorldTour2Background(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  const skies: [string, string][] = [
    ['#f6c893', '#fde8c8'],
    ['#f2915a', '#fcc98a'],
    ['#e8577a', '#f6a97e'],
  ]
  const [top, bottom] = skies[depth % skies.length]
  drawSky(ctx, top, bottom)
  ctx.fillStyle = '#ffffffaa'
  fillEllipse(ctx, 150 + (depth % 4) * 30, 90 + (depth % 3) * 20, 40, 18)
  fillEllipse(ctx, 700 - (depth % 5) * 25, 140 - (depth % 4) * 15, 36, 16)
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 100
  const baseY = GROUND_Y
  const height = 160 + (depth % 5) * 20
  ctx.fillStyle = '#8a7358'
  ctx.fillRect(cx - 16, baseY - height, 32, height)
  ctx.beginPath()
  ctx.moveTo(cx - 40, baseY - height)
  ctx.lineTo(cx, baseY - height - 60)
  ctx.lineTo(cx + 40, baseY - height)
  ctx.closePath()
  ctx.fill()
  if (depth >= 5) {
    const cx2 = cx - 220
    const h2 = 100 + (depth % 4) * 15
    ctx.fillStyle = '#a08868'
    ctx.fillRect(cx2 - 10, baseY - h2, 20, h2)
    ctx.beginPath()
    ctx.moveTo(cx2 - 24, baseY - h2)
    ctx.lineTo(cx2, baseY - h2 - 36)
    ctx.lineTo(cx2 + 24, baseY - h2)
    ctx.closePath()
    ctx.fill()
  }
  drawGround(ctx, '#d8c79a', '#b8a479')
}

function drawDimensionXBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  const hues: [string, string][] = [
    ['#1b1035', '#3a1d5c'],
    ['#0a1035', '#2d1d6c'],
    ['#20081f', '#4a1d4c'],
  ]
  const [top, bottom] = hues[depth % hues.length]
  drawSky(ctx, top, bottom)
  ctx.strokeStyle = '#ff2fd0aa'
  ctx.lineWidth = 2
  const lineCount = 3 + (depth % 4)
  for (let i = -lineCount; i <= lineCount; i += 1) {
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2 + i * 80, GROUND_Y)
    ctx.lineTo(CANVAS_WIDTH / 2 + i * (200 + (depth % 3) * 20), GROUND_Y - 260)
    ctx.stroke()
  }
  ctx.fillStyle = '#4dfff2aa'
  fillEllipse(ctx, 180 + (depth % 5) * 30, 120 - (depth % 3) * 15, 30, 30)
  fillEllipse(ctx, 760 - (depth % 4) * 40, 90 + (depth % 5) * 20, 22, 22)
  drawGround(ctx, '#150a28', '#0a0518')
}

function drawTrenchBackground(ctx: CanvasRenderingContext2D, depth: number) {
  drawSky(
    ctx,
    depth >= 5 ? '#062338' : '#0a3350',
    depth >= 5 ? '#083d55' : '#0c5a7a',
  )
  ctx.fillStyle = '#ffffff33'
  const bubbles: [number, number, number][] = [
    [120, 300, 6],
    [260, 220, 4],
    [500, 340, 5],
    [680, 180, 3],
    [820, 280, 5],
  ]
  for (const [x, y, r] of bubbles) {
    fillEllipse(ctx, x + (depth % 4) * 15, y - (depth % 3) * 20, r, r)
  }
  ctx.fillStyle = '#04283f'
  const coralX = 340 + (depth % 5) * 60
  ctx.beginPath()
  ctx.moveTo(coralX, GROUND_Y)
  ctx.lineTo(coralX + 80, GROUND_Y - 60 - (depth % 3) * 10)
  ctx.lineTo(coralX + 180, GROUND_Y - 30)
  ctx.lineTo(coralX + 260, GROUND_Y)
  ctx.closePath()
  ctx.fill()
  drawGround(ctx, '#062338', '#03141f')
}

function drawStellarForgeBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#0a0714', '#241030')
  ctx.fillStyle = '#ffffff'
  const stars: [number, number][] = [
    [100, 80],
    [220, 140],
    [360, 60],
    [600, 110],
    [760, 70],
    [840, 160],
  ]
  for (const [x, y] of stars) {
    fillEllipse(ctx, x, (y + depth * 7) % 200, 2, 2)
  }
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 60
  const cy = 220 - (depth % 4) * 15
  const radius = 120 + (depth % 5) * 8
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius)
  glow.addColorStop(0, '#ffd27a')
  glow.addColorStop(1, '#ffd27a00')
  ctx.fillStyle = glow
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
  ctx.fillStyle = '#ff9d3d'
  fillEllipse(ctx, cx, cy, 40 + (depth % 3) * 4, 40 + (depth % 3) * 4)
  drawGround(ctx, '#2a1a12', '#160c08')
}

function drawCosmicFrontierBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#170a2e', '#3a1a5c')
  ctx.fillStyle = '#a855f755'
  fillEllipse(ctx, 260 + (depth % 4) * 40, 160 - (depth % 3) * 20, 140, 70)
  ctx.fillStyle = '#38bdf855'
  fillEllipse(ctx, 620 - (depth % 5) * 30, 220 + (depth % 3) * 15, 160, 80)
  ctx.fillStyle = '#fef08a'
  fillEllipse(ctx, CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 50, 250, 30, 30)
  drawGround(ctx, '#1a0f2e', '#0d0818')
}

function drawVortexFrontierBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#050510', '#1a0a2e')
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 40
  const cy = 240
  const rotation = 0.4 + (depth % 5) * 0.15
  ctx.strokeStyle = '#c084fc88'
  ctx.lineWidth = 4
  const ringCount = 3 + (depth % 4)
  for (let i = 0; i < ringCount; i += 1) {
    const r = 30 + i * 30
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.4, rotation, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#f5f3ff'
  fillEllipse(ctx, cx, cy, 14, 14)
  drawGround(ctx, '#0d0818', '#05030c')
}

function drawHellBackground(ctx: CanvasRenderingContext2D, depth: number) {
  drawSky(ctx, '#3a0a0a', depth >= 5 ? '#a8380f' : '#8a2b12')
  const baseY = GROUND_Y
  const basePeaks: [number, number][] = [
    [80, 60],
    [220, 140],
    [380, 90],
    [540, 160],
    [700, 100],
    [860, 70],
  ]
  const peaks: [number, number][] = basePeaks.map(([x, h], i) => [
    x,
    h + (((i + depth) % 4) - 1) * 20,
  ])
  ctx.fillStyle = '#1a0503'
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  for (const [x, h] of peaks) ctx.lineTo(x, baseY - h)
  ctx.lineTo(CANVAS_WIDTH, baseY)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#ff7a1e'
  const emberCount = 3 + (depth % 4)
  for (let i = 0; i < emberCount; i += 1) {
    const [x] = peaks[i % peaks.length]
    fillEllipse(ctx, x + i * 6, baseY - 10 - (i % 3) * 8, 5, 5)
  }
  drawGround(ctx, '#3a0e04', '#170502')
}

function drawVoidBackground(ctx: CanvasRenderingContext2D, depth: number) {
  drawSky(ctx, '#030308', '#0a0a14')
  ctx.fillStyle = '#ffffff'
  const baseStars: [number, number][] = [
    [100, 90],
    [300, 180],
    [500, 60],
    [700, 220],
    [820, 120],
    [180, 260],
    [600, 300],
  ]
  for (const [x, y] of baseStars) {
    fillEllipse(
      ctx,
      (x + depth * 23) % CANVAS_WIDTH,
      (y + depth * 17) % GROUND_Y,
      1.5,
      1.5,
    )
  }
  const extra = depth % 5
  for (let i = 0; i < extra; i += 1) {
    fillEllipse(
      ctx,
      (i * 173 + depth * 41) % CANVAS_WIDTH,
      (i * 97 + depth * 31) % GROUND_Y,
      1.2,
      1.2,
    )
  }
  drawGround(ctx, '#08080f', '#020204')
}

function drawToxicMarshBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#33401c', '#6b7a2e')
  ctx.fillStyle = '#1c2b12'
  fillEllipse(ctx, 700 - (depth % 4) * 40, GROUND_Y - 10, 220, 26)
  fillEllipse(ctx, 200 + (depth % 3) * 30, GROUND_Y - 20, 180, 20)
  ctx.strokeStyle = '#0a1206'
  ctx.lineWidth = 6
  const trees = [140, 260, 620, 780].map((x) => x + ((depth % 3) - 1) * 20)
  for (const x of trees) {
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y)
    ctx.lineTo(x - 10, GROUND_Y - 90 - (depth % 3) * 10)
    ctx.stroke()
  }
  drawGround(ctx, '#4c5a22', '#2c3714')
}

function drawFrozenSummitBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  const skies: [string, string][] = [
    ['#bfe3f5', '#eef8ff'],
    ['#9fd0ec', '#dcf0ff'],
    ['#5a7ca8', '#b8d8ec'],
  ]
  const [top, bottom] = skies[depth % skies.length]
  drawSky(ctx, top, bottom)
  const baseY = GROUND_Y
  const basePeaks: [number, number][] = [
    [100, 180],
    [300, 260],
    [500, 200],
    [700, 280],
    [880, 160],
  ]
  const peaks: [number, number][] = basePeaks.map(([x, h], i) => [
    x,
    h + (((i + depth) % 3) - 1) * 30,
  ])
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

function drawSolarStormBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#3a0f00', '#ff8a1e')
  const cx = CANVAS_WIDTH / 2
  const cy = 220
  const radius = 200 + (depth % 4) * 10
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius)
  glow.addColorStop(0, '#fff3c4')
  glow.addColorStop(1, '#fff3c400')
  ctx.fillStyle = glow
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
  ctx.strokeStyle = '#ffd27a'
  ctx.lineWidth = 3
  const flareCount = 6 + (depth % 4)
  const angleOffset = (depth % 6) * (Math.PI / 12)
  for (let i = 0; i < flareCount; i += 1) {
    const a = angleOffset + (i * Math.PI * 2) / flareCount
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60)
    ctx.lineTo(cx + Math.cos(a) * 180, cy + Math.sin(a) * 180)
    ctx.stroke()
  }
  ctx.fillStyle = '#fff7de'
  fillEllipse(ctx, cx, cy, 50, 50)
  drawGround(ctx, '#4a1400', '#220900')
}

function drawQuantumRiftBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#0a0f1e', '#141b33')
  const dx = (depth % 5) * 12 - 24
  const dy = (depth % 4) * 10 - 15
  ctx.strokeStyle = '#4dfff2'
  ctx.lineWidth = 2
  ctx.strokeRect(140 + dx, 80 + dy, 220, 180)
  ctx.strokeStyle = '#ff2fd0'
  ctx.strokeRect(170 - dx, 110 - dy, 220, 180)
  ctx.strokeStyle = '#facc15'
  ctx.strokeRect(560 + dy, 140 + dx, 200, 160)
  if (depth >= 6) {
    ctx.strokeStyle = '#4ade80'
    ctx.strokeRect(60 - dy, 240 + dx, 150, 120)
  }
  drawGround(ctx, '#0d1226', '#060a14')
}

function drawOverdriveNexusBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  const cx = CANVAS_WIDTH / 2
  const sky = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0)
  sky.addColorStop(0, '#3f0f1c')
  sky.addColorStop(0.5, '#150a28')
  sky.addColorStop(1, '#0a1a3f')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
  const spread = 100 + (depth % 5) * 20
  const yOffset = (depth % 3) * 20
  ctx.fillStyle = '#e83e48'
  fillEllipse(ctx, cx - spread, 220 - yOffset, 36, 36)
  ctx.fillStyle = '#38bdf8'
  fillEllipse(ctx, cx + spread, 220 + yOffset, 36, 36)
  drawGround(ctx, '#1a0a1e', '#0a0512')
}

function drawFracturedGatewayBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#2a0a1e', '#0a1a3f')
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 50
  const archWidth = 100 + (depth % 4) * 20
  ctx.strokeStyle = '#e879f9'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(cx - archWidth, GROUND_Y)
  ctx.quadraticCurveTo(cx - archWidth, 100, cx, 80)
  ctx.quadraticCurveTo(cx + archWidth, 100, cx + archWidth, GROUND_Y)
  ctx.stroke()
  ctx.strokeStyle = '#38bdf8aa'
  ctx.lineWidth = 2
  const boltX = cx - 30 + (depth % 5) * 15
  ctx.beginPath()
  ctx.moveTo(boltX, 150)
  ctx.lineTo(boltX + 40, 220)
  ctx.lineTo(boltX + 20, 260)
  ctx.stroke()
  drawGround(ctx, '#1a0a18', '#0a0410')
}

function drawStormCitadelBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#1a2438', '#38506e')
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 60
  const towerH = 200 + (depth % 4) * 15
  const sideH1 = 120 + (depth % 3) * 10
  const sideH2 = 140 + (depth % 2) * 20
  ctx.fillStyle = '#0f1622'
  ctx.fillRect(cx - 30, GROUND_Y - towerH, 60, towerH)
  ctx.fillRect(cx - 90, GROUND_Y - sideH1, 40, sideH1)
  ctx.fillRect(cx + 50, GROUND_Y - sideH2, 40, sideH2)
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 3
  const boltX = 260 + (depth % 5) * 80
  ctx.beginPath()
  ctx.moveTo(boltX, 60)
  ctx.lineTo(boltX + 30, 140)
  ctx.lineTo(boltX + 10, 140)
  ctx.lineTo(boltX + 40, 220)
  ctx.stroke()
  drawGround(ctx, '#2a3548', '#141c2a')
}

function drawMoltenMaelstromBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#2a0500', '#7a2000')
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 40
  const cy = 240
  const rotation = 0.3 + (depth % 5) * 0.12
  ctx.strokeStyle = '#ff7a1eaa'
  ctx.lineWidth = 5
  const ringCount = 3 + (depth % 4)
  for (let i = 0; i < ringCount; i += 1) {
    const r = 20 + i * 28
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.5, rotation, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#ffd27a'
  fillEllipse(ctx, cx, cy, 16, 16)
  drawGround(ctx, '#3a0a00', '#1a0400')
}

function drawPrismCollapseBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#0a0a1e', '#1a1030')
  const baseShards: [string, number, number][] = [
    ['#38bdf8', 160, 120],
    ['#e879f9', 360, 90],
    ['#facc15', 560, 140],
    ['#4ade80', 740, 110],
  ]
  for (const [color, x, y] of baseShards) {
    const sx = x + ((depth % 5) - 2) * 20
    const sy = y + ((depth % 3) - 1) * 20
    const size = 28 + (depth % 3) * 6
    ctx.fillStyle = color + 'aa'
    ctx.beginPath()
    ctx.moveTo(sx, sy - size)
    ctx.lineTo(sx + size * 0.7, sy)
    ctx.lineTo(sx, sy + size * 1.25)
    ctx.lineTo(sx - size * 0.7, sy)
    ctx.closePath()
    ctx.fill()
  }
  drawGround(ctx, '#100a20', '#080512')
}

function drawFinalSingularityBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#fff7de', '#ffd27a')
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 40
  const cy = 230
  const radius = 200 + (depth % 5) * 10
  const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius)
  glow.addColorStop(0, '#ffffff')
  glow.addColorStop(0.4, '#fff3c4')
  glow.addColorStop(1, '#fff3c400')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y)
  ctx.strokeStyle = '#ffffffaa'
  ctx.lineWidth = 2
  const rayCount = depth % 4
  for (let i = 0; i < rayCount; i += 1) {
    const a = (i * Math.PI * 2) / Math.max(rayCount, 1) + depth * 0.2
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30)
    ctx.lineTo(cx + Math.cos(a) * 200, cy + Math.sin(a) * 200)
    ctx.stroke()
  }
  ctx.fillStyle = '#ffffff'
  fillEllipse(ctx, cx, cy, 26, 26)
  drawGround(ctx, '#ffe9b8', '#f4c877')
}

function drawHiddenFinaleBackground(
  ctx: CanvasRenderingContext2D,
  depth: number,
) {
  drawSky(ctx, '#000000', '#0a0510')
  const cx = CANVAS_WIDTH / 2 + ((depth % 3) - 1) * 30
  const cy = 230
  const ringRadius = 60 + (depth % 5) * 6
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#000000'
  fillEllipse(ctx, cx, cy, ringRadius - 6, ringRadius - 6)
  drawGround(ctx, '#050208', '#000000')
}

// Keyed by chapter name (getStageChapters()) rather than position, so
// reordering/inserting chapters there can't silently desync this list.
const CHAPTER_UNREVEALED_BACKGROUNDS: Record<
  string,
  (ctx: CanvasRenderingContext2D, depth: number) => void
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
  const depth = chapter ? stageIndex - chapter.start : 0
  if (themed) themed(ctx, depth)
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
