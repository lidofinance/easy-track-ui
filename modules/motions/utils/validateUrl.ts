export function validateUrl(value: string): string | false {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') {
      return 'URL must be HTTPS'
    }

    return false
  } catch (error) {
    return 'Must be a valid URL'
  }
}
