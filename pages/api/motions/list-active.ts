import { flow, map, orderBy } from 'lodash/fp'
import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { getLibraryRpc } from 'modules/blockChain/utils/getLibraryRpc'
import { parseChainId } from 'modules/blockChain/chains'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { formatMotionDataOnchain } from 'modules/motions/utils/formatMotionDataOnchain'
import { logger } from 'modules/shared/utils/log'

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const library = getLibraryRpc(chainId)
    const easyTracksContract = ContractEasyTrack.connect({ chainId, library })
    const motions = await easyTracksContract.getMotions()
    const formatted = flow(
      map(formatMotionDataOnchain),
      orderBy('id', 'desc'),
    )(motions)
    res.json(formatted)
  } catch (e) {
    logger.error(e instanceof Error ? e.message : e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
