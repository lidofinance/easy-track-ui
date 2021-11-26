import type { NextApiRequest, NextApiResponse } from 'next'
import { parseChainId } from 'modules/blockChain/chains'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import { fetchWithFallback } from 'modules/network/utils/fetchWithFallback'

export default async function rpc(req: NextApiRequest, res: NextApiResponse) {
  try {
    const chainId = parseChainId(String(req.query.chainId))

    const urls = getRpcJsonUrls(chainId)
    const requested = await fetchWithFallback(urls, {
      method: 'POST',
      // Next by default parses our body for us, we don't want that here
      body: JSON.stringify(req.body),
    })

    const responded = await requested.json()
    res.status(requested.status).json(responded)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Something went wrong!' })
  }
}
