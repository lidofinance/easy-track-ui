import { StakingVaultAbi__factory } from 'generated'
import {
  ContractOperatorGrid,
  ContractVaultHub,
} from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'

type VaultTierInfo = {
  isVaultConnected: boolean
  isPendingDisconnect: boolean
  infraFeeBP: number
  liquidityFeeBP: number
  reservationFeeBP: number
}

export const useVaultTierInfoMap = () => {
  const { library } = useWeb3()
  const [vaultMap, setState] = useSimpleReducer<
    Record<string, VaultTierInfo | null | undefined>
  >({})
  const operatorGrid = ContractOperatorGrid.useRpc()
  const vaultHub = ContractVaultHub.useRpc()

  const getVaultTierInfo = useCallback(
    async (address: string) => {
      const lowerAddress = address.toLowerCase()

      if (vaultMap[lowerAddress] !== undefined) {
        return vaultMap[lowerAddress]
      }

      try {
        const vaultContract = StakingVaultAbi__factory.connect(
          lowerAddress,
          library!,
        )

        const nodeOperator = await vaultContract.nodeOperator()

        if (!nodeOperator) {
          setState({ [lowerAddress]: null })
          return null
        }

        const isVaultConnected = await vaultHub.isVaultConnected(lowerAddress)

        if (!isVaultConnected) {
          const vaultInfo = {
            isVaultConnected,
            isPendingDisconnect: false,
            infraFeeBP: 0,
            liquidityFeeBP: 0,
            reservationFeeBP: 0,
          }
          setState({ [lowerAddress]: vaultInfo })
          return vaultInfo
        }

        const isPendingDisconnect = await vaultHub.isPendingDisconnect(
          lowerAddress,
        )

        if (isPendingDisconnect) {
          const vaultInfo = {
            isVaultConnected,
            isPendingDisconnect,
            infraFeeBP: 0,
            liquidityFeeBP: 0,
            reservationFeeBP: 0,
          }
          setState({ [lowerAddress]: vaultInfo })
          return vaultInfo
        }

        const tierInfo = await operatorGrid.vaultTierInfo(lowerAddress)

        const vaultInfo = {
          isVaultConnected,
          isPendingDisconnect,
          infraFeeBP: tierInfo.infraFeeBP.toNumber(),
          liquidityFeeBP: tierInfo.liquidityFeeBP.toNumber(),
          reservationFeeBP: tierInfo.reservationFeeBP.toNumber(),
        }

        setState({ [lowerAddress]: vaultInfo })

        return vaultInfo
      } catch (error) {
        setState({ [lowerAddress]: null })
        return null
      }
    },
    [library, operatorGrid, setState, vaultHub, vaultMap],
  )

  return {
    vaultMap,
    getVaultTierInfo,
  }
}
