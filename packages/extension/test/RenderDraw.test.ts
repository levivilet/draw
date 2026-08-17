import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { renderDraw, renderStroke } from '../src/parts/RenderDraw/RenderDraw.ts'

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

test('renders strokes as positioned line segments', () => {
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
    style:
      'left:4px;top:5px;width:5.656854249492381px;transform:translateY(-50%) rotate(0.7853981633974483rad);',
    type: VirtualDomElements.Div,
  })
})

test('renders a single point and handles an empty stroke', () => {
  expect(renderStroke({ points: [{ x: 2, y: 3 }] })).toEqual([
    {
      childCount: 0,
      className: 'DrawStroke DrawStrokePoint',
      style: 'left:2px;top:3px;',
      type: VirtualDomElements.Div,
    },
  ])
  expect(renderStroke({ points: [] })).toEqual([])
})
