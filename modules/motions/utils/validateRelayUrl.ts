export function validateRelayUrl(value: string): string | false {
  try {
    const url = new URL(value)

    // Must use HTTPS
    if (url.protocol !== 'https:') {
      return 'URL must start with https://'
    }

    // Must have a username (the 0x-hex pubkey)
    if (!url.username) {
      return 'URL must include a pubkey before the @'
    }
    // Validate that username is 0x + hex digits
    if (!/^0x[0-9a-fA-F]+$/.test(url.username)) {
      return 'Pubkey must be a hex string prefixed with 0x'
    }

    // Must have a host
    if (!url.host) {
      return 'URL must include a host after the @'
    }

    return false
  } catch {
    return 'Must be a valid URL of the form https://<0xpubkey>@<host>'
  }
}
