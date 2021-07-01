import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  memo,
  createContext,
} from 'react'
import { useTokenRpcSwr } from '../hooks/useTokenRpcSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import {
  ContractByToken,
  getTokenContractWeb3,
  getTokenContractRpc,
} from '../utils/getTokenContract'
import { TOKENS } from '../tokens'
import { ChainId } from 'modules/blockChain/chains'

type ProviderProps = {
  children: React.ReactNode
}

type TokenContextValue<T extends TOKENS> = {
  contractWeb3: ContractByToken<T> | null
  contractRpc: ContractByToken<T>
  balance?: BigNumber
  initialLoading: boolean
  invalidateBalance: () => Promise<BigNumber | undefined>
}

const getTokenProvider = <T extends TOKENS>(token: T) => {
  const TokenContext = createContext({} as TokenContextValue<T>)

  const TokenProvider = ({ children }: ProviderProps) => {
    const { library, account } = useWeb3React()
    const chainId = useCurrentChain()
    const shouldFetch = !!account

    const { current: that } = useRef({
      contractWeb3: null as ContractByToken<T> | null,
      contractRpc: null as ContractByToken<T>,
      inited: null as null | { chainId: ChainId; token: string },
    })

    if (
      !that.inited ||
      that.inited.chainId !== chainId ||
      that.inited.token !== token
    ) {
      that.contractWeb3 = getTokenContractWeb3<T>(chainId, token, library)
      that.contractRpc = getTokenContractRpc<T>(chainId, token)
      that.inited = { chainId, token }
    }

    const { contractWeb3, contractRpc } = that

    const {
      data: balance,
      initialLoading,
      mutate,
    } = useTokenRpcSwr(
      token as TOKENS,
      shouldFetch ? 'balanceOf' : null,
      account ?? '',
    )

    const invalidateBalance = useCallback(() => {
      return mutate(undefined, true)
    }, [mutate])

    useEffect(() => {
      if (!account || !library || !contractWeb3) return

      try {
        const fromMe = contractWeb3.filters.Transfer(account, null)
        const toMe = contractWeb3.filters.Transfer(null, account)

        library.on(fromMe, invalidateBalance)
        library.on(toMe, invalidateBalance)

        return () => {
          library.off(fromMe, invalidateBalance)
          library.off(toMe, invalidateBalance)
        }
      } catch (e) {
        console.warn('Cannot subscribe to Transfer event')
      }
    }, [account, library, contractWeb3, invalidateBalance])

    const value = useMemo(
      () => ({
        contractWeb3,
        contractRpc,
        balance,
        initialLoading,
        invalidateBalance,
      }),
      [contractWeb3, contractRpc, balance, initialLoading, invalidateBalance],
    )

    return (
      <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
    )
  }

  return {
    TokenContext,
    TokenProvider,
  }
}

// export const wstETH = getTokenProvider(TOKENS.wsteth)
// export const WETH = getTokenProvider(TOKENS.weth)
export const LDO = getTokenProvider(TOKENS.ldo)
// export const LDOPL = getTokenProvider(TOKENS.ldopl)

const LDOProvider = memo(LDO.TokenProvider)

export const TokensProvider = ({ children }: ProviderProps) => {
  return <LDOProvider>{children}</LDOProvider>
}
