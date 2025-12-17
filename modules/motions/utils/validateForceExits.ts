import { ToastError } from '@lidofinance/lido-ui'

import { BigNumber, ethers } from 'ethers'
import { LimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { VaultsAdapterAbi__factory } from 'generated'
import { CHAINS } from '@lido-sdk/constants'
import { VaultsAdapter } from 'modules/blockChain/contractAddresses'

const PUBLIC_KEY_BYTES_LENGTH = 48
const WITHDRAWAL_REQUEST_ADDRESS = '0x00000961Ef480Eb55e80D19ad83579A64c007002'

type FormArgs = {
  vaults: { pubkey: string }[]
}

type ChainArgs = {
  chainId: CHAINS
  provider: LimitedJsonRpcBatchProvider
}

export const validateForceExits = async (
  { vaults }: FormArgs,
  { provider, chainId }: ChainArgs,
) => {
  try {
    const feeData = await provider.call({
      to: WITHDRAWAL_REQUEST_ADDRESS,
      data: '0x',
    })

    // Check if the data is valid (32 bytes, 66 chars starting with 0x)
    if (feeData.length !== 66) {
      throw new Error('Invalid fee data length')
    }

    const abiCoder = new ethers.utils.AbiCoder()
    const fee: BigNumber = abiCoder.decode(['uint256'], feeData)[0]

    let numKeys = 0

    for (let i = 0; i < vaults.length; i++) {
      const pubkeyBytes = ethers.utils.arrayify(vaults[i].pubkey)

      numKeys += pubkeyBytes.length / PUBLIC_KEY_BYTES_LENGTH
    }

    const vaultsAdapterAddress = VaultsAdapter[chainId]
    if (!vaultsAdapterAddress) {
      return 'Vaults Adapter address is not defined for the selected network'
    }

    const vaultsAdapter = VaultsAdapterAbi__factory.connect(
      vaultsAdapterAddress,
      provider,
    )

    const validatorExitFeeLimit = await vaultsAdapter.validatorExitFeeLimit()
    if (fee.gt(validatorExitFeeLimit)) {
      return 'Validator exit fee exceeds the limit set by the Vaults Adapter'
    }

    const balance = await provider.getBalance(vaultsAdapterAddress)
    const totalFeeRequired = BigNumber.from(numKeys).mul(fee)

    if (totalFeeRequired.gt(balance)) {
      return `The VaultsAdapter does not have enough ETH to cover the exit fees. Required: ${ethers.utils.formatEther(
        totalFeeRequired,
      )} ETH, available: ${ethers.utils.formatEther(balance)} ETH`
    }

    return null
  } catch (error) {
    console.error('Error fetching withdrawal request fee data', {
      error,
    })
    ToastError(
      'Unable to fetch withdrawal request fee data. Transaction may fail.',
      {},
    )
    // Do not return error message to not block form submission
    return null
  }
}
