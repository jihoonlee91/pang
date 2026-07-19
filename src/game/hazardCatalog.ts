import { PORTAL_START_STAGE } from './portals'
import { CURRENT_START_STAGE } from './currents'
import { GRAVITY_WELL_START_STAGE } from './gravityWells'
import { NEBULA_START_STAGE } from './nebulae'
import { VORTEX_START_STAGE } from './vortices'
import { FIRE_ZONE_START_STAGE } from './fireZones'
import { VOID_START_STAGE } from './voidGravity'

export type HazardEntry = {
  id: string
  name: string
  // 0-indexed stage the hazard first appears on.
  startStage: number
  description: string
}

export const HAZARD_CATALOG: readonly HazardEntry[] = [
  {
    id: 'portals',
    name: 'Dimension Portals',
    startStage: PORTAL_START_STAGE,
    description:
      '공이 포탈에 닿으면 반대편 포탈로 순간이동합니다. 위치를 잘 기억해두세요.',
  },
  {
    id: 'current',
    name: 'Undersea Current',
    startStage: CURRENT_START_STAGE,
    description:
      '좌우로 흔들리는 해류가 공을 계속 밀어냅니다. Stabilizer 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'gravityWell',
    name: 'Gravity Well',
    startStage: GRAVITY_WELL_START_STAGE,
    description:
      '화면에 고정된 중력점이 공을 끌어당깁니다. Stabilizer 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'nebulaField',
    name: 'Nebula Field',
    startStage: NEBULA_START_STAGE,
    description:
      '약한 중력점 두 개가 동시에 공을 끌어당깁니다. Stabilizer 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'vortex',
    name: 'Vortex',
    startStage: VORTEX_START_STAGE,
    description:
      '중력점이 회전력을 더해 공이 나선형으로 빨려듭니다. Stabilizer 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'fireZones',
    name: 'Fire Zones',
    startStage: FIRE_ZONE_START_STAGE,
    description:
      '바닥에서 화염이 주기적으로 솟아올라 플레이어에게 직접 피해를 줍니다. 점멸 경고 후 발화하니 미리 피하세요. Fireproof 아이템으로 잠시 면역이 됩니다.',
  },
  {
    id: 'lowGravity',
    name: 'Low Gravity',
    startStage: VOID_START_STAGE,
    description:
      '중력이 거의 사라져 공이 둥둥 떠다닙니다. Anchor 아이템으로 잠시 중력을 되돌릴 수 있습니다.',
  },
]

// Returns the hazard that FIRST appears on this exact stage (not just any
// hazard active there) — used to show a one-time explanation only when a
// player crosses into genuinely new territory, not on every stage within
// an already-familiar block.
export function getHazardIntroForStage(stageIndex: number): HazardEntry | null {
  return (
    HAZARD_CATALOG.find((hazard) => hazard.startStage === stageIndex) ?? null
  )
}
