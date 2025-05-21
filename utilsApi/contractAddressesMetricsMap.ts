import { invert, isNull, memoize, omitBy } from 'lodash'
import * as contracts from 'modules/blockChain/contracts'
import { CHAINS } from 'modules/blockChain/chains'
import getConfig from 'next/config'
import { Address } from 'viem'
import { Abi } from 'abitype'

const { publicRuntimeConfig } = getConfig()

type ContractName = keyof typeof contracts

export const METRIC_CONTRACT_ABIS = Object.keys(contracts).reduce(
  (mapped, contractName) => {
    return {
      ...mapped,
      [contractName]: contracts[contractName as ContractName].factory.abi,
    }
  },
  {} as Record<ContractName, Abi>,
)

export const getMetricContractAbi = memoize(
  (contractName: ContractName): Abi | undefined => {
    return METRIC_CONTRACT_ABIS[contractName]
  },
)

const supportedChainsWithMainnet: CHAINS[] =
  publicRuntimeConfig.supportedChains.includes(CHAINS.Mainnet)
    ? publicRuntimeConfig.supportedChains.split(',')
    : [...publicRuntimeConfig.supportedChains.split(','), CHAINS.Mainnet]

export const METRIC_CONTRACT_ADDRESSES = supportedChainsWithMainnet.reduce(
  (mapped, chainId) => {
    const map = Object.keys(contracts).reduce((contractMap, contractName) => {
      const address =
        contracts[contractName as ContractName].address[chainId] ?? null
      return {
        ...contractMap,
        [contractName]: address,
      }
    }, {} as Record<ContractName, Address>)

    return {
      ...mapped,
      [chainId]: invert(omitBy(map, isNull)),
    }
  },
  {} as Record<CHAINS, Record<Address, ContractName | undefined>>,
)

export const METRIC_CONTRACT_EVENT_ADDRESSES =
  supportedChainsWithMainnet.reduce((mapped, chainId) => {
    const map = Object.keys(contracts).reduce((contractMap, contractName) => {
      const address =
        contracts[contractName as ContractName].address[chainId] ?? null
      return {
        ...contractMap,
        [contractName]: address,
      }
    }, {} as Record<ContractName, Address>)

    return {
      ...mapped,
      [chainId]: invert(omitBy(map, isNull)),
    }
  }, {} as Record<CHAINS, Record<string, string>>)
