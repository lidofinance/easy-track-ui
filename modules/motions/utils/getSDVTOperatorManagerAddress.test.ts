import { CHAINS } from '@lido-sdk/constants'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { utils } from 'ethers'
import { NodeOperatorsRegistryAbi__factory } from 'generated'
import { SDVTRegistry } from 'modules/blockChain/contractAddresses'
import { MANAGER_ADDRESS_MAP } from './getSDVTOperatorManagerAddress'

const SIGNING_KEYS_ROLE =
  '0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee'

describe('sdvt manager address map validation', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('map is valid on Mainnet', async () => {
    // Put it to .env.test.local
    const rpcUrl = process.env.RPC_URL!
    const chainId = CHAINS.Mainnet
    expect(rpcUrl).toBeDefined()

    const provider = getStaticRpcBatchProvider(chainId, rpcUrl)
    const sdvtRegistry = NodeOperatorsRegistryAbi__factory.connect(
      SDVTRegistry[chainId]!,
      provider,
    )

    const invalidAddresses = []
    const addressMap = MANAGER_ADDRESS_MAP[chainId]

    expect(addressMap).toBeDefined()

    for (const entry of Object.entries(addressMap!)) {
      const [id, address] = entry

      const canPerform = await sdvtRegistry.canPerform(
        utils.getAddress(address!),
        SIGNING_KEYS_ROLE,
        [parseInt(id)],
      )

      if (!canPerform) {
        invalidAddresses.push({
          id: id,
          address: address,
        })
      }
    }

    expect(invalidAddresses.length).toBe(0)

    if (invalidAddresses.length > 0) {
      console.log('Invalid addresses found:')
      invalidAddresses.forEach(entry => {
        console.log(`ID: ${entry.id}, Address: ${entry.address}`)
      })
    } else {
      console.log('All addresses are valid.')
    }
  }, 120_000)
})
