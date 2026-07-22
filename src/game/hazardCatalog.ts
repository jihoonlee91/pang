import { BREEZE_START_STAGE } from './breeze'
import { PORTAL_START_STAGE } from './portals'
import { CURRENT_START_STAGE } from './currents'
import { GRAVITY_WELL_START_STAGE } from './gravityWells'
import { NEBULA_START_STAGE } from './nebulae'
import { VORTEX_START_STAGE } from './vortices'
import { FIRE_ZONE_START_STAGE } from './fireZones'
import { VOID_START_STAGE } from './voidGravity'
import { ACID_RAIN_START_STAGE } from './acidRain'
import { ICE_WIND_START_STAGE } from './iceWinds'
import { SOLAR_FLARE_START_STAGE } from './solarFlares'
import { QUANTUM_RIFT_START_STAGE } from './quantumRifts'
import { OVERDRIVE_START_STAGE } from './overdriveWells'
import { CHAOS_RIFT_START_STAGE } from './chaosRift'

export type HazardEntry = {
  id: string
  name: string
  // 0-indexed stage the hazard first appears on.
  startStage: number
  description: string
}

export const HAZARD_CATALOG: readonly HazardEntry[] = [
  {
    id: 'breeze',
    name: 'Gentle Breeze',
    startStage: BREEZE_START_STAGE,
    description:
      '약한 바람이 공을 좌우로 살짝 밀어냅니다. 뒤이어 나오는 해류의 예고편 같은 순한 맛입니다.',
  },
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
  {
    id: 'acidRain',
    name: 'Acid Rain',
    startStage: ACID_RAIN_START_STAGE,
    description:
      '산성비가 구역을 정해 쏟아지며 플레이어에게 직접 피해를 줍니다. 점멸 경고 후 떨어지니 미리 피하세요. Umbrella 아이템으로 잠시 면역이 됩니다.',
  },
  {
    id: 'iceWind',
    name: 'Ice Wind',
    startStage: ICE_WIND_START_STAGE,
    description:
      '차가운 돌풍이 플레이어를 좌우로 밀어냅니다. Grip Boots 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'solarFlare',
    name: 'Solar Flare',
    startStage: SOLAR_FLARE_START_STAGE,
    description:
      '화면 전체가 주기적으로 눈부시게 번쩍이며 그동안 이동 속도가 느려집니다. Visor 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'quantumRift',
    name: 'Quantum Jitter',
    startStage: QUANTUM_RIFT_START_STAGE,
    description:
      '공이 이따금 양자적으로 요동쳐 순간적으로 속도가 바뀝니다. Lock-On 아이템으로 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'overdriveWells',
    name: 'Polarity Wells',
    startStage: OVERDRIVE_START_STAGE,
    description:
      '두 개의 중력점이 주기적으로 당기고 미는 극성을 뒤바꿉니다. Overdrive 아이템으로 잠시 모든 hazard를 무력화하고 점수를 더 얻을 수 있습니다.',
  },
  {
    id: 'chaosRift',
    name: 'Fractured Gateway',
    startStage: CHAOS_RIFT_START_STAGE,
    description:
      '해류와 화염 지대가 그동안 나온 것보다 더 강하게 동시에 몰아칩니다. Stabilizer로 해류를, Fireproof나 Overdrive로 화염 피해를 막을 수 있습니다.',
  },
  {
    id: 'chaosRiftStormCitadel',
    name: 'Storm Citadel',
    startStage: CHAOS_RIFT_START_STAGE + 10,
    description:
      '해류 대신 강력한 중력점이 공을 끌어당기고, 화염 지대도 계속됩니다. Stabilizer로 중력점을, Fireproof나 Overdrive로 화염 피해를 막을 수 있습니다.',
  },
  {
    id: 'chaosRiftMoltenMaelstrom',
    name: 'Molten Maelstrom',
    startStage: CHAOS_RIFT_START_STAGE + 20,
    description:
      '화염 지대 없이 해류와 중력점이 동시에 공을 밀고 당겨 궤도를 예측하기 어렵습니다. Stabilizer 아이템으로 둘 다 잠시 무력화할 수 있습니다.',
  },
  {
    id: 'chaosRiftPrismCollapse',
    name: 'Prism Collapse',
    startStage: CHAOS_RIFT_START_STAGE + 30,
    description:
      '중력점이 회전력을 더해 공을 나선형으로 빨아들이고, 화염 지대도 함께 몰아칩니다. Stabilizer로 중력점을, Fireproof나 Overdrive로 화염 피해를 막을 수 있습니다.',
  },
  {
    id: 'chaosRiftFinalSingularity',
    name: 'Final Singularity',
    startStage: CHAOS_RIFT_START_STAGE + 40,
    description:
      '해류, 중력점, 화염 지대가 동시에 몰아치는 최종 관문입니다. Stabilizer로 해류/중력점을, Fireproof나 Overdrive로 화염 피해를 막을 수 있습니다.',
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
