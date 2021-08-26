import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { ContractEasyTrack, ContractLDO } from 'modules/blockChain/contracts'
import { useContractSwr } from 'modules/blockChain/hooks/useContractSwr'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Actions, Hint } from './MotionDetailedActionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getEventMotionCreated } from 'modules/motions/utils/getEventMotionCreation'
import { toastError } from 'modules/toasts'
import { getAccessList } from 'modules/motions/accessLists'

type Props = {
  motion: Motion
}

export function MotionDetailedActions({ motion }: Props) {
  const { walletAddress, isWalletConnected } = useWalletInfo()
  const contractLDO = ContractLDO.useRpc()
  const contractEasyTrack = ContractEasyTrack.useWeb3()
  const checkWalletConnect = useCheckWalletConnect()

  const { data: balanceAtRaw, initialLoading: isLoadingBalanceAt } =
    useContractSwr(
      contractLDO,
      walletAddress ? 'balanceOfAt' : null,
      String(walletAddress),
      motion.snapshotBlock,
    )
  const balanceAt = balanceAtRaw && formatEther(balanceAtRaw)

  const { data: isAlreadyObjected, initialLoading: isLoadingAlreadyObjected } =
    useContractSwr(
      contractEasyTrack,
      walletAddress ? 'objections' : null,
      motion.id,
      walletAddress as string,
    )

  const { data: canObject, initialLoading: isLoadingCanObject } =
    useContractSwr(
      contractEasyTrack,
      walletAddress ? 'canObjectToMotion' : null,
      motion.id,
      walletAddress as string,
    )

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
        getAccessList(motion.evmScriptFactory, 'enact'),
      )
      const res = await contractEasyTrack.enactMotion(motion.id, callData, {
        gasLimit: 500000,
        accessList: getAccessList(motion.evmScriptFactory, 'enact'),
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
            You have objected this motion with <b>{balanceAt}</b> LDO
          </>
        )}
        {canObject && !isAlreadyObjected && (
          <>
            You can object this motion with <b>{balanceAt}</b> LDO
          </>
        )}
        {!canObject && !isAlreadyObjected && (
          <>You didn’t have LDO when the motion started to object it</>
        )}
      </Hint>

      <Actions>
        {canObject && (
          <Button
            size="sm"
            children="Submit objection"
            onClick={handleSubmitObjection}
          />
        )}
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
