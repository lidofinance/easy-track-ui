import { OperatorGridAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'
import { isAddress } from 'ethers/lib/utils'
import { constants } from 'ethers'

type Group = Awaited<ReturnType<OperatorGridAbi['group']>>

export const useOperatorGridGroupMap = () => {
  const [groupMap, setState] = useSimpleReducer<
    Record<string, Group | null | undefined>
  >({})

  const operatorGrid = ContractOperatorGrid.useRpc()
  const getOperatorGridGroup = useCallback(
    async (address: string) => {
      if (!isAddress(address)) {
        return null
      }

      const lowerAddress = address.toLowerCase()

      if (groupMap[lowerAddress] !== undefined) {
        return groupMap[lowerAddress]!
      }

      try {
        const group = await operatorGrid.group(lowerAddress)
        if (group.operator === constants.AddressZero) {
          setState({ [lowerAddress]: null })
          return null
        }
        setState({ [lowerAddress]: group })
        return group
      } catch (error) {
        setState({ [lowerAddress]: null })
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
