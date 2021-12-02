import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useConfig } from 'modules/config/hooks/useConfig'

import { Button } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { NetworksBox } from './NetworkSwitcherStyle'

import { Chains, getChainName } from 'modules/blockChain/chains'

export function NetworkSwitcher() {
  const { library } = useWeb3React()
  const { supportedChainIds } = useConfig()

  const handleChangeNetwork = useCallback(
    (switchTo: Chains) => {
      if (!library) return
      library.send('wallet_switchEthereumChain', [
        { chainId: `0x${switchTo.toString(16)}` },
      ])
    },
    [library],
  )

  return (
    <>
      <Title
        title="Network does not match"
        subtitle={<>Please, switch to another network</>}
      />
      <NetworksBox>
        {supportedChainIds.map(supportedChainId => (
          <Button
            key={supportedChainId}
            size="sm"
            variant="filled"
            onClick={() => handleChangeNetwork(supportedChainId)}
          >
            {getChainName(supportedChainId)}
          </Button>
        ))}
      </NetworksBox>
    </>
  )
}
