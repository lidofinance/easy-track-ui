import { createNextConnect } from 'modules/utils/createNextConnect'
import { getLibrary } from 'modules/blockChain/utils/getLibrary'
import { connectNodeOperators } from 'modules/blockChain/contracts'
import { ChainId, parseChainId } from 'modules/blockChain/chains'

async function getNodeOperatorsCount(chainId: ChainId) {
  const library = getLibrary(chainId)

  const nodeOperatorsContract = connectNodeOperators({ chainId, library })
  const nodeOperatorsCount = await nodeOperatorsContract.getNodeOperatorsCount()

  return Number(nodeOperatorsCount)
}

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const count = await getNodeOperatorsCount(chainId)
    res.json({ count })
  } catch (e) {
    console.log(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
