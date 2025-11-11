import { BigNumber } from 'ethers'
import { StakingVaultAbi__factory } from 'generated'
import { ContractVaultHub } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'

const fetchVaultNodeOperator = async (
  address: string,
  provider: ReturnType<typeof useWeb3>['library'],
) => {
  if (!provider) {
    return null
  }

  try {
    const vault = StakingVaultAbi__factory.connect(address, provider)
    const nodeOperator = await vault.nodeOperator()
    return nodeOperator
  } catch (error) {
    return null
  }
}

// Source: VaultHub.sol - DISCONNECT_NOT_INITIATED = type(uint48).max;
const DISCONNECT_NOT_INITIATED = BigNumber.from('0xFFFFFFFFFFFF')

type VaultData = {
  nodeOperator: string
  isVaultConnected: boolean
  isPendingDisconnect: boolean
  infraFeeBP: number
  liquidityFeeBP: number
  reservationFeeBP: number
}

export const useVaultsDataMap = () => {
  const { library } = useWeb3()
  const [vaultsDataMap, setState] = useSimpleReducer<
    Record<string, VaultData | null | undefined>
  >({})
  const vaultHub = ContractVaultHub.useRpc()

  const getVaultData = useCallback(
    async (address: string) => {
      const lowerAddress = address.toLowerCase()

      if (vaultsDataMap[lowerAddress] !== undefined) {
        return vaultsDataMap[lowerAddress]
      }

      // Check that vault exists
      const nodeOperator = await fetchVaultNodeOperator(lowerAddress, library)

      if (!nodeOperator) {
        setState({ [lowerAddress]: null })
        return null
      }

      try {
        const vaultData = await vaultHub.vaultConnection(lowerAddress)

        // Source: VaultHub.sol - see isVaultConnected function
        const isVaultConnected = !vaultData.vaultIndex.isZero()

        // Source: VaultHub.sol - see _isPendingDisconnect function
        const isPendingDisconnect =
          vaultData.disconnectInitiatedTs > 0 &&
          !DISCONNECT_NOT_INITIATED.eq(vaultData.disconnectInitiatedTs)

        const result = {
          nodeOperator,
          isVaultConnected,
          isPendingDisconnect,
          infraFeeBP: vaultData.infraFeeBP,
          liquidityFeeBP: vaultData.liquidityFeeBP,
          reservationFeeBP: vaultData.reservationFeeBP,
        }

        setState({ [lowerAddress]: result })

        return result
      } catch (error) {
        setState({ [lowerAddress]: null })
        return null
      }
    },
    [library, vaultHub, vaultsDataMap, setState],
  )

  return {
    vaultsDataMap,
    getVaultData,
  }
}
