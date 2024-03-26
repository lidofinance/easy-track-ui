import { ResultTx } from 'modules/blockChain/types'
import { StonksOrderProgressRegular } from './StonksOrderProgressRegular'
import { StonksOrderProgressSafe } from './StonksOrderProgressSafe'

type Props = {
  resultTx: ResultTx
}

export function StonksOrderProgress({ resultTx }: Props) {
  if (resultTx.type === 'safe') {
    return <StonksOrderProgressSafe safeTxHash={resultTx.tx.safeTxHash} />
  }

  return <StonksOrderProgressRegular txHash={resultTx.tx.hash} />
}
