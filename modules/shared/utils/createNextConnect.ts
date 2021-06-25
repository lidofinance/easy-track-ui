import Cors from 'cors'
import nextConnect from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'

export const createNextConnect = () =>
  nextConnect<NextApiRequest, NextApiResponse>().use(
    Cors({
      methods: 'GET',
      origin: '*',
    }),
  )
