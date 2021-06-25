import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { getLibrary } from 'modules/blockChain/utils/getLibrary'
import { ChainId, parseChainId } from 'modules/blockChain/chains'
import { connectEasyTrackMock } from 'modules/blockChain/contracts'
import { formatMotionData } from 'modules/motions/utils/formatMotionData'

async function getMotions(chainId: ChainId) {
  const library = getLibrary(chainId)

  const easyTracksContract = connectEasyTrackMock({ chainId, library })
  const motions = await easyTracksContract.getMotions()

  return motions.map(formatMotionData)
}

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const motions = await getMotions(chainId)
    res.json({ motions })
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
