import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import {
  renderDraw,
  toPathData,
} from '../src/parts/RenderDraw/RenderDraw.ts'

test('renders an empty whiteboard with a disabled clear button', () => {
  const dom = renderDraw([])

  expect(dom).toHaveLength(10)
  expect(dom[4]).toMatchObject({
    disabled: true,
    onClick: 'handleClear',
  })
  expect(dom[6]).toMatchObject({
    className: 'DrawBoard',
    onPointerDown: 'handleDrawPointerDown',
  })
  expect(dom[9]).toMatchObject({ text: 'Start drawing anywhere' })
})

test('renders strokes as svg paths', () => {
  const dom = renderDraw([
    {
      points: [
        { x: 4, y: 5 },
        { x: 8, y: 9 },
      ],
    },
  ])

  expect(dom).toHaveLength(9)
  expect(dom[4]).toMatchObject({ disabled: false })
  expect(dom[8]).toEqual({
    childCount: 0,
    className: 'DrawStroke',
    d: 'M 4 5 L 8 9',
    type: VirtualDomElements.Path,
  })
})

test('creates visible path data for a dot and handles no points', () => {
  expect(toPathData([{ x: 2, y: 3 }])).toBe('M 2 3 L 2 3')
  expect(toPathData([])).toBe('')
})
