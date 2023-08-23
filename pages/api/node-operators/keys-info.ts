import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { parseChainId } from 'modules/blockChain/chains'
import { fetch } from '@lido-sdk/fetch'

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const data = await fetch(
      `https://operators.${
        chainId === 1 ? 'lido' : 'testnet'
      }.fi/api/operators?chainId=${chainId}`,
    )
    const parsed = await data.json()
    res.json(parsed)
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
