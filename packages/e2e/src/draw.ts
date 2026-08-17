import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.basic'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('draw.show')
  const board = Locator('.DrawBoard')
  await expect(board).toBeVisible()
  await expect(Locator('.DrawClearButton')).toHaveJSProperty('disabled', true)
}
