export enum ErrorMessage {
  NOT_ENOUGH_ETHER = 'Not enough ether for gas.',
  DENIED_SIG = 'User denied transaction signature.',
  SOMETHING_WRONG = 'Something went wrong.',
  LIMIT_REACHED = 'Transaction could not be completed because stake limit is exhausted. Please wait until the stake limit restores and try again. Otherwise, you can swap your Ethereum on 1inch platform instantly.',
}

export const getErrorMessage = (error: any): ErrorMessage => {
  const code = typeof error.code === 'number' ? error.code : error.error?.code

  if (!code && typeof error.code === 'string') {
    switch (error.code) {
      case 'ACTION_REJECTED':
        return ErrorMessage.DENIED_SIG
      default:
        return ErrorMessage.SOMETHING_WRONG
    }
  }

  switch (code) {
    case -32000:
      return ErrorMessage.NOT_ENOUGH_ETHER
    case 3:
      return ErrorMessage.NOT_ENOUGH_ETHER
    case 4001:
      return ErrorMessage.DENIED_SIG
    default:
      return ErrorMessage.SOMETHING_WRONG
  }
}
