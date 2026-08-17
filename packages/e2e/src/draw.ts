import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.basic'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.executeExtensionCommand('draw.show')
  const board = Locator('.DrawBoard')
  const clearButton = Locator('.DrawClearButton')
  await expect(board).toBeVisible()
  await expect(clearButton).toHaveJSProperty('disabled', true)

  await Command.execute('PointerCapture.mock')
  await board.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 100,
    clientY: 100,
    pointerId: 1,
  } as any)
  await board.dispatchEvent('pointermove', {
    bubbles: true,
    clientX: 140,
    clientY: 120,
    pointerId: 1,
  } as any)
  await board.dispatchEvent('pointerup', {
    bubbles: true,
    clientX: 180,
    clientY: 140,
    pointerId: 1,
  } as any)

  const stroke = Locator('.DrawStroke')
  await expect(stroke).toHaveCount(2)
  await Command.executeExtensionCommand('draw.clear')
  await expect(stroke).toHaveCount(0)
  await Command.execute('PointerCapture.unmock')
}
