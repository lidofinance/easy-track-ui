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

import { DescTopUpWithLimits } from './DescTopUpWithLimits'

import {
  TopUpWithLimitsAbi,
  RemoveAllowedRecipientLDOAbi,
  AddAllowedRecipientLDOAbi,
} from 'generated'
import { Motion, MotionType } from 'modules/motions/types'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { NestProps } from './types'

type DescWithLimitsProps = NestProps<
  TopUpWithLimitsAbi['decodeEVMScriptCallData']
>
type DescAllowedRecipientRemoveProps = NestProps<
  RemoveAllowedRecipientLDOAbi['decodeEVMScriptCallData']
>
type DescAllowedRecipientAddProps = NestProps<
  AddAllowedRecipientLDOAbi['decodeEVMScriptCallData']
>

const MOTION_DESCRIPTIONS = {
  [MotionType.NodeOperatorIncreaseLimit]: DescNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: DescLEGOTopUp,
  [MotionType.RewardProgramAdd]: DescRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: DescRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: DescRewardProgramRemove,
  [MotionType.ReferralPartnerAdd]: DescReferralPartnerAdd,
  [MotionType.ReferralPartnerTopUp]: DescReferralPartnerTopUp,
  [MotionType.ReferralPartnerRemove]: DescReferralPartnerRemove,
  [MotionType.AllowedRecipientAdd]: (props: DescAllowedRecipientAddProps) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAdd}
    />
  ),
  [MotionType.AllowedRecipientRemove]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemove}
    />
  ),
  [MotionType.AllowedRecipientTopUp]: (props: DescWithLimitsProps) => (
    <DescAllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUp}
    />
  ),
  [MotionType.AllowedRecipientAddReferralDai]: (
    props: DescAllowedRecipientAddProps,
  ) => (
    <DescAllowedRecipientAdd
      {...props}
      registryType={MotionType.AllowedRecipientAddReferralDai}
    />
  ),
  [MotionType.AllowedRecipientRemoveReferralDai]: (
    props: DescAllowedRecipientRemoveProps,
  ) => (
    <DescAllowedRecipientRemove
      {...props}
      registryType={MotionType.AllowedRecipientRemoveReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpReferralDai]: (
    props: DescWithLimitsProps,
  ) => (
    <DescAllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpReferralDai}
    />
  ),
  [MotionType.AllowedRecipientTopUpTrpLdo]: (props: DescWithLimitsProps) => (
    <DescAllowedRecipientTopUp
      {...props}
      registryType={MotionType.AllowedRecipientTopUpTrpLdo}
    />
  ),
  [MotionType.LegoLDOTopUp]: (props: DescWithLimitsProps) => (
    <DescTopUpWithLimits {...props} registryType={MotionType.LegoLDOTopUp} />
  ),
  [MotionType.LegoDAITopUp]: (props: DescWithLimitsProps) => (
    <DescTopUpWithLimits {...props} registryType={MotionType.LegoDAITopUp} />
  ),
  [MotionType.RccDAITopUp]: (props: DescWithLimitsProps) => (
    <DescTopUpWithLimits {...props} registryType={MotionType.RccDAITopUp} />
  ),
  [MotionType.PmlDAITopUp]: (props: DescWithLimitsProps) => (
    <DescTopUpWithLimits {...props} registryType={MotionType.PmlDAITopUp} />
  ),
  [MotionType.AtcDAITopUp]: (props: DescWithLimitsProps) => (
    <DescTopUpWithLimits {...props} registryType={MotionType.AtcDAITopUp} />
  ),
  [MotionType.GasFunderETHTopUp]: (props: DescWithLimitsProps) => (
    <DescTopUpWithLimits
      {...props}
      registryType={MotionType.GasFunderETHTopUp}
    />
  ),
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
