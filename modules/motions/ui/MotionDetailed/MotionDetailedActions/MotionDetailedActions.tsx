import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useTokenRpcSwr } from 'modules/tokens/hooks/useTokenRpcSwr'
import { useContractRpcSwr } from 'modules/blockChain/hooks/useContractRpcSwr'
import { useContractMotionWeb3 } from 'modules/blockChain/hooks/useContractMotion'
import { useCheckWalletConnect } from 'modules/blockChain/hooks/useCheckWalletConnect'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Actions, Hint } from './MotionDetailedActionsStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getEventMotionCreated } from 'modules/motions/utils/getEventMotionCreation'
import { toastError } from 'modules/toasts'

import { TOKENS } from 'modules/tokens/tokens'

type Props = {
  motion: Motion
}

export function MotionDetailedActions({ motion }: Props) {
  const { walletAddress, isWalletConnected } = useWalletInfo()
  const motionContract = useContractMotionWeb3()
  const checkWalletConnect = useCheckWalletConnect()

  const balanceAtData = useTokenRpcSwr(
    TOKENS.ldo,
    walletAddress ? 'balanceOfAt' : null,
    String(walletAddress),
    motion.snapshotBlock,
  )
  const balanceAt = balanceAtData.data && formatEther(balanceAtData.data)

  const isAlreadyObjectedData = useContractRpcSwr(
    motionContract,
    walletAddress ? 'objections' : null,
    motion.id,
    walletAddress as string,
  )
  const isAlreadyObjected =
    isAlreadyObjectedData.data && isAlreadyObjectedData.data

  const canObjectData = useContractRpcSwr(
    motionContract,
    walletAddress ? 'canObjectToMotion' : null,
    motion.id,
    walletAddress as string,
  )
  const canObject = canObjectData.data && canObjectData.data

  const isLoadingActions =
    canObjectData.initialLoading || balanceAtData.initialLoading

  // Submit Objection
  const handleSubmitObjection = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      if (!canObject) {
        toastError('You cannot submit objection to this motion')
        return
      }
      const res = await motionContract.objectToMotion(motion.id, {
        gasLimit: 120000,
      })

      // motionContract.
      // res.wait().then(r => {
      //   console.log(r)
      // })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motionContract, motion.id, canObject])

  // Enact Motion
  const handleEnact = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const { _evmScriptCallData: callData } = await getEventMotionCreated(
        motionContract,
        motion.id,
      )
      const res = await motionContract.enactMotion(motion.id, callData, {
        gasLimit: 500000,
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motion.id, motionContract])

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
