import { CSMSetVettedGateTreeAbi } from 'generated'
import { useCSMVettedGateInfo } from 'modules/motions/hooks/useCSMVettedGateInfo'
import { NestProps } from './types'

// CSMSetVettedGateTree
export function DescCSMSetVettedGateTree({
  callData,
  isOnChain,
}: NestProps<CSMSetVettedGateTreeAbi['decodeEVMScriptCallData']>) {
  const { data: vettedGateInfo } = useCSMVettedGateInfo()

  const [newRoot, newCid] = callData

  const showCurrentGateInfo = vettedGateInfo && isOnChain
  return (
    <>
      Set CSM Vetted Gate Tree:
      <br />
      <ul>
        <li>
          <b>Tree root:</b>{' '}
          {showCurrentGateInfo ? `${vettedGateInfo.treeRoot} &gt; ` : ''}
          {newRoot};
        </li>
        <li>
          <b>Tree cid:</b>{' '}
          {showCurrentGateInfo ? `${vettedGateInfo.treeCid} &gt; ` : ''}
          {newCid}.
        </li>
      </ul>
    </>
  )
}
