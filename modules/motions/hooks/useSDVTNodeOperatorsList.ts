import { BigNumber, utils } from 'ethers'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  ContractAragonAcl,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { getSDVTManagersAddressesMap } from '../utils/getManagerAddressesMap'

type NodeOperatorSummary = {
  targetValidatorsCount: BigNumber
  stuckValidatorsCount: BigNumber
  refundedValidatorsCount: BigNumber
  stuckPenaltyEndTimestamp: BigNumber
  totalExitedValidators: BigNumber
  totalDepositedValidators: BigNumber
  depositableValidatorsCount: BigNumber
  targetLimitMode: BigNumber
}

type Args = {
  withSummary?: boolean
}

export function useSDVTNodeOperatorsList(args?: Args) {
  const { chainId } = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()
  const aragonAcl = ContractAragonAcl.useRpc()

  return useSWR(
    `${chainId}-sdvt-operators-list${args?.withSummary ? '-with-summary' : ''}`,
    async () => {
      const count = (await registry.getNodeOperatorsCount()).toNumber()

      const managerAddressesMap = await getSDVTManagersAddressesMap(
        aragonAcl,
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
