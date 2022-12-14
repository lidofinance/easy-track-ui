type InputValue = {
  address: string
  amount: string
}

export function checkInputsGreaterThanLimit({
  spendableBalanceInPeriod,
  inputValues,
  currentValue,
}: {
  spendableBalanceInPeriod: number
  inputValues: InputValue[]
  currentValue: { value: number; index: number }
}) {
  const amount = inputValues.reduce(
    (acc, program, index) =>
      index !== currentValue.index ? acc + Number(program.amount) : acc,
    Number(currentValue.value),
  )

  return amount > spendableBalanceInPeriod
}
