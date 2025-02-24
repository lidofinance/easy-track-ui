import { invert, isNull, memoize, omitBy } from 'lodash'
import * as contracts from 'modules/blockChain/contracts'
import { CHAINS } from '@lido-sdk/constants'
import getConfig from 'next/config'
import { Address } from 'wagmi'
import { Abi } from 'abitype'

const { publicRuntimeConfig } = getConfig()

// eslint-disable-next-line @typescript-eslint/no-redeclare
type CONTRACT_NAMES = keyof typeof contracts

export const METRIC_CONTRACT_ABIS = Object.keys(contracts).reduce(
  (mapped, contractName: CONTRACT_NAMES) => {
    return {
      ...mapped,
      [contractName]: contracts[contractName].factory.abi,
    }
  },
  {} as Record<CONTRACT_NAMES, Abi>,
)

export const getMetricContractAbi = memoize(
  (contractName: CONTRACT_NAMES): Abi | undefined => {
    return METRIC_CONTRACT_ABIS[contractName]
  },
)

const supportedChainsWithMainnet: CHAINS[] =
  publicRuntimeConfig.supportedChains.includes(CHAINS.Mainnet)
    ? publicRuntimeConfig.supportedChains.split(',')
    : [...publicRuntimeConfig.supportedChains.split(','), CHAINS.Mainnet]

export const METRIC_CONTRACT_ADDRESSES = supportedChainsWithMainnet.reduce(
  (mapped, chainId) => {
    const map = Object.keys(contracts).reduce(
      (contractMap, contractName: CONTRACT_NAMES) => {
        const address = contracts[contractName].address[chainId] ?? null
        return {
          ...contractMap,
          [contractName]: address,
        }
      },
      {} as Record<CONTRACT_NAMES, Address>,
    )

    return {
      ...mapped,
      [chainId]: invert(omitBy(map, isNull)),
    }
  },
  {} as Record<CHAINS, Record<Address, CONTRACT_NAMES | undefined>>,
)

export const METRIC_CONTRACT_EVENT_ADDRESSES =
  supportedChainsWithMainnet.reduce((mapped, chainId) => {
    const map = Object.keys(contracts).reduce(
      (contractMap, contractName: CONTRACT_NAMES) => {
        const address = contracts[contractName].address[chainId] ?? null
        return {
          ...contractMap,
          [contractName]: address,
        }
      },
      {} as Record<CONTRACT_NAMES, Address>,
    )

    return {
      ...mapped,
      [chainId]: invert(omitBy(map, isNull)),
    }
  }, {} as Record<CHAINS, Record<string, string>>)
