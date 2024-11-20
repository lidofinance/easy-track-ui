import {
  ContractEvmNodeOperatorIncreaseLimit,
  ContractEvmSandboxNodeOperatorIncreaseLimit,
  ContractNodeOperatorsRegistry,
  ContractSandboxNodeOperatorsRegistry,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { MotionType, StakingModule } from 'modules/motions/types'

export const MOTION_ATTENTION_PERIOD = 1 / 24

export const periodLimitError = () =>
  'The top-up is higher than the remaining current period limit'

export const noSigningKeysRoleError =
  'Address is not allowed to manage signing keys'

export const INCREASE_LIMIT_MOTION_MAP = {
  [MotionType.NodeOperatorIncreaseLimit]: {
    evmContract: ContractEvmNodeOperatorIncreaseLimit,
    stakingModule: StakingModule.Curated,
    motionType: MotionType.NodeOperatorIncreaseLimit,
  },
  [MotionType.SandboxNodeOperatorIncreaseLimit]: {
    evmContract: ContractEvmSandboxNodeOperatorIncreaseLimit,
    stakingModule: StakingModule.Sandbox,
    motionType: MotionType.SandboxNodeOperatorIncreaseLimit,
  },
} as const

export type IncreaseLimitMotionType = keyof typeof INCREASE_LIMIT_MOTION_MAP

export const NODE_OPERATORS_REGISTRY_MAP = {
  [StakingModule.Curated]: ContractNodeOperatorsRegistry,
  [StakingModule.SimpleDVT]: ContractSDVTRegistry,
  [StakingModule.Sandbox]: ContractSandboxNodeOperatorsRegistry,
} as const
