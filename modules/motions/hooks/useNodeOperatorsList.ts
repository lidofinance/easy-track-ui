import { BigNumber, utils } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { getManagerAddressesMap } from '../utils/getManagerAddressesMap'
import { useLidoSWR } from '@lido-sdk/react'
import { CHAINS } from '@lido-sdk/constants'
import { NODE_OPERATORS_REGISTRY_MAP } from '../constants'
import { UnpackedPromise } from 'modules/shared/utils/utilTypes'
import { NodeOperatorsRegistryAbi } from 'generated'
import { StakingModule } from '../types'

type NodeOperatorSummary = UnpackedPromise<
  ReturnType<NodeOperatorsRegistryAbi['getNodeOperatorSummary']>
>

type Args = {
  module: StakingModule
  withSummary?: boolean
}

export function useNodeOperatorsList(args: Args) {
  const { chainId } = useWeb3()

  return useLidoSWR(
    [`swr:useNodeOperatorsList`, chainId, args.module, args.withSummary],
    async (
      _key: string,
      _chainId: CHAINS,
      _module: StakingModule,
      _withSummary: boolean | undefined,
    ) => {
      try {
        const registry = NODE_OPERATORS_REGISTRY_MAP[_module].connectRpc({
          chainId: _chainId,
        })
        const count = (await registry.getNodeOperatorsCount()).toNumber()
        const MANAGE_SIGNING_KEYS_ROLE = await registry.MANAGE_SIGNING_KEYS()

        const managerAddressesMap = await getManagerAddressesMap(
          registry.address,
          MANAGE_SIGNING_KEYS_ROLE,
          _chainId,
        )

        const nodeOperators = await Promise.all(
          Array.from(Array(count)).map(async (_, i) => {
            const nodeOperatorInfo = await registry.getNodeOperator(i, true)
            let nodeOperatorSummary: NodeOperatorSummary | undefined

            if (_withSummary) {
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
      } catch (error) {
        return []
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
