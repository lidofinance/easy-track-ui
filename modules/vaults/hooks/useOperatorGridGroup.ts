import { OperatorGridAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'
import { isAddress } from 'ethers/lib/utils'

type Group = Awaited<ReturnType<OperatorGridAbi['group']>>

export const useOperatorGridGroup = () => {
  const [groupMap, setState] = useSimpleReducer<
    Record<string, Group | undefined>
  >({})

  const operatorGrid = ContractOperatorGrid.useRpc()
  const getOperatorGridGroup = useCallback(
    async (address: string) => {
      if (!isAddress(address)) {
        return null
      }

      const lowerAddress = address.toLowerCase()

      if (groupMap[lowerAddress]) {
        return groupMap[lowerAddress]!
      }

      try {
        const group = await operatorGrid.group(lowerAddress)
        setState({ [lowerAddress]: group })
        return group
      } catch (error) {
        return null
      }
    },
    [groupMap, operatorGrid, setState],
  )

  return {
    groupMap,
    getOperatorGridGroup,
  }
}
