import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'
import { isAddress } from 'ethers/lib/utils'

export const useVaultsJailStatusMap = () => {
  const [vaultsJailStatusMap, setState] = useSimpleReducer<
    Record<string, boolean | null | undefined>
  >({})

  const operatorGrid = ContractOperatorGrid.useRpc()

  const getVaultJailStatus = useCallback(
    async (address: string) => {
      if (!isAddress(address)) {
        return null
      }

      const lowerAddress = address.toLowerCase()

      if (vaultsJailStatusMap[lowerAddress] !== undefined) {
        return vaultsJailStatusMap[lowerAddress]!
      }

      try {
        const jailStatus = await operatorGrid.isVaultInJail(lowerAddress)
        setState({ [lowerAddress]: jailStatus })
        return jailStatus
      } catch (error) {
        setState({ [lowerAddress]: null })
        return null
      }
    },
    [operatorGrid, setState, vaultsJailStatusMap],
  )

  return {
    vaultsJailStatusMap,
    getVaultJailStatus,
  }
}
