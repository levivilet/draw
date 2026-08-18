import { expect, test } from '@jest/globals'
import { renderFocus } from '../src/parts/RenderFocus/RenderFocus.ts'

test('focuses the text input when text editing starts', () => {
  expect(renderFocus({}, { 'draw.textInputFocus': true })).toBe('.DrawText')
})

test('does not change focus while text editing remains active', () => {
  const context = { 'draw.textInputFocus': true }
  expect(renderFocus(context, context)).toBe('')
})
