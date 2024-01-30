import { CHAINS } from '@lido-sdk/constants'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { GenericFactoryAbi__factory } from 'generated'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'
import { ActiveMotion } from '../types'
import { getEventMotionCreated } from '../utils/getEventMotionCreation'
import { MotionFactoryDecodeAbi } from './types'

type CallData<T extends MotionFactoryDecodeAbi> = Awaited<
  ReturnType<T['decodeEVMScriptCallData']>
>

export const getMotionsCallData = async <T extends MotionFactoryDecodeAbi>(
  motions: ActiveMotion[],
  chainId: CHAINS,
) => {
  const easyTrack = ContractEasyTrack.connectRpc({ chainId })

  const resolvedPromises = await Promise.all(
    motions.map(async motion => {
      const createdEvent = await getEventMotionCreated(
        easyTrack,
        motion.id.toString(),
      )

      const callDataRaw = createdEvent._evmScriptCallData

      const library = getStaticRpcBatchProvider(
        chainId,
        getBackendRpcUrl(chainId),
      )
      const factory = GenericFactoryAbi__factory.connect(
        motion.evmScriptFactory,
        library,
      )

      const decoded = await factory.decodeEVMScriptCallData(callDataRaw)

      return decoded as CallData<T>
    }),
  )

  return resolvedPromises.flat()
}
