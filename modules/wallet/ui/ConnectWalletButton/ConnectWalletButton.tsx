import { FC } from 'react'
import { useConnect } from 'reef-knot/core-react'
import { Button, ButtonProps } from '@lidofinance/lido-ui'

export const ConnectWalletButton: FC<Omit<ButtonProps, 'onClick'>> = props => {
  const { connect } = useConnect()

  return (
    <Button onClick={connect} data-testid="connectBtn" {...props}>
      Connect wallet
    </Button>
  )
}
