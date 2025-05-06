import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Form } from 'modules/shared/ui/Controls/Form'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Button, Container, ToastSuccess } from '@lidofinance/lido-ui'
import {
  Actions,
  Card,
  DescriptionText,
  DescriptionTitle,
  Fieldset,
} from './StyledFormStyle'
import { ethers } from 'ethers'
import { getChainName } from 'modules/blockChain/chains'
import { isUrl } from 'modules/shared/utils/isUrl'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'

type FormValues = {
  rpcUrl: string
}

export function SettingsForm() {
  const { savedConfig, setSavedConfig } = useConfig()
  const { chainId } = useWeb3()

  const formMethods = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      rpcUrl: savedConfig.rpcUrls[chainId] || '',
    },
  })

  const { formState, setValue, getValues } = formMethods

  const saveSettings = useCallback(
    (formValues: FormValues) => {
      setSavedConfig({
        rpcUrls: {
          [chainId]: formValues.rpcUrl,
        },
      })
    },
    [chainId, setSavedConfig],
  )

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      saveSettings(formValues)
      ToastSuccess('Settings have been saved')
    },
    [saveSettings],
  )

  const validateRpcUrl = useCallback(
    async (rpcUrl: string) => {
      if (!rpcUrl) return true
      if (!isUrl(rpcUrl)) return 'Given string is not valid url'
      try {
        // Check chain id
        const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const network = await rpcProvider.getNetwork()
        if (network.chainId !== chainId) {
          return `Url is working, but network does not match to ${getChainName(
            chainId!,
          )}`
        }

        // Doing a random request to check rpc url is fetchable
        const library = getLimitedJsonRpcBatchProvider(chainId, rpcUrl)
        const easyTrack = ContractEasyTrack.connect({ chainId, library })
        await easyTrack.getMotions()

        // All fine
        return true
      } catch (err) {
        console.error(err)
        return 'Given url is not working'
      }
    },
    [chainId],
  )

  const handleReset = useCallback(() => {
    setValue('rpcUrl', '')
    saveSettings(getValues())
    ToastSuccess('Settings have been reset')
  }, [setValue, saveSettings, getValues])

  return (
    <Container as="main" size="tight">
      <Card data-testid="settingsSection">
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <Fieldset>
            <InputControl
              label="RPC Url (infura / alchemy / custom)"
              name="rpcUrl"
              rules={{ validate: validateRpcUrl }}
            />
          </Fieldset>
          <Actions>
            <Button
              fullwidth
              variant="translucent"
              children="Reset to defaults"
              onClick={handleReset}
              data-testid="resetBtn"
            />
            <Button
              type="submit"
              fullwidth
              color="primary"
              children="Save"
              loading={formState.isValidating}
              disabled={!formState.isValid || formState.isValidating}
              data-testid="saveBtn"
            />
          </Actions>
        </Form>
      </Card>

      <br />

      <Card>
        <DescriptionText data-testid="faqSection">
          <DescriptionTitle>What are these settings for?</DescriptionTitle>
          <p>
            This website relies on a JSON RPC connection. For more reliable
            operation, consider specifying your own. You can get yours by
            visiting the links below.
          </p>
          <p>
            Ethereum nodes:{' '}
            <a
              target="_blank"
              href="https://ethereumnodes.com/"
              rel="noreferrer"
            >
              ethereumnodes.com
            </a>
          </p>
        </DescriptionText>
      </Card>
    </Container>
  )
}
