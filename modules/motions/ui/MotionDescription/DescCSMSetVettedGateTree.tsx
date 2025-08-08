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
      <div>
        <strong>Set CSM Vetted Gate Tree:</strong>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li>
            <strong>Tree Root:</strong>
            <div style={{ marginLeft: '1rem' }}>
              {showCurrentGateInfo && (
                <div>
                  <span>Current:</span> <code>{vettedGateInfo.treeRoot}</code>
                </div>
              )}
              <div>
                <span>New:</span> <code>{newRoot}</code>
              </div>
            </div>
          </li>
          <li style={{ marginTop: '1rem' }}>
            <strong>Tree CID:</strong>
            <div style={{ marginLeft: '1rem' }}>
              {showCurrentGateInfo && (
                <div>
                  <span>Current:</span> <code>{vettedGateInfo.treeCid}</code>
                </div>
              )}
              <div>
                <span>New:</span> <code>{newCid}</code>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}
