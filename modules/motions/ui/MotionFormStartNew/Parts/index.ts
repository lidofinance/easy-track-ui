import { MotionTypeForms } from 'modules/motions/types'

import * as formAllowedRecipientAdd from './StartNewAllowedRecipientAdd'
import * as formAllowedRecipientRemove from './StartNewAllowedRecipientRemove'
import * as formAllowedRecipientTopUp from './StartNewAllowedRecipientTopUp'
import * as StartNewTopUpWithLimits from './StartNewTopUpWithLimits'
import * as StartNewTopUpWithLimitsAndCustomToken from './StartNewTopUpWithLimitsAndCustomToken'
import * as StartSDVTNodeOperatorsAdd from './StartSDVTNodeOperatorsAdd'
import * as StartNewSDVTNodeOperatorsActivate from './StartNewSDVTNodeOperatorsActivate'
import * as StartNewSDVTNodeOperatorsDeactivate from './StartNewSDVTNodeOperatorsDeactivate'
import * as StartNewSDVTVettedValidatorsLimitsSet from './StartNewSDVTVettedValidatorsLimitsSet'
import * as StartNewSDVTTargetValidatorLimitsUpdate from './StartNewSDVTTargetValidatorLimitsUpdate'
import * as StartNewSDVTNodeOperatorRewardAddressesSet from './StartNewSDVTNodeOperatorRewardAddressesSet'
import * as StartNewSDVTNodeOperatorNamesSet from './StartNewSDVTNodeOperatorNamesSet'
import * as StartNewSDVTNodeOperatorManagersChange from './StartNewSDVTNodeOperatorManagersChange'
import * as StartNewNodeOperatorLimitIncrease from './StartNewNodeOperatorLimitIncrease'

export const formParts = {
  [MotionTypeForms.NodeOperatorIncreaseLimit]:
    StartNewNodeOperatorLimitIncrease.formParts({
      motionType: MotionTypeForms.NodeOperatorIncreaseLimit,
    }),
  [MotionTypeForms.AllowedRecipientTopUpTrpLdo]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.AllowedRecipientTopUpTrpLdo,
    }),
  [MotionTypeForms.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoLDOTopUp,
  }),
  [MotionTypeForms.RccStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.RccStablesTopUp,
    }),
  [MotionTypeForms.PmlStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.PmlStablesTopUp,
    }),
  [MotionTypeForms.AtcStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.AtcStablesTopUp,
    }),
  [MotionTypeForms.StethRewardProgramAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.StethRewardProgramAdd,
  }),
  [MotionTypeForms.StethRewardProgramRemove]:
    formAllowedRecipientRemove.formParts({
      registryType: MotionTypeForms.StethRewardProgramRemove,
    }),
  [MotionTypeForms.StethRewardProgramTopUp]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.StethRewardProgramTopUp,
    }),
  [MotionTypeForms.StethGasSupplyAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.StethGasSupplyAdd,
  }),
  [MotionTypeForms.StethGasSupplyRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.StethGasSupplyRemove,
  }),
  [MotionTypeForms.StethGasSupplyTopUp]: formAllowedRecipientTopUp.formParts({
    registryType: MotionTypeForms.StethGasSupplyTopUp,
  }),
  [MotionTypeForms.RewardsShareProgramAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.RewardsShareProgramAdd,
  }),
  [MotionTypeForms.RewardsShareProgramRemove]:
    formAllowedRecipientRemove.formParts({
      registryType: MotionTypeForms.RewardsShareProgramRemove,
    }),
  [MotionTypeForms.RewardsShareProgramTopUp]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.RewardsShareProgramTopUp,
    }),
  [MotionTypeForms.SDVTNodeOperatorsAdd]: StartSDVTNodeOperatorsAdd.formParts(),
  [MotionTypeForms.SDVTNodeOperatorsActivate]:
    StartNewSDVTNodeOperatorsActivate.formParts,
  [MotionTypeForms.SDVTNodeOperatorsDeactivate]:
    StartNewSDVTNodeOperatorsDeactivate.formParts,
  [MotionTypeForms.SDVTVettedValidatorsLimitsSet]:
    StartNewSDVTVettedValidatorsLimitsSet.formParts,
  [MotionTypeForms.SDVTTargetValidatorLimitsUpdate]:
    StartNewSDVTTargetValidatorLimitsUpdate.formParts,
  [MotionTypeForms.SDVTNodeOperatorRewardAddressesSet]:
    StartNewSDVTNodeOperatorRewardAddressesSet.formParts,
  [MotionTypeForms.SDVTNodeOperatorNamesSet]:
    StartNewSDVTNodeOperatorNamesSet.formParts,
  [MotionTypeForms.SDVTNodeOperatorManagerChange]:
    StartNewSDVTNodeOperatorManagersChange.formParts,
  [MotionTypeForms.SandboxNodeOperatorIncreaseLimit]:
    StartNewNodeOperatorLimitIncrease.formParts({
      motionType: MotionTypeForms.SandboxNodeOperatorIncreaseLimit,
    }),
  [MotionTypeForms.SandboxStablesAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.SandboxStablesAdd,
  }),
  [MotionTypeForms.SandboxStablesRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.SandboxStablesRemove,
  }),
  [MotionTypeForms.SandboxStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.SandboxStablesTopUp,
    }),
  [MotionTypeForms.RccStethTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.RccStethTopUp,
  }),
  [MotionTypeForms.PmlStethTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.PmlStethTopUp,
  }),
  [MotionTypeForms.AtcStethTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.AtcStethTopUp,
  }),
  [MotionTypeForms.LegoStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LegoStablesTopUp,
    }),
} as const

export type FormData = {
  motionType: MotionTypeForms | null
} & {
  [key in MotionTypeForms]: ReturnType<
    typeof formParts[key]['getDefaultFormData']
  >
}

export const getDefaultFormPartsData = () => {
  return Object.entries(formParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part.getDefaultFormData(),
    }),
    {} as { [key in MotionTypeForms]: FormData[key] },
  )
}
