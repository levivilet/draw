import type { DrawCredentials } from '../DrawTypes/DrawTypes.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const apiKeyPattern = /^[A-Za-z0-9]{32}$/

export const validateCredentials = (
  credentials: Readonly<DrawCredentials>,
): string => {
  if (!credentials.apiKey.trim() || !credentials.token.trim()) {
    return DrawStrings.apiKeyAndTokenRequired()
  }
  if (!apiKeyPattern.test(credentials.apiKey)) {
    return DrawStrings.apiKeyInvalid()
  }
  return ''
}
