import { utils } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useRecipientActual } from 'modules/motions/hooks'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { ContractEvmAllowedRecipientRemove } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'

export const formParts = createMotionFormPart({
  motionType: MotionType.AllowedRecipientRemove,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address'],
      [utils.getAddress(formData.address)],
    )
    const gasLimit = await estimateGasFallback(
      contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      { gasLimit },
    )
    return tx
  },
  getDefaultFormData: () => ({
    address: '',
  }),
  Component: function StartNewMotionMotionFormLego({
    fieldNames,
    submitAction,
  }) {
    const allowedRecipients = useRecipientActual({
      registryType: MotionType.AllowedRecipientRemove,
    })
    const { walletAddress } = useWeb3()
    const trustedCaller = ContractEvmAllowedRecipientRemove.useSwrWeb3(
      'trustedCaller',
      [],
    )
    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    if (trustedCaller.initialLoading || allowedRecipients.initialLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        <Fieldset>
          <SelectControl
            label="Allowed recipient address"
            name={fieldNames.address}
            rules={{ required: 'Field is required' }}
          >
            {allowedRecipients.data?.map((program, i) => (
              <Option
                key={i}
                value={program.address}
                children={`${program.title}`}
              />
            ))}
          </SelectControl>
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
