import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.arrow'

// TODO enable when the test worker can query secondary preview extension views.
export const skip = true

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.executeExtensionCommand('draw.show')
  const arrowButton = Locator('.DrawToolButton[name="arrow"]')
  await arrowButton.dispatchEvent('click', { bubbles: true } as any)
  const board = Locator('.DrawBoard')
  await Command.execute('PointerCapture.mock')
  await board.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 100,
    clientY: 100,
    pointerId: 1,
  } as any)
  await board.dispatchEvent('pointerup', {
    bubbles: true,
    clientX: 180,
    clientY: 140,
    pointerId: 1,
  } as any)
  const arrow = Locator('.DrawArrow')
  const arrowHead = Locator('.DrawArrowHead')
  await expect(arrow).toHaveCount(1)
  await expect(arrowHead).toHaveCount(1)
  await Command.execute('PointerCapture.unmock')
}
