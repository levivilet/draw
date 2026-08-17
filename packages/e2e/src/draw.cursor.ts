import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'draw.cursor'

// TODO enable when the test worker can query secondary preview extension views.
export const skip = true

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.executeExtensionCommand('draw.show')
  const cursor = Locator('.DrawToolButton[name="cursor"]')
  await expect(cursor).toHaveAttribute('aria-pressed', 'true')

  const rectangle = Locator('.DrawToolButton[name="rectangle"]')
  await rectangle.dispatchEvent('click', { bubbles: true } as any)
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
    clientY: 160,
    pointerId: 1,
  } as any)

  await cursor.dispatchEvent('click', { bubbles: true } as any)
  const shape = Locator('.DrawRectangle')
  await shape.dispatchEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: 120,
    clientY: 120,
    pointerId: 2,
  } as any)
  await shape.dispatchEvent('pointerup', {
    bubbles: true,
    clientX: 140,
    clientY: 140,
    pointerId: 2,
  } as any)
  await expect(shape).toHaveClass(
    'DrawShape DrawRectangle DrawShape0 DrawShapeSelected',
  )
  await Command.execute('PointerCapture.unmock')
}
