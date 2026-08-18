import { expect, test } from '@jest/globals'
import type { Shape } from '../src/parts/DrawState/DrawState.ts'
import {
  createDrawingFile,
  serializeDrawing,
} from '../src/parts/SerializeDrawing/SerializeDrawing.ts'

// cspell:ignore tldraw

const shapes: readonly Shape[] = [
  {
    end: { x: 10, y: 20 },
    id: 4,
    start: { x: 25, y: 45 },
    type: 'line',
  },
  {
    end: { x: 30, y: 40 },
    id: 7,
    start: { x: 70, y: 90 },
    type: 'rectangle',
  },
  {
    id: 9,
    point: { x: 100, y: 120 },
    text: 'Review this',
    type: 'text',
  },
]

test('creates a versioned drawing with tldraw-v1-style shape records', () => {
  expect(createDrawingFile(shapes)).toEqual({
    format: 'lvce-draw',
    page: {
      id: 'page:1',
      name: 'Page 1',
      shapes: {
        'shape:4': {
          childIndex: 0,
          handles: {
            end: { id: 'end', index: 1, point: [0, 0] },
            start: { id: 'start', index: 0, point: [15, 25] },
          },
          id: 'shape:4',
          name: 'Line',
          parentId: 'page:1',
          point: [10, 20],
          rotation: 0,
          type: 'line',
        },
        'shape:7': {
          childIndex: 1,
          id: 'shape:7',
          name: 'Rectangle',
          parentId: 'page:1',
          point: [30, 40],
          rotation: 0,
          size: [40, 50],
          type: 'rectangle',
        },
        'shape:9': {
          childIndex: 2,
          id: 'shape:9',
          name: 'Text',
          parentId: 'page:1',
          point: [100, 120],
          rotation: 0,
          text: 'Review this',
          type: 'text',
        },
      },
    },
    version: 1,
  })
})

test('serializes indented JSON with a final newline', () => {
  const serialized = serializeDrawing([])

  expect(serialized).toContain('\n  "format": "lvce-draw",')
  expect(serialized.endsWith('\n')).toBe(true)
  expect(JSON.parse(serialized)).toEqual(createDrawingFile([]))
})
