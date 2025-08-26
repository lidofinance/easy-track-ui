import { ToastError } from '@lidofinance/lido-ui'
import { fetcherIPFS } from 'modules/network/utils/fetcherIPFS'

export const validateGateTreeIpfs = async ({
  treeCid,
  treeRoot,
}: {
  treeCid: string
  treeRoot: string
}) => {
  try {
    const ipfsTree = await fetcherIPFS(treeCid)
    const parsedIpfsTree = JSON.parse(ipfsTree)

    const ipfsTreeRoot = parsedIpfsTree['tree']?.[0]

    if (!ipfsTreeRoot) {
      throw new Error()
    }

    if (ipfsTreeRoot !== treeRoot) {
      return 'Tree root does not match the IPFS tree data'
    }

    return null
  } catch (error) {
    console.error('Error fetching IPFS tree data', {
      error,
      cid: treeCid,
    })
    ToastError(
      `Unable to confirm if tree root matches tree CID. Please check manually before signing.`,
      {},
    )
    // Do not return error message to not block form submission
    return null
  }
}
