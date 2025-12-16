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
      groupShareLimit: 42725,
      tiers: [
        {
          shareLimit: 2375,
          reserveRatioBP: 500,
          forcedRebalanceThresholdBP: 475,
        },
        {
          shareLimit: 2350,
          reserveRatioBP: 600,
          forcedRebalanceThresholdBP: 575,
        },
        {
          shareLimit: 9100,
          reserveRatioBP: 900,
          forcedRebalanceThresholdBP: 875,
        },
        {
          shareLimit: 12900,
          reserveRatioBP: 1400,
          forcedRebalanceThresholdBP: 1375,
        },
        {
          shareLimit: 16000,
          reserveRatioBP: 2000,
          forcedRebalanceThresholdBP: 1975,
        },
      ],
    },
    {
      label: 'Professional',
      groupShareLimit: 44813,
      tiers: [
        {
          shareLimit: 2413,
          reserveRatioBP: 350,
          forcedRebalanceThresholdBP: 325,
        },
        {
          shareLimit: 2400,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
        {
          shareLimit: 9400,
          reserveRatioBP: 600,
          forcedRebalanceThresholdBP: 575,
        },
        {
          shareLimit: 13500,
          reserveRatioBP: 1000,
          forcedRebalanceThresholdBP: 975,
        },
        {
          shareLimit: 17100,
          reserveRatioBP: 1450,
          forcedRebalanceThresholdBP: 1425,
        },
      ],
    },
    {
      label: 'Professional Trusted',
      groupShareLimit: 46488,
      tiers: [
        {
          shareLimit: 2438,
          reserveRatioBP: 250,
          forcedRebalanceThresholdBP: 225,
        },
        {
          shareLimit: 2425,
          reserveRatioBP: 300,
          forcedRebalanceThresholdBP: 275,
        },
        {
          shareLimit: 9600,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
        {
          shareLimit: 14025,
          reserveRatioBP: 650,
          forcedRebalanceThresholdBP: 625,
        },
        {
          shareLimit: 18000,
          reserveRatioBP: 1000,
          forcedRebalanceThresholdBP: 975,
        },
      ],
    },
    {
      label: 'DVT Cluster',
      groupShareLimit: 48450,
      tiers: [
        {
          shareLimit: 2450,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 2450,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 9800,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
        {
          shareLimit: 14550,
          reserveRatioBP: 300,
          forcedRebalanceThresholdBP: 275,
        },
        {
          shareLimit: 19200,
          reserveRatioBP: 400,
          forcedRebalanceThresholdBP: 375,
        },
      ],
    },
  ],
  [CHAINS.Mainnet]: [
    {
      label: 'Basic — Phase I',
      groupShareLimit: 38849,
      tiers: [
        {
          shareLimit: 38849,
          reserveRatioBP: 500,
          forcedRebalanceThresholdBP: 475,
        },
      ],
    },
    {
      label: 'Professional — Phase I',
      groupShareLimit: 39463,
      tiers: [
        {
          shareLimit: 39463,
          reserveRatioBP: 350,
          forcedRebalanceThresholdBP: 325,
        },
      ],
    },
    {
      label: 'Professional Trusted — Phase I',
      groupShareLimit: 39872,
      tiers: [
        {
          shareLimit: 39872,
          reserveRatioBP: 250,
          forcedRebalanceThresholdBP: 225,
        },
      ],
    },
    {
      label: 'DVT Cluster — Phase I',
      groupShareLimit: 40076,
      tiers: [
        {
          shareLimit: 40076,
          reserveRatioBP: 200,
          forcedRebalanceThresholdBP: 175,
        },
      ],
    },
  ],
}
