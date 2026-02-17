import { CHAINS } from '@lido-sdk/constants'
import { GridGroup, PredefinedGroupSetup, TierParams } from './types'

// uint256 internal constant MAX_RESERVE_RATIO_BP = 9999;
export const MAX_RESERVE_RATIO_BP = 9999
// uint256 internal constant MAX_FEE_BP = type(uint16).max;
export const MAX_FEE_BP = 65535

export const DEFAULT_TIER_ID = 0

// address public constant DEFAULT_TIER_OPERATOR = address(uint160(type(uint160).max));
export const DEFAULT_TIER_OPERATOR =
  '0xffffffffffffffffffffffffffffffffffffffff'

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

export const PREDEFINED_CONSTANT_TIER_PARAMS = {
  infraFeeBP: 100,
  liquidityFeeBP: 650,
  reservationFeeBP: 0,
}

export const PREDEFINED_GROUP_SETUPS_MAP: Partial<
  Record<CHAINS, PredefinedGroupSetup[]>
> = {
  [CHAINS.Hoodi]: [
    {
      label: 'Basic',
      shareLimit: 34785,
      tiers: [
        {
          shareLimit: 1934,
          reserveRatioBP: 500,
          forcedRebalanceThresholdBP: 475,
        },
        {
          shareLimit: 1913,
          reserveRatioBP: 600,
          forcedRebalanceThresholdBP: 575,
        },
        {
          shareLimit: 7409,
          reserveRatioBP: 900,
          forcedRebalanceThresholdBP: 875,
        },
        {
          shareLimit: 10503,
          reserveRatioBP: 1400,
          forcedRebalanceThresholdBP: 1375,
        },
        {
          shareLimit: 13026,
          reserveRatioBP: 2000,
          forcedRebalanceThresholdBP: 1975,
        },
      ],
    },
    {
      label: 'Professional',
      shareLimit: 36484,
      tiers: [
        {
          shareLimit: 1964,
          reserveRatioBP: 350,
          forcedRebalanceThresholdBP: 325,
        },
        {
          shareLimit: 1954,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
        {
          shareLimit: 7653,
          reserveRatioBP: 600,
          forcedRebalanceThresholdBP: 575,
        },
        {
          shareLimit: 10991,
          reserveRatioBP: 1000,
          forcedRebalanceThresholdBP: 975,
        },
        {
          shareLimit: 13922,
          reserveRatioBP: 1450,
          forcedRebalanceThresholdBP: 1425,
        },
      ],
    },
    {
      label: 'Professional Trusted',
      shareLimit: 37848,
      tiers: [
        {
          shareLimit: 1985,
          reserveRatioBP: 250,
          forcedRebalanceThresholdBP: 225,
        },
        {
          shareLimit: 1974,
          reserveRatioBP: 300,
          forcedRebalanceThresholdBP: 275,
        },
        {
          shareLimit: 7816,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
        {
          shareLimit: 11419,
          reserveRatioBP: 650,
          forcedRebalanceThresholdBP: 625,
        },
        {
          shareLimit: 14655,
          reserveRatioBP: 1000,
          forcedRebalanceThresholdBP: 975,
        },
      ],
    },
    {
      label: 'DVT Cluster',
      shareLimit: 39446,
      tiers: [
        {
          shareLimit: 1995,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 1995,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 7979,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 11846,
          reserveRatioBP: 300,
          forcedRebalanceThresholdBP: 275,
        },
        {
          shareLimit: 15632,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
      ],
    },
  ],
  [CHAINS.Mainnet]: [
    {
      label: 'Basic',
      shareLimit: 695695,
      tiers: [
        {
          shareLimit: 38672,
          reserveRatioBP: 500,
          forcedRebalanceThresholdBP: 475,
        },
        {
          shareLimit: 38265,
          reserveRatioBP: 600,
          forcedRebalanceThresholdBP: 575,
        },
        {
          shareLimit: 148176,
          reserveRatioBP: 900,
          forcedRebalanceThresholdBP: 875,
        },
        {
          shareLimit: 210052,
          reserveRatioBP: 1400,
          forcedRebalanceThresholdBP: 1375,
        },
        {
          shareLimit: 260530,
          reserveRatioBP: 2000,
          forcedRebalanceThresholdBP: 1975,
        },
      ],
    },
    {
      label: 'Professional',
      shareLimit: 729686,
      tiers: [
        {
          shareLimit: 39283,
          reserveRatioBP: 350,
          forcedRebalanceThresholdBP: 325,
        },
        {
          shareLimit: 39079,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
        {
          shareLimit: 153061,
          reserveRatioBP: 600,
          forcedRebalanceThresholdBP: 575,
        },
        {
          shareLimit: 219822,
          reserveRatioBP: 1000,
          forcedRebalanceThresholdBP: 975,
        },
        {
          shareLimit: 278441,
          reserveRatioBP: 1450,
          forcedRebalanceThresholdBP: 1425,
        },
      ],
    },
    {
      label: 'Professional Trusted',
      shareLimit: 756962,
      tiers: [
        {
          shareLimit: 39690,
          reserveRatioBP: 250,
          forcedRebalanceThresholdBP: 225,
        },
        {
          shareLimit: 39487,
          reserveRatioBP: 300,
          forcedRebalanceThresholdBP: 275,
        },
        {
          shareLimit: 156318,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
        {
          shareLimit: 228371,
          reserveRatioBP: 650,
          forcedRebalanceThresholdBP: 625,
        },
        {
          shareLimit: 293096,
          reserveRatioBP: 1000,
          forcedRebalanceThresholdBP: 975,
        },
      ],
    },
    {
      label: 'DVT Cluster',
      shareLimit: 788918,
      tiers: [
        {
          shareLimit: 39894,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 39894,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 159575,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 236919,
          reserveRatioBP: 300,
          forcedRebalanceThresholdBP: 275,
        },
        {
          shareLimit: 312636,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
      ],
    },
  ],
}
