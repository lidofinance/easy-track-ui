import { MotionType } from '../types'

export const getMotionEnactWarning = (
  motionType: MotionType | 'EvmUnrecognized',
) => {
  switch (motionType) {
    case MotionType.UpdateVaultsFeesInOperatorGrid:
    case MotionType.ForceValidatorExitsInVaultHub:
    case MotionType.SocializeBadDebtInVaultHub:
      return 'Warning: This motion requires a fresh oracle report before it can be enacted.'

    default:
      return null
  }
}
