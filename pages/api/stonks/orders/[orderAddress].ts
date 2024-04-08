import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCowApi } from 'modules/stonks/utils/fetchCowApi'

const FALLBACK_ERROR = 'Error occured while fetching order data'

export default async function getOrder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const orderAddress = req.query.orderAddress as string
    const orderData = await fetchCowApi({
      chainId: req.query.chainId,
      url: `/account/${orderAddress}/orders`,
      method: 'GET',
    })

    res.status(200).json(orderData)
  } catch (error: any) {
    const code =
      error?.message && error.message.startsWith('NO_CHAIN_') ? 404 : 500
    const message = error?.message || FALLBACK_ERROR
    res.status(code).json({ error: message })
  }
}
