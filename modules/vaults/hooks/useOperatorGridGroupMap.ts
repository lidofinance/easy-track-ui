import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import { useCallback } from 'react'
import { isAddress } from 'ethers/lib/utils'
import { BigNumber, constants } from 'ethers'
import { DEFAULT_TIER_OPERATOR } from '../constants'
import { Group } from '../types'

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
          // Check for default tier group
          if (lowerAddress === DEFAULT_TIER_OPERATOR) {
            const defaultGroup = {
              ...group,
              operator: DEFAULT_TIER_OPERATOR,
              tierIds: [BigNumber.from(0)],
            }

            setState({ [lowerAddress]: defaultGroup })
            return defaultGroup
          }

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
