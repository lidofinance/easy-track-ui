export const isValidCID = (input: string) => {
  if (!input) {
    return false
  }

  // v0: Qm... base58btc, exactly 46 chars
  const cidRegexpV0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/

  // v1: includes all used multibase prefixes for v1 CIDs
  const cidRegexpV1 = /^[fFbBzmuU][A-Za-z0-9+/=._-]+$/

  // Combined check: v0 OR v1
  return new RegExp(`${cidRegexpV0.source}|${cidRegexpV1.source}`).test(input)
}
