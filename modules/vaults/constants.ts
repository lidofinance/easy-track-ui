import { GridGroup, TierParams } from './types'

// uint256 internal constant MAX_RESERVE_RATIO_BP = 9999;
export const MAX_RESERVE_RATIO_BP = 9999
// uint256 internal constant MAX_FEE_BP = type(uint16).max;
export const MAX_FEE_BP = 65535

// address public constant DEFAULT_TIER_OPERATOR = address(uint160(type(uint160).max));
export const DEFAULT_TIER_OPERATOR =
  '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'

export const EMPTY_TIER: TierParams = {
  shareLimit: '',
  reserveRatioBP: '',
  forcedRebalanceThresholdBP: '',
  infraFeeBP: '',
  liquidityFeeBP: '',
  reservationFeeBP: '',
}

export const EMPTY_GROUP: GridGroup = {
  nodeOperator: '',
  shareLimit: '',
  tiers: [{ ...EMPTY_TIER }],
}
