import { MotionType } from 'modules/motions/types'

import * as formNodeOperators from './StartNewNodeOperators'
import * as formLEGO from './StartNewLEGO'
import * as formRewardProgramAdd from './StartNewRewardProgramAdd'
import * as formRewardProgramRemove from './StartNewRewardProgramRemove'
import * as formRewardProgramTopUp from './StartNewRewardProgramTopUp'
import * as formReferralPartnerAdd from './StartNewReferralPartnerAdd'
import * as formReferralPartnerRemove from './StartNewReferralPartnerRemove'
import * as formReferralPartnerTopUp from './StartNewReferralPartnerTopUp'
import * as formAllowedRecipientAdd from './StartNewAllowedRecipientAdd'
import * as formAllowedRecipientRemove from './StartNewAllowedRecipientRemove'
import * as formAllowedRecipientTopUp from './StartNewAllowedRecipientTopUp'
import * as StartNewTopUpWithLimits from './StartNewTopUpWithLimits'

export const formParts = {
  [MotionType.NodeOperatorIncreaseLimit]: formNodeOperators.formParts,
  [MotionType.LEGOTopUp]: formLEGO.formParts,
  [MotionType.RewardProgramAdd]: formRewardProgramAdd.formParts,
  [MotionType.RewardProgramRemove]: formRewardProgramRemove.formParts,
  [MotionType.RewardProgramTopUp]: formRewardProgramTopUp.formParts,
  [MotionType.ReferralPartnerAdd]: formReferralPartnerAdd.formParts,
  [MotionType.ReferralPartnerRemove]: formReferralPartnerRemove.formParts,
  [MotionType.ReferralPartnerTopUp]: formReferralPartnerTopUp.formParts,
  [MotionType.AllowedRecipientAdd]: formAllowedRecipientAdd.formParts,
  [MotionType.AllowedRecipientRemove]: formAllowedRecipientRemove.formParts,
  [MotionType.AllowedRecipientTopUp]: formAllowedRecipientTopUp.formParts,
  [MotionType.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: 'LegoLDO',
  }),
  [MotionType.LegoDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: 'LegoDAI',
  }),
  [MotionType.RccDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: 'RccDAI',
  }),
  [MotionType.PmlDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: 'PmlDAI',
  }),
  [MotionType.AtcDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: 'AtcDAI',
  }),
  [MotionType.GasFunderETHTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: 'GasFunderETH',
  }),
} as const

export type FormData = {
  motionType: MotionType | null
} & {
  [key in MotionType]: ReturnType<typeof formParts[key]['getDefaultFormData']>
}

export const getDefaultFormPartsData = () => {
  return Object.entries(formParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part.getDefaultFormData(),
    }),
    {} as { [key in MotionType]: FormData[key] },
  )
}
