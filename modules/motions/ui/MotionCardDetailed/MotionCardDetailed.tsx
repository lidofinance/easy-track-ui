import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'

import { Button } from '@lidofinance/lido-ui'
import { Card } from 'modules/shared/ui/Common/Card'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import {
  InfoTitle,
  InfoText,
  Layout,
  MainBody,
  Column,
  Actions,
} from './MotionCardDetailedStyle'
import { MotionDate } from '../MotionDate'

import type { Motion } from 'modules/motions/types'
import { connectEasyTrackMock } from 'modules/blockChain/contracts'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

type Props = {
  motion: Motion
}

export function MotionCardDetailed({ motion }: Props) {
  const { walletAddress } = useWalletInfo()
  const isAuthorConnected = walletAddress === motion.creator

  const { library } = useWeb3React()
  const currentChainId = useCurrentChain()
  const handleSubmitObjection = useCallback(async () => {
    try {
      const contract = connectEasyTrackMock({
        chainId: currentChainId,
        library: library.getSigner(),
      })
      const res = await contract.objectToMotion(motion.id)
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }, [currentChainId, library, motion.id])

  return (
    <Layout>
      <MainBody>
        <Card>
          <InfoTitle children="Description" />
          <InfoText style={{ wordBreak: 'break-all' }}>
            Factory: {motion.evmScriptFactory}
            <br />
            Hash: {motion.evmScriptHash}
            <br />
            Call data: {motion.evmScriptCallData}
          </InfoText>

          <InfoTitle children="Objections" />
          <InfoText>
            Threshold: {motion.objectionsThreshold / 100}%
            <br />
            Amount: {motion.objectionsAmount} (
            {motion.objectionsAmountPct / 100}%)
          </InfoText>

          <Actions>
            <Button
              size="sm"
              children="Submit objection"
              onClick={handleSubmitObjection}
            />
            {isAuthorConnected && <Button size="sm" children="Enact" />}
            {isAuthorConnected && (
              <Button variant="translucent" size="sm" children="Cancel" />
            )}
          </Actions>
        </Card>
      </MainBody>

      <Column>
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
