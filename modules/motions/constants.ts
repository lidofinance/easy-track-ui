import {
  ContractEvmNodeOperatorIncreaseLimit,
  ContractEvmSandboxNodeOperatorIncreaseLimit,
  ContractNodeOperatorsRegistry,
  ContractSandboxNodeOperatorsRegistry,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'

export const MOTION_ATTENTION_PERIOD = 1 / 24

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
  sdvt: ContractSDVTRegistry,
  sandbox: ContractSandboxNodeOperatorsRegistry,
} as const

export type NodeOperatorsRegistryType = keyof typeof NODE_OPERATORS_REGISTRY_MAP

export const SIGNING_KEYS_ROLE =
  '0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee' // keccak256("MANAGE_SIGNING_KEYS")

export const MAX_MEV_BOOST_RELAYS_COUNT = 40

export const MAX_MEV_BOOST_UPDATE_COUNT = 20

export const MAX_MEV_BOOST_RELAY_STRING_LENGTH = 1024
