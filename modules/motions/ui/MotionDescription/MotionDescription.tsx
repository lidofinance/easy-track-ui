import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import { useContractEvmScript } from 'modules/motions/hooks/useContractEvmScript'

import { DescLEGOTopUp } from './DescLEGO'
import { DescNodeOperatorIncreaseLimit } from './DescNodeOperator'
import {
  DescReferralPartnerAdd,
  DescReferralPartnerTopUp,
  DescReferralPartnerRemove,
} from './DescReferralPartner'
import {
  DescRewardProgramAdd,
  DescRewardProgramTopUp,
  DescRewardProgramRemove,
} from './DescRewardProgram'
import {
  DescAllowedRecipientAdd,
  DescAllowedRecipientTopUp,
  DescAllowedRecipientRemove,
} from './DescAllowedRecipient'

import { Motion, MotionType } from 'modules/motions/types'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: DescNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: DescLEGOTopUp,
  [MotionType.RewardProgramAdd]: DescRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: DescRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: DescRewardProgramRemove,
  [MotionType.ReferralPartnerAdd]: DescReferralPartnerAdd,
  [MotionType.ReferralPartnerTopUp]: DescReferralPartnerTopUp,
  [MotionType.ReferralPartnerRemove]: DescReferralPartnerRemove,
  [MotionType.AllowedRecipientAdd]: DescAllowedRecipientAdd,
  [MotionType.AllowedRecipientRemove]: DescAllowedRecipientRemove,
  [MotionType.AllowedRecipientTopUp]: DescAllowedRecipientTopUp,
} as const

type Props = {
  motion: Motion
}

export function MotionDescription({ motion }: Props) {
  const { chainId } = useWeb3()
  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  )
  const contract = useContractEvmScript(motionType)
  const { initialLoading: isLoadingEvent, data: createdEvent } =
    useMotionCreatedEvent(motion.id)
  const callDataRaw = createdEvent?._evmScriptCallData

  const { data: callData } = useSWR(
    isLoadingEvent ? null : `call-data-${chainId}-${motion.id}`,
    () => {
      if (motionType === EvmUnrecognized || !contract || !callDataRaw) {
        return null
      }
      return contract.decodeEVMScriptCallData(callDataRaw) as any
    },
  )

  if (motionType === EvmUnrecognized) {
    return <>Unrecognized motion type</>
  }

  if (isLoadingEvent || !callData) {
    return <>Loading...</>
  }

  const Desc = MOTION_DESCRIPTIONS[motionType]

  return <Desc callData={callData} />
}
