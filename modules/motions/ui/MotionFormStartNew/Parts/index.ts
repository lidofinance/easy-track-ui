import { MotionType } from 'modules/motions/types'

import * as formNodeOperators from './StartNewNodeOperators'
import * as formLEGO from './StartNewLEGO'
import * as formRewardProgramAdd from './StartNewRewardProgramAdd'
import * as formRewardProgramRemove from './StartNewRewardProgramRemove'
import * as formRewardProgramTopUp from './StartNewRewardProgramTopUp'
import * as formReferralPartnerAdd from './StartNewReferralPartnerAdd'
import * as formReferralPartnerRemove from './StartNewReferralPartnerRemove'
import * as formReferralPartnerTopUp from './StartNewReferralPartnerTopUp'

export const formParts = {
  [MotionType.NodeOperatorIncreaseLimit]: formNodeOperators.formParts,
  [MotionType.LEGOTopUp]: formLEGO.formParts,
  [MotionType.RewardProgramAdd]: formRewardProgramAdd.formParts,
  [MotionType.RewardProgramRemove]: formRewardProgramRemove.formParts,
  [MotionType.RewardProgramTopUp]: formRewardProgramTopUp.formParts,
  [MotionType.ReferralPartnerAdd]: formReferralPartnerAdd.formParts,
  [MotionType.ReferralPartnerRemove]: formReferralPartnerRemove.formParts,
  [MotionType.ReferralPartnerTopUp]: formReferralPartnerTopUp.formParts,
  [MotionType.AllowedRecipientAdd]: null,
  [MotionType.AllowedRecipientRemove]: null,
  [MotionType.AllowedRecipientTopUp]: null,
  [MotionType.LegoLDOTopUp]: null,
  [MotionType.LegoDAITopUp]: null,
  [MotionType.RccDAITopUp]: null,
  [MotionType.PmlDAITopUp]: null,
  [MotionType.AtcDAITopUp]: null,
  [MotionType.GasFunderETHTopUp]: null,
} as const

export type FormData = {
  motionType: MotionType | null
} & {
  // TODO: will be fixed when adding formParts
  // @ts-ignore
  [key in MotionType]: ReturnType<typeof formParts[key]['getDefaultFormData']>
}

export const getDefaultFormPartsData = () => {
  return Object.entries(formParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part?.getDefaultFormData(),
    }),
    {} as { [key in MotionType]: FormData[key] },
  )
}
