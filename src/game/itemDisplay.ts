import type { ItemType } from './types'

export const ITEM_COLORS: Record<ItemType, string> = {
  doubleWire: '#38bdf8',
  powerWire: '#22c55e',
  vulcan: '#f97316',
  clock: '#a5b4fc',
  hourglass: '#fbbf24',
  barrier: '#34d399',
  oneUp: '#f472b6',
  dynamite: '#f87171',
  speedBoost: '#2dd4bf',
  invincible: '#c084fc',
  timePlus: '#60a5fa',
  scoreBonus: '#fde047',
  stabilizer: '#22d3ee',
  novaSurge: '#fb923c',
  fireproof: '#f87171',
  anchor: '#94a3b8',
  magnet: '#f43f5e',
  comboLock: '#facc15',
  shockwave: '#818cf8',
  umbrella: '#84cc16',
  gripBoots: '#38bdf8',
  visor: '#fbbf24',
  lockOn: '#a855f7',
  overdrive: '#ef4444',
}

export const ITEM_TITLES: Record<ItemType, string> = {
  doubleWire: 'Double Wire',
  powerWire: 'Power Harpoon',
  vulcan: 'Vulcan',
  clock: 'Time Stop',
  hourglass: 'Slow Motion',
  barrier: 'Barrier',
  oneUp: '1UP',
  dynamite: 'Dynamite',
  speedBoost: 'Speed Boost',
  invincible: 'Invincible',
  timePlus: 'Time Plus',
  scoreBonus: 'Score Bonus',
  stabilizer: 'Stabilizer',
  novaSurge: 'Nova Surge',
  fireproof: 'Fireproof',
  anchor: 'Anchor',
  magnet: 'Magnet',
  comboLock: 'Combo Lock',
  shockwave: 'Shockwave',
  umbrella: 'Umbrella',
  gripBoots: 'Grip Boots',
  visor: 'Visor',
  lockOn: 'Lock-On',
  overdrive: 'Overdrive',
}

export const ITEM_DESCRIPTIONS: Record<ItemType, string> = {
  doubleWire: '12초 동안 작살을 2개까지 동시에 발사합니다.',
  powerWire:
    '6초 동안 장애물이나 천장까지 닿아 5초간 남는 강화 작살을 발사합니다.',
  vulcan: '12초 동안 빠른 탄환을 연속 발사합니다.',
  clock: '6초 동안 모든 공의 움직임을 멈춥니다.',
  hourglass: '8초 동안 모든 공을 느리게 만듭니다.',
  barrier: '공과 충돌했을 때 피해를 한 번 막아줍니다.',
  oneUp: 'HP를 1 회복합니다.',
  dynamite: '모든 공을 즉시 가장 작은 크기로 분열시킵니다.',
  speedBoost: '10초 동안 이동 속도가 60% 증가합니다.',
  invincible: '8초 동안 공에 닿아도 피해를 받지 않습니다.',
  timePlus: '남은 제한시간이 즉시 15초 증가합니다.',
  scoreBonus: '누적 점수를 즉시 1,000점 추가합니다.',
  stabilizer: '8초 동안 조류/중력 우물/성운/소용돌이 효과를 무력화합니다.',
  novaSurge: '10초 동안 공을 맞혀 얻는 점수가 2배가 됩니다.',
  fireproof: '8초 동안 화염 지대에 닿아도 피해를 받지 않습니다.',
  magnet: '8초 동안 떨어지는 아이템이 플레이어 쪽으로 끌려옵니다.',
  comboLock: '10초 동안 콤보가 시간이 지나도 끊기지 않습니다.',
  shockwave: '화면의 모든 공을 즉시 한 단계씩 작게 분열시키고 점수를 얻습니다.',
  anchor: '8초 동안 중력을 정상으로 되돌립니다.',
  umbrella: '8초 동안 산성비에 맞아도 피해를 받지 않습니다.',
  gripBoots: '8초 동안 얼음 돌풍에 밀리지 않습니다.',
  visor: '8초 동안 태양 플레어의 눈부심에도 이동 속도가 느려지지 않습니다.',
  lockOn: '8초 동안 공의 양자 요동(순간이동)이 발생하지 않습니다.',
  overdrive: '8초 동안 모든 hazard 피해를 막고 점수를 1.5배로 획득합니다.',
}

function traceShield(ctx: CanvasRenderingContext2D, scale = 1) {
  ctx.beginPath()
  ctx.moveTo(0, -11 * scale)
  ctx.lineTo(9 * scale, -7 * scale)
  ctx.lineTo(8 * scale, 3 * scale)
  ctx.quadraticCurveTo(6 * scale, 10 * scale, 0, 13 * scale)
  ctx.quadraticCurveTo(-6 * scale, 10 * scale, -8 * scale, 3 * scale)
  ctx.lineTo(-9 * scale, -7 * scale)
  ctx.closePath()
}

function traceStar(
  ctx: CanvasRenderingContext2D,
  outer: number,
  inner: number,
) {
  ctx.beginPath()
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outer : inner
    const angle = -Math.PI / 2 + (Math.PI * point) / 5
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (point === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

export function drawFallingItemIcon(
  ctx: CanvasRenderingContext2D,
  type: ItemType,
  color: string,
) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#ffffff'
  ctx.fillStyle = color
  ctx.lineWidth = 2.2

  switch (type) {
    case 'doubleWire':
      for (const x of [-5, 5]) {
        ctx.beginPath()
        ctx.moveTo(x, 10)
        ctx.lineTo(x, -8)
        ctx.moveTo(x - 3, -5)
        ctx.lineTo(x, -10)
        ctx.lineTo(x + 3, -5)
        ctx.stroke()
      }
      break
    case 'powerWire':
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.lineTo(0, -7)
      ctx.stroke()
      ctx.fillStyle = '#fef08a'
      ctx.beginPath()
      ctx.moveTo(0, -13)
      ctx.lineTo(-6, -5)
      ctx.lineTo(6, -5)
      ctx.closePath()
      ctx.fill()
      break
    case 'vulcan':
      ctx.save()
      ctx.rotate(-0.18)
      ctx.fillStyle = '#fb923c'
      ctx.fillRect(-8, -5, 11, 11)
      ctx.fillStyle = '#e2e8f0'
      for (const y of [-6, -1, 4]) ctx.fillRect(2, y, 11, 3)
      ctx.fillStyle = '#64748b'
      ctx.fillRect(-3, 5, 5, 8)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.strokeRect(-8, -5, 11, 11)
      ctx.restore()
      break
    case 'clock':
      ctx.beginPath()
      ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#0f172a'
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -6)
      ctx.moveTo(0, 0)
      ctx.lineTo(5, 3)
      ctx.stroke()
      break
    case 'hourglass':
      ctx.strokeStyle = '#fef3c7'
      ctx.beginPath()
      ctx.moveTo(-8, -11)
      ctx.lineTo(8, -11)
      ctx.moveTo(-8, 11)
      ctx.lineTo(8, 11)
      ctx.moveTo(-6, -9)
      ctx.quadraticCurveTo(-5, -2, 0, 0)
      ctx.quadraticCurveTo(5, 3, 6, 9)
      ctx.moveTo(6, -9)
      ctx.quadraticCurveTo(5, -2, 0, 0)
      ctx.quadraticCurveTo(-5, 3, -6, 9)
      ctx.stroke()
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.moveTo(-4, 7)
      ctx.lineTo(4, 7)
      ctx.lineTo(0, 2)
      ctx.closePath()
      ctx.fill()
      break
    case 'barrier':
      traceShield(ctx)
      ctx.fillStyle = '#34d399'
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#064e3b'
      ctx.beginPath()
      ctx.moveTo(0, -7)
      ctx.lineTo(0, 8)
      ctx.moveTo(-6, -4)
      ctx.lineTo(6, -4)
      ctx.stroke()
      break
    case 'oneUp':
      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.bezierCurveTo(-13, 1, -11, -9, -5, -9)
      ctx.bezierCurveTo(-2, -9, 0, -6, 0, -4)
      ctx.bezierCurveTo(0, -6, 2, -9, 5, -9)
      ctx.bezierCurveTo(11, -9, 13, 1, 0, 10)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(0, -4)
      ctx.lineTo(0, 4)
      ctx.moveTo(-4, 0)
      ctx.lineTo(4, 0)
      ctx.stroke()
      break
    case 'dynamite':
      ctx.save()
      ctx.rotate(-0.12)
      ctx.fillStyle = '#ef4444'
      for (const x of [-7, 0, 7]) {
        ctx.fillRect(x - 3, -9, 6, 18)
      }
      ctx.fillStyle = '#111827'
      ctx.fillRect(-11, -3, 22, 6)
      ctx.strokeStyle = '#fef3c7'
      ctx.beginPath()
      ctx.moveTo(7, -9)
      ctx.quadraticCurveTo(12, -15, 14, -10)
      ctx.stroke()
      ctx.fillStyle = '#fde047'
      ctx.beginPath()
      ctx.arc(14, -10, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      break
    case 'speedBoost':
      ctx.strokeStyle = '#5eead4'
      ctx.lineWidth = 3
      for (const offset of [-6, 1, 8]) {
        ctx.beginPath()
        ctx.moveTo(-9, offset - 6)
        ctx.lineTo(0, offset)
        ctx.lineTo(-9, offset + 6)
        ctx.moveTo(1, offset - 6)
        ctx.lineTo(10, offset)
        ctx.lineTo(1, offset + 6)
        ctx.stroke()
      }
      break
    case 'invincible':
      traceShield(ctx, 1.05)
      ctx.fillStyle = '#7e22ce'
      ctx.fill()
      ctx.stroke()
      traceStar(ctx, 7, 3.2)
      ctx.fillStyle = '#fef08a'
      ctx.fill()
      break
    case 'timePlus':
      ctx.beginPath()
      ctx.arc(-3, 1, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#0f172a'
      ctx.beginPath()
      ctx.moveTo(-3, 1)
      ctx.lineTo(-3, -5)
      ctx.moveTo(-3, 1)
      ctx.lineTo(1, 4)
      ctx.stroke()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(7, -7)
      ctx.lineTo(7, 3)
      ctx.moveTo(2, -2)
      ctx.lineTo(12, -2)
      ctx.stroke()
      break
    case 'scoreBonus':
      ctx.beginPath()
      ctx.arc(0, 0, 11, 0, Math.PI * 2)
      ctx.fillStyle = '#facc15'
      ctx.fill()
      ctx.stroke()
      traceStar(ctx, 7, 3.2)
      ctx.fillStyle = '#fff7b2'
      ctx.fill()
      break
    case 'stabilizer':
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(0, -8, 3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -5)
      ctx.lineTo(0, 9)
      ctx.moveTo(-6, -1)
      ctx.lineTo(6, -1)
      ctx.moveTo(0, 9)
      ctx.quadraticCurveTo(-7, 9, -7, 2)
      ctx.moveTo(0, 9)
      ctx.quadraticCurveTo(7, 9, 7, 2)
      ctx.stroke()
      break
    case 'novaSurge':
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = 2
      for (let ray = 0; ray < 8; ray += 1) {
        const angle = (ray / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6)
        ctx.lineTo(Math.cos(angle) * 11, Math.sin(angle) * 11)
        ctx.stroke()
      }
      break
    case 'fireproof':
      ctx.beginPath()
      ctx.moveTo(0, -10)
      ctx.quadraticCurveTo(-7, -2, -4, 4)
      ctx.quadraticCurveTo(-6, 8, 0, 9)
      ctx.quadraticCurveTo(6, 8, 4, 2)
      ctx.quadraticCurveTo(7, 0, 4, -6)
      ctx.quadraticCurveTo(2, -2, 0, -10)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#f8fafc'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-9, 9)
      ctx.lineTo(9, -9)
      ctx.stroke()
      break
    case 'anchor':
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(0, -7, 3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -4)
      ctx.lineTo(0, 8)
      ctx.moveTo(-7, -1)
      ctx.lineTo(7, -1)
      ctx.moveTo(-6, 5)
      ctx.quadraticCurveTo(-6, 9, 0, 9)
      ctx.moveTo(6, 5)
      ctx.quadraticCurveTo(6, 9, 0, 9)
      ctx.stroke()
      break
    case 'magnet':
      ctx.lineWidth = 5
      ctx.lineCap = 'butt'
      ctx.strokeStyle = '#e2e8f0'
      ctx.beginPath()
      ctx.arc(0, -1, 7, Math.PI, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = '#ef4444'
      ctx.beginPath()
      ctx.moveTo(-7, -1)
      ctx.lineTo(-7, 8)
      ctx.stroke()
      ctx.strokeStyle = '#60a5fa'
      ctx.beginPath()
      ctx.moveTo(7, -1)
      ctx.lineTo(7, 8)
      ctx.stroke()
      break
    case 'comboLock':
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(0, -4, 5, Math.PI, 0)
      ctx.stroke()
      ctx.fillStyle = '#facc15'
      ctx.fillRect(-7, -3, 14, 12)
      ctx.strokeRect(-7, -3, 14, 12)
      ctx.fillStyle = '#78350f'
      ctx.beginPath()
      ctx.arc(0, 3, 2, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'shockwave':
      ctx.lineWidth = 2
      ctx.strokeStyle = color
      for (const r of [4, 8, 12]) {
        ctx.globalAlpha = 1 - r / 14
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      break
    case 'umbrella':
      ctx.beginPath()
      ctx.moveTo(-10, -2)
      ctx.quadraticCurveTo(-10, -10, 0, -10)
      ctx.quadraticCurveTo(10, -10, 10, -2)
      ctx.lineTo(6, -4)
      ctx.lineTo(2, -2)
      ctx.lineTo(-2, -4)
      ctx.lineTo(-6, -2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#365314'
      ctx.beginPath()
      ctx.moveTo(0, -2)
      ctx.lineTo(0, 9)
      ctx.quadraticCurveTo(-5, 9, -5, 5)
      ctx.stroke()
      break
    case 'gripBoots':
      ctx.beginPath()
      ctx.moveTo(-6, -9)
      ctx.lineTo(2, -9)
      ctx.lineTo(2, 1)
      ctx.lineTo(9, 1)
      ctx.quadraticCurveTo(11, 1, 11, 4)
      ctx.lineTo(11, 7)
      ctx.lineTo(-6, 7)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 1.6
      for (const x of [-3, 1, 5, 9]) {
        ctx.beginPath()
        ctx.moveTo(x, 7)
        ctx.lineTo(x, 10)
        ctx.stroke()
      }
      break
    case 'visor':
      ctx.beginPath()
      ctx.ellipse(0, -1, 10, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(-9, -1)
      ctx.lineTo(9, -1)
      ctx.stroke()
      ctx.strokeStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(-10, -1)
      ctx.lineTo(-13, -5)
      ctx.moveTo(10, -1)
      ctx.lineTo(13, -5)
      ctx.stroke()
      break
    case 'lockOn':
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, 9, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -12)
      ctx.lineTo(0, -6)
      ctx.moveTo(0, 6)
      ctx.lineTo(0, 12)
      ctx.moveTo(-12, 0)
      ctx.lineTo(-6, 0)
      ctx.moveTo(6, 0)
      ctx.lineTo(12, 0)
      ctx.stroke()
      break
    case 'overdrive':
      ctx.beginPath()
      ctx.arc(0, 0, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#fef08a'
      ctx.beginPath()
      ctx.moveTo(2, -9)
      ctx.lineTo(-5, 1)
      ctx.lineTo(0, 1)
      ctx.lineTo(-2, 9)
      ctx.lineTo(6, -2)
      ctx.lineTo(1, -2)
      ctx.closePath()
      ctx.fill()
      break
  }
}
