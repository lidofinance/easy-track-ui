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
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : FALLBACK_ERROR,
      error,
    )
    res.status(500).json({ error: FALLBACK_ERROR })
  }
}
