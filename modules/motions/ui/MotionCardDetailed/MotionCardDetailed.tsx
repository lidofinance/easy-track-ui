import { formatEther } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useMotionContractWeb3 } from 'modules/motions/hooks/useMotionContract'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { useContractRpcSwr } from 'modules/blockChain/hooks/useContractRpcSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useTokenRpcSwr } from 'modules/tokens/hooks/useTokenRpcSwr'

import { Button } from '@lidofinance/lido-ui'
import { Card } from 'modules/shared/ui/Common/Card'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { MotionDate } from '../MotionDate'
import { MotionObjectionsBar } from '../MotionObjectionsBar'
import {
  InfoTitle,
  InfoText,
  Layout,
  MainBody,
  Column,
  Actions,
} from './MotionCardDetailedStyle'

import { Motion, MotionStatus } from 'modules/motions/types'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { getMotionStatus } from 'modules/motions/utils/getMotionStatus'
import { toastError } from 'modules/toasts'
import { TOKENS } from 'modules/tokens/tokens'

type Props = {
  motion: Motion
}

export function MotionCardDetailed({ motion }: Props) {
  const { walletAddress, isWalletConnected } = useWalletInfo()
  const isAuthorConnected = walletAddress === motion.creator
  const openConnectWalletModal = useConnectWalletModal()
  const motionStatus = getMotionStatus(motion)
  const currentChainId = useCurrentChain()

  const gasLimit = 120000

  const motionContract = useMotionContractWeb3()

  const balanceAtData = useTokenRpcSwr(
    TOKENS.ldo,
    walletAddress ? 'balanceOfAt' : null,
    String(walletAddress),
    motion.snapshotBlock,
  )
  const balanceAt = balanceAtData.data && formatEther(balanceAtData.data)

  const canObjectData = useContractRpcSwr(
    motionContract,
    walletAddress ? 'canObjectToMotion' : null,
    motion.id,
    walletAddress as string,
  )
  const canObject = canObjectData.data && canObjectData.data

  const isAlreadyObjected = Number(balanceAt) > 0 && !canObject
  const isLoadingActions =
    canObjectData.initialLoading || balanceAtData.initialLoading

  const checkWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      openConnectWalletModal()
      return false
    }
    return true
  }, [isWalletConnected, openConnectWalletModal])

  const handleSubmitObjection = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      if (!canObject) {
        toastError('You cannot submit objection to this motion')
        return
      }
      const res = await motionContract.objectToMotion(motion.id, { gasLimit })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motionContract, motion.id, canObject])

  const handleEnact = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const res = await motionContract.enactMotion(motion.id, [1], {
        gasLimit,
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motionContract, motion.id])

  const handleCancel = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const res = await motionContract.cancelMotion(motion.id, { gasLimit })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motionContract, motion.id])

  return (
    <Layout>
      <MainBody>
        <Card>
          <InfoTitle children="Type" />
          <InfoText>
            {getMotionTypeByScriptFactory(
              currentChainId,
              motion.evmScriptFactory,
            )}
          </InfoText>

          <InfoTitle children="Description" />
          <InfoText style={{ wordBreak: 'break-all' }}>
            Snapshot: {motion.snapshotBlock}
            <br />
            Factory: {motion.evmScriptFactory}
            <br />
            Hash: {motion.evmScriptHash}
          </InfoText>

          <InfoTitle children="Objections" />
          <InfoText>
            <MotionObjectionsBar motion={motion} />
          </InfoText>

          {!isWalletConnected && (
            <>
              <InfoTitle children="Actions" />
              <InfoText children="Connect your wallet to interact with this motion" />
            </>
          )}

          {isWalletConnected && isLoadingActions && (
            <>
              <InfoTitle children="Actions" />
              <InfoText children="Loading..." />
            </>
          )}

          {isWalletConnected && !isLoadingActions && (
            <>
              <InfoTitle children="Actions" />
              <InfoText>
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
              </InfoText>
              <Actions>
                {canObject && (
                  <Button
                    size="sm"
                    children="Submit objection"
                    onClick={handleSubmitObjection}
                  />
                )}
                {motionStatus === MotionStatus.Pending && (
                  <Button size="sm" children="Enact" onClick={handleEnact} />
                )}
                {isAuthorConnected && (
                  <Button
                    variant="translucent"
                    size="sm"
                    children="Cancel"
                    onClick={handleCancel}
                  />
                )}
              </Actions>
            </>
          )}
        </Card>
      </MainBody>

      <Column>
        <Card>
          <InfoTitle children="Status" />
          <InfoText>{motionStatus}</InfoText>
        </Card>
        <Card>
          <InfoTitle children="Start – End" />
          <MotionDate fontSize={16} fontWeight={400} showYear motion={motion} />
        </Card>
        <Card>
          <InfoTitle children="Created by" />
          <AddressWithPop diameter={20} symbols={5} address={motion.creator} />
        </Card>
      </Column>
    </Layout>
  )
}
