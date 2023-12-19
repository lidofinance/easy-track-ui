import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCowApi } from 'modules/stonks/utils/fetchCowApi'

export default async function createOrder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const uid = await fetchCowApi<string>({
      chainId: req.query.chainId,
      url: '/orders',
      method: 'POST',
      body: JSON.stringify(req.body),
    })

    res.status(201).json(uid)
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error occured while creating order'
    console.error(errorMessage, error)
    res.status(500).send({ error: errorMessage })
  }
}
