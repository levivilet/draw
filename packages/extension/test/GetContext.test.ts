import { expect, test } from '@jest/globals'
import type { DrawState } from '../src/parts/DrawState/DrawState.ts'
import { getContext } from '../src/parts/GetContext/GetContext.ts'

const createState = (): DrawState => ({
  drawing: false,
  nextShapeId: 1,
  originalShape: undefined,
  pointerStart: undefined,
  selectedShapeId: 0,
  selectedTool: 'text',
  shapes: [
    {
      id: 0,
      point: { x: 10, y: 20 },
      text: '',
      type: 'text',
    },
  ],
})

test('returns text input focus context while editing text', () => {
  expect(getContext(createState())).toEqual({
    'draw.textInputFocus': true,
  })
})

test('returns selected shape context while using the cursor', () => {
  expect(
    getContext({
      ...createState(),
      selectedTool: 'cursor',
    }),
  ).toEqual({ 'draw.selectedShape': true })
})

test('returns empty context when no shape is selected', () => {
  expect(
    getContext({
      ...createState(),
      selectedShapeId: undefined,
    }),
  ).toEqual({})
})
