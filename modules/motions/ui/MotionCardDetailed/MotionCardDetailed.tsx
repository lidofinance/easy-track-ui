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
import { toastError } from 'modules/toasts'
import { TOKENS } from 'modules/tokens/tokens'

type Props = {
  motion: Motion
}

export function MotionCardDetailed({ motion }: Props) {
  const { walletAddress, isWalletConnected } = useWalletInfo()
  const isAuthorConnected = walletAddress === motion.creator
  const openConnectWalletModal = useConnectWalletModal()
  const currentChainId = useCurrentChain()

  const motionContract = useMotionContractWeb3()

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

  const checkWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      openConnectWalletModal()
      return false
    }
    return true
  }, [isWalletConnected, openConnectWalletModal])

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
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motionContract, motion.id, canObject])

  // Enact Motion
  const handleEnact = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const filter = motionContract.filters.MotionCreated(motion.id)
      const event = (await motionContract.queryFilter(filter))[0]

      if (!event.decode) {
        throw new Error('Motion creation event parsing error')
      }

      const callData = event.decode(event.data, event.topics)._evmScriptCallData
      const res = await motionContract.enactMotion(motion.id, callData, {
        gasLimit: 500000,
      })

      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, motion.id, motionContract])

  // Cancel Motion
  const handleCancel = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const res = await motionContract.cancelMotion(motion.id, {
        gasLimit: 120000,
      })
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
                {motion.status === MotionStatus.PENDING && (
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
          <InfoText>{motion.status}</InfoText>
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
