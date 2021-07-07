import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { getLibrary } from 'modules/blockChain/utils/getLibrary'
import { parseChainId } from 'modules/blockChain/chains'
import { connectEasyTrack } from 'modules/blockChain/contracts'
import { formatMotionDataOnchain } from 'modules/motions/utils/formatMotionDataOnchain'

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const library = getLibrary(chainId)
    const easyTracksContract = connectEasyTrack({ chainId, library })
    const motions = await easyTracksContract.getMotions()
    res.json(motions.map(formatMotionDataOnchain).reverse())
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
