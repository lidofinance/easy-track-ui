import { BigNumber, utils } from 'ethers'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  ContractSDVTRegistry,
  ContractSDVTRegistryV2,
} from 'modules/blockChain/contracts'
import { getManagerAddressesMap } from '../utils/getManagerAddressesMap'

type NodeOperatorSummary = {
  targetValidatorsCount: BigNumber
  stuckValidatorsCount: BigNumber
  refundedValidatorsCount: BigNumber
  stuckPenaltyEndTimestamp: BigNumber
  totalExitedValidators: BigNumber
  totalDepositedValidators: BigNumber
  depositableValidatorsCount: BigNumber
  // TODO: fix type once v2 is merged with v1
  isTargetLimitActive?: any
  targetLimitMode?: any
}

type Args = {
  withSummary?: boolean
  v2?: boolean
}

export function useSDVTNodeOperatorsList(args?: Args) {
  const { chainId, account } = useWeb3()

  return useSWR(
    `${chainId}-${account}-${args?.v2 ? 'v2' : 'v1'}-operators-list${
      args?.withSummary ? '-with-summary' : ''
    }`,
    async () => {
      const registry = (
        args?.v2 ? ContractSDVTRegistryV2 : ContractSDVTRegistry
      ).connectRpc({ chainId })
      const count = (await registry.getNodeOperatorsCount()).toNumber()
      const MANAGE_SIGNING_KEYS_ROLE = await registry.MANAGE_SIGNING_KEYS()

      const managerAddressesMap = await getManagerAddressesMap(
        registry.address,
        MANAGE_SIGNING_KEYS_ROLE,
        chainId,
      )

      const nodeOperators = await Promise.all(
        Array.from(Array(count)).map(async (_, i) => {
          const nodeOperatorInfo = await registry.getNodeOperator(i, true)
          let nodeOperatorSummary: NodeOperatorSummary | undefined

          if (args?.withSummary) {
            nodeOperatorSummary = await registry.getNodeOperatorSummary(i)
          }

          const rawPermissionParam = BigNumber.from(1).shl(240).add(i)
          const permissionParam = utils.solidityKeccak256(
            ['uint256'],
            [rawPermissionParam],
          )

          const managerAddress = managerAddressesMap[permissionParam]

          return {
            ...nodeOperatorInfo,
            id: i,
            managerAddress,
            ...nodeOperatorSummary,
          }
        }),
      )
      return nodeOperators
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
