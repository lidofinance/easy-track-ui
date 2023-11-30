import {
  ContractEvmNodeOperatorIncreaseLimit,
  ContractEvmSandboxNodeOperatorIncreaseLimit,
  ContractNodeOperatorsRegistry,
  ContractSandboxNodeOperatorsRegistry,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'

export const MOTION_ATTENTION_PERIOD = 1 / 24

export const tokenLimitError = (
  governanceSymbol: string | undefined,
  transitionLimit: number,
) =>
  `${governanceSymbol} transition is limited by ${transitionLimit.toLocaleString()}`

export const periodLimitError = () =>
  'The top-up is higher than the remaining current period limit'

export const noSigningKeysRoleError =
  'Address is not allowed to manage signing keys'

export const INCREASE_LIMIT_MOTION_MAP = {
  [MotionType.NodeOperatorIncreaseLimit]: {
    evmContract: ContractEvmNodeOperatorIncreaseLimit,
    registryType: 'curated',
    motionType: MotionType.NodeOperatorIncreaseLimit,
  },
  [MotionType.SandboxNodeOperatorIncreaseLimit]: {
    evmContract: ContractEvmSandboxNodeOperatorIncreaseLimit,
    registryType: 'sandbox',
    motionType: MotionType.SandboxNodeOperatorIncreaseLimit,
  },
} as const

export type IncreaseLimitMotionType = keyof typeof INCREASE_LIMIT_MOTION_MAP

export const NODE_OPERATORS_REGISTRY_MAP = {
  curated: ContractNodeOperatorsRegistry,
  sandbox: ContractSandboxNodeOperatorsRegistry,
} as const

export type NodeOperatorsRegistryType = keyof typeof NODE_OPERATORS_REGISTRY_MAP
