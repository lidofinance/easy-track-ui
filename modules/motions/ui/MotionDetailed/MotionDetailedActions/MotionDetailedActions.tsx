import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import {
  ContractEasyTrack,
  ContractGovernanceToken,
} from 'modules/blockChain/contracts'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Actions, Hint } from './MotionDetailedActionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getEventMotionCreated } from 'modules/motions/utils/getEventMotionCreation'
import { toastError } from 'modules/toasts'
import { getContractMethodParams } from 'modules/motions/utils/getContractMethodParams'

type Props = {
  motion: Motion
}

export function MotionDetailedActions({ motion }: Props) {
  const { walletAddress, isWalletConnected } = useWalletInfo()
  const contractEasyTrack = ContractEasyTrack.useWeb3()
  const checkWalletConnect = useCheckWalletConnect()
  const { data: governanceSymbol } = useGovernanceSymbol()

  const { data: balanceAtRaw, initialLoading: isLoadingBalanceAt } =
    ContractGovernanceToken.useSwrWeb3(walletAddress ? 'balanceOfAt' : null, [
      String(walletAddress),
      motion.snapshotBlock,
    ])
  const balanceAt = balanceAtRaw && formatEther(balanceAtRaw)

  const { data: isAlreadyObjected, initialLoading: isLoadingAlreadyObjected } =
    ContractEasyTrack.useSwrWeb3(walletAddress ? 'objections' : null, [
      motion.id,
      walletAddress as string,
    ])

  const { data: canObject, initialLoading: isLoadingCanObject } =
    ContractEasyTrack.useSwrWeb3(walletAddress ? 'canObjectToMotion' : null, [
      motion.id,
      walletAddress as string,
    ])

  const isLoadingActions =
    isLoadingCanObject || isLoadingAlreadyObjected || isLoadingBalanceAt

  // Submit Objection
  const handleSubmitObjection = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      if (!canObject) {
        toastError('You cannot submit objection to this motion')
        return
      }
      const res = await contractEasyTrack.objectToMotion(motion.id, {
        gasLimit: 500000,
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, contractEasyTrack, motion.id, canObject])

  // Enact Motion
  const handleEnact = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const { _evmScriptCallData: callData } = await getEventMotionCreated(
        contractEasyTrack,
        motion.id,
      )
      console.info(
        'Access list:',
        motion.evmScriptFactory,
        getContractMethodParams(motion.evmScriptFactory, 'enact'),
      )
      const res = await contractEasyTrack.enactMotion(motion.id, callData, {
        gasLimit: 500000,
        ...getContractMethodParams(motion.evmScriptFactory, 'enact'),
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motion, contractEasyTrack])

  if (!isWalletConnected) {
    return (
      <>
        <Hint>Connect your wallet to interact with this motion</Hint>
        <Actions>
          <Button
            size="sm"
            children="Connect wallet"
            onClick={checkWalletConnect}
          />
        </Actions>
      </>
    )
  }

  if (isLoadingActions) {
    return <Text size={10} weight={500} children="Loading..." />
  }

  return (
    <>
      <Hint>
        {isAlreadyObjected && (
          <>
            You have objected this motion with <b>{balanceAt}</b>{' '}
            {governanceSymbol}
          </>
        )}
        {canObject && !isAlreadyObjected && (
          <>
            You can object this motion with <b>{balanceAt}</b>{' '}
            {governanceSymbol}
          </>
        )}
        {!canObject && !isAlreadyObjected && (
          <>
            You didn’t have {governanceSymbol} when the motion started to object
            it
          </>
        )}
      </Hint>

      <Actions>
        <Button
          size="sm"
          children="Submit objection"
          disabled={!canObject}
          onClick={handleSubmitObjection}
        />
        {motion.status === MotionStatus.PENDING && (
          <Button
            size="sm"
            variant="outlined"
            children="Enact"
            onClick={handleEnact}
          />
        )}
      </Actions>
    </>
  )
}
