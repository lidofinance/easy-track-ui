import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { getLibrary } from 'modules/blockChain/utils/getLibrary'
import { parseChainId } from 'modules/blockChain/chains'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { formatMotionDataOnchain } from 'modules/motions/utils/formatMotionDataOnchain'

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const motionId = Number(req.query.motionId)
    const library = getLibrary(chainId)
    const easyTracksContract = ContractEasyTrack.connect({ chainId, library })
    const motion = await easyTracksContract.getMotion(motionId)
    res.json(formatMotionDataOnchain(motion))
  } catch (e: any) {
    if (e.reason === 'MOTION_NOT_FOUND') {
      res.status(404).send({ error: 'Not found' })
    } else {
      console.error(e)
      res.status(500).send({ error: 'Something went wrong!' })
    }
  }
})
