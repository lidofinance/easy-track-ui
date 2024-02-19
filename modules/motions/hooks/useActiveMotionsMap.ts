import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'
import { ActiveMotionsMap } from '../types'
import { getMotionTypeByScriptFactory } from '../utils'

export function useActiveMotionsMap() {
  const { chainId } = useWeb3()

  return useSWR(
    `active-motions-${chainId}`,
    async () => {
      const easyTrack = ContractEasyTrack.connectRpc({ chainId })

      const motions = await easyTrack.getMotions()

      return motions.reduce((acc, motion) => {
        const motionType = getMotionTypeByScriptFactory(
          chainId,
          motion.evmScriptFactory,
        )
        if (motionType === 'EvmUnrecognized') {
          return acc
        }

        if (!acc[motionType]) {
          acc[motionType] = [
            {
              id: motion.id,
              evmScriptFactory: motion.evmScriptFactory,
            },
          ]
        } else {
          acc[motionType]?.push({
            id: motion.id,
            evmScriptFactory: motion.evmScriptFactory,
          })
        }

        return acc
      }, {} as ActiveMotionsMap)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
