import * as ContextKey from '../ContextKey/ContextKey.ts'

export const renderFocus = (
  oldContext: Readonly<Record<string, boolean>>,
  newContext: Readonly<Record<string, boolean>>,
): string => {
  if (
    !oldContext[ContextKey.TextInputFocus] &&
    newContext[ContextKey.TextInputFocus]
  ) {
    return '.DrawText'
  }
  return ''
}
