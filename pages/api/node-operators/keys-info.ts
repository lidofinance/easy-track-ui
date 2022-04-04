import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { parseChainId } from 'modules/blockChain/chains'
import { logger } from 'modules/shared/utils/log'
import { fetch } from '@lido-sdk/fetch'

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const data = await fetch(
      `https://operators.testnet.fi/api/operators?chainId=${chainId}`,
    )
    const parsed = await data.json()
    res.json(parsed)
  } catch (e) {
    logger.error(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
