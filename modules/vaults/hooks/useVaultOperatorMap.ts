import { StakingVaultAbi__factory } from 'generated'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'

export const useVaultOperatorMap = () => {
  const { library } = useWeb3()
  const [vaultMap, setState] = useSimpleReducer<
    Record<string, string | null | undefined>
  >({})

  const getVaultNodeOperator = useCallback(
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

        setState({ [lowerAddress]: nodeOperator })

        return nodeOperator
      } catch (error) {
        setState({ [lowerAddress]: null })
        return null
      }
    },
    [library, setState, vaultMap],
  )

  return {
    vaultMap,
    getVaultNodeOperator,
  }
}
