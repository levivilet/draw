import { expect, test } from '@jest/globals'
import { toLocalPoint } from '../src/parts/Point/Point.ts'

test('converts client coordinates to board-local coordinates', () => {
  expect(toLocalPoint(150, 90, [20, 10, 30, 5])).toEqual({
    x: 100,
    y: 75,
  })
})

test('handles missing, invalid, and negative coordinates', () => {
  expect(toLocalPoint('invalid', Number.NaN, [undefined, null])).toEqual({
    x: 0,
    y: 0,
  })
  expect(toLocalPoint(10, 10, [20, 20])).toEqual({ x: 0, y: 0 })
})
