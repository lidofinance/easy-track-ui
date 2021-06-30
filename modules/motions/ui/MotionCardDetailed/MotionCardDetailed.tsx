import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'

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
import { connectEasyTrackMock } from 'modules/blockChain/contracts'
import { getMotionType } from 'modules/motions/utils/getMotionType'
import { getMotionStatus } from 'modules/motions/utils/getMotionStatus'

type Props = {
  motion: Motion
}

export function MotionCardDetailed({ motion }: Props) {
  const { walletAddress, isWalletConnected } = useWalletInfo()
  const isAuthorConnected = walletAddress === motion.creator
  const openConnectWalletModal = useConnectWalletModal()
  const motionStatus = getMotionStatus(motion)

  const { library } = useWeb3React()
  const currentChainId = useCurrentChain()
  const gasLimit = 21000

  const checkWalletConnect = useCallback(() => {
    if (!isWalletConnected) {
      openConnectWalletModal()
      return false
    }
    return true
  }, [isWalletConnected, openConnectWalletModal])

  const getContract = useCallback(
    () =>
      connectEasyTrackMock({
        chainId: currentChainId,
        library: library.getSigner(),
      }),
    [currentChainId, library],
  )

  const handleSubmitObjection = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const contract = getContract()
      const res = await contract.objectToMotion(motion.id, { gasLimit })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, getContract, motion.id])

  const handleEnact = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const contract = getContract()
      const res = await contract.enactMotion(motion.id, { gasLimit })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, getContract, motion.id])

  const handleCancel = useCallback(async () => {
    if (!checkWalletConnect()) return
    try {
      const contract = getContract()
      const res = await contract.cancelMotion(motion.id, { gasLimit })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [checkWalletConnect, getContract, motion.id])

  return (
    <Layout>
      <MainBody>
        <Card>
          <InfoTitle children="Type" />
          <InfoText>{getMotionType(motion.evmScriptFactory)}</InfoText>

          <InfoTitle children="Description" />
          <InfoText style={{ wordBreak: 'break-all' }}>
            Snapshot: {motion.snapshotBlock}
            <br />
            Factory: {motion.evmScriptFactory}
            <br />
            Hash: {motion.evmScriptHash}
            <br />
            Call data: {motion.evmScriptCallData}
          </InfoText>

          <InfoTitle children="Objections" />
          <InfoText>
            <MotionObjectionsBar motion={motion} />
          </InfoText>

          <Actions>
            <Button
              size="sm"
              children="Submit objection"
              onClick={handleSubmitObjection}
            />
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
