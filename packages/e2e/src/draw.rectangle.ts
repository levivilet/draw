import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.rectangle'

// TODO enable when the test worker can query secondary preview extension views.
export const skip = true

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.executeExtensionCommand('draw.show')
  const rectangleButton = Locator('.DrawToolButton[name="rectangle"]')
  await rectangleButton.dispatchEvent('click', { bubbles: true } as any)
  const board = Locator('.DrawBoard')
  await Command.execute('PointerCapture.mock')
  await board.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 160,
    clientY: 160,
    pointerId: 1,
  } as any)
  await board.dispatchEvent('pointerup', {
    bubbles: true,
    clientX: 100,
    clientY: 100,
    pointerId: 1,
  } as any)
  const rectangle = Locator('.DrawRectangle')
  await expect(rectangle).toHaveCount(1)
  await Command.execute('PointerCapture.unmock')
}
