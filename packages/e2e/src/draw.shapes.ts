import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.shapes'

// TODO enable when the test worker can query secondary preview extension views.
export const skip = true

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.executeExtensionCommand('draw.show')
  const rectangleButton = Locator('.DrawToolButton[name="rectangle"]')
  await rectangleButton.dispatchEvent('click', { bubbles: true } as any)
  const shapePicker = Locator('.DrawShapePicker')
  await expect(shapePicker).toHaveCount(1)

  const board = Locator('.DrawBoard')
  await Command.execute('PointerCapture.mock')

  const circleButton = Locator('.DrawShapeOptionButton[name="circle"]')
  await circleButton.dispatchEvent('click', { bubbles: true } as any)
  await board.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 100,
    clientY: 100,
    pointerId: 1,
  } as any)
  await board.dispatchEvent('pointerup', {
    bubbles: true,
    clientX: 160,
    clientY: 140,
    pointerId: 1,
  } as any)
  const circle = Locator('.DrawCircle')
  await expect(circle).toHaveCount(1)

  const triangleButton = Locator('.DrawShapeOptionButton[name="triangle"]')
  await triangleButton.dispatchEvent('click', { bubbles: true } as any)
  await board.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 200,
    clientY: 100,
    pointerId: 2,
  } as any)
  await board.dispatchEvent('pointerup', {
    bubbles: true,
    clientX: 260,
    clientY: 160,
    pointerId: 2,
  } as any)
  const triangle = Locator('.DrawTriangle')
  await expect(triangle).toHaveCount(1)

  await Command.execute('PointerCapture.unmock')
}
