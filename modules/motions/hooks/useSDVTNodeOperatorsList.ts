import { BigNumber, utils } from 'ethers'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { ContractSDVTRegistry } from 'modules/blockChain/contracts'
import { getManagerAddressesMap } from '../utils/getManagerAddressesMap'

export function useSDVTNodeOperatorsList() {
  const { chainId, account } = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()

  return useSWR(
    `${registry.address}-${chainId}-${account}-operators-list`,
    async () => {
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

          const rawPermissionParam = BigNumber.from(1).shl(240).add(i)
          const permissionParam = utils.solidityKeccak256(
            ['uint256'],
            [rawPermissionParam],
          )

          const managerAddress = managerAddressesMap[permissionParam]

          return { ...nodeOperatorInfo, id: i, managerAddress }
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
