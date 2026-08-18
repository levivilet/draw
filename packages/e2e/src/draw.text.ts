import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.text'

// TODO enable when the test worker can query secondary preview extension views.
export const skip = true

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.executeExtensionCommand('draw.show')
  const textButton = Locator('.DrawToolButton[name="text"]')
  await textButton.dispatchEvent('click', { bubbles: true } as any)
  const board = Locator('.DrawBoard')
  await board.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 120,
    clientY: 120,
    pointerId: 1,
  } as any)
  const input = Locator('input.DrawText')
  await expect(input).toBeFocused()
  await input.type('Hello whiteboard')
  await expect(input).toHaveValue('Hello whiteboard')
}
