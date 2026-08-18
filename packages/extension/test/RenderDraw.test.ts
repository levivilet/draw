import { expect, test } from '@jest/globals'
import type {
  DrawState,
  Shape,
  Tool,
} from '../src/parts/DrawState/DrawState.ts'
import { getDrawCss } from '../src/parts/GetDrawCss/GetDrawCss.ts'
import { renderDraw } from '../src/parts/RenderDraw/RenderDraw.ts'

const createState = (
  shapes: readonly Shape[] = [],
  selectedTool: Tool = 'cursor',
  selectedShapeId: number | undefined = undefined,
): DrawState => ({
  drawing: false,
  nextShapeId: shapes.length,
  originalShape: undefined,
  pointerStart: undefined,
  selectedShapeId,
  selectedTool,
  shapes,
})

const findByClass = (
  dom: ReturnType<typeof renderDraw>,
  className: string,
): ReturnType<typeof renderDraw>[number] | undefined =>
  dom.find((node) => node.className?.split(' ').includes(className))

test('renders a bottom toolbar with cursor selected by default', () => {
  const dom = renderDraw(createState())
  const root = findByClass(dom, 'DrawView')
  const cursor = dom.find((node) => node.name === 'cursor')
  const line = dom.find((node) => node.name === 'line')

  expect(findByClass(dom, 'DrawToolbar')).toMatchObject({
    'aria-label': 'Drawing tools',
  })
  expect(cursor).toMatchObject({
    'aria-label': 'Select tool',
    'aria-pressed': true,
    onClick: 'handleSelectTool',
  })
  expect(line).toMatchObject({ 'aria-pressed': false })
  expect(findByClass(dom, 'DrawShapePicker')).toBeUndefined()
  expect(findByClass(dom, 'DrawClearButton')).toMatchObject({
    disabled: true,
    onClick: 'handleClear',
  })
  expect(findByClass(dom, 'DrawSaveButton')).toMatchObject({
    'aria-label': 'Save drawing',
    onClick: 'handleSave',
  })
  expect(findByClass(dom, 'DrawBoard')).toMatchObject({
    name: 'board',
    onContextMenu: 'handleDrawContextMenu',
    onPointerDown: 'handleDrawPointerDown',
  })
  expect(root).toMatchObject({ onKeyDown: 'handleDrawKeyDown' })
  expect(
    dom.some((node) => node.text === 'Choose a tool and start creating'),
  ).toBe(true)
})

test('shows shape options above the selected shape tool', () => {
  const dom = renderDraw(createState([], 'rectangle'))
  const shapeButton = dom.find(
    (node) =>
      node.name === 'rectangle' &&
      node.className?.split(' ').includes('DrawToolButton'),
  )
  const options = dom.filter((node) =>
    node.className?.split(' ').includes('DrawShapeOptionButton'),
  )

  expect(findByClass(dom, 'DrawShapePicker')).toMatchObject({
    'aria-label': 'Shape tools',
  })
  expect(shapeButton).toMatchObject({
    'aria-expanded': true,
    'aria-haspopup': true,
    'aria-pressed': true,
  })
  expect(options.map(({ name }) => name)).toEqual([
    'rectangle',
    'circle',
    'triangle',
  ])
  expect(options.find(({ name }) => name === 'rectangle')).toMatchObject({
    'aria-pressed': true,
    onClick: 'handleSelectTool',
  })
})

test('renders bounded shapes with renderer-compatible dataset properties', () => {
  const shapes: readonly Shape[] = [
    {
      end: { x: 8, y: 9 },
      id: 4,
      start: { x: 4, y: 5 },
      type: 'line',
    },
    {
      end: { x: 2, y: 3 },
      id: 5,
      start: { x: 12, y: 13 },
      type: 'rectangle',
    },
    {
      end: { x: 30, y: 40 },
      id: 6,
      start: { x: 10, y: 20 },
      type: 'circle',
    },
    {
      end: { x: 50, y: 60 },
      id: 7,
      start: { x: 20, y: 30 },
      type: 'triangle',
    },
  ]
  const dom = renderDraw(createState(shapes, 'triangle', 7))

  expect(findByClass(dom, 'DrawLine')).toMatchObject({
    childCount: 1,
    'data-shapeId': '4',
  })
  expect(findByClass(dom, 'DrawLineStroke')).toMatchObject({
    childCount: 0,
  })
  expect(findByClass(dom, 'DrawTriangle')?.className).toContain(
    'DrawShapeSelected',
  )
  expect(findByClass(dom, 'DrawCircle')).toBeDefined()
  expect(
    dom.find(
      (node) =>
        node.name === 'triangle' &&
        node.className?.split(' ').includes('DrawToolButton'),
    ),
  ).toMatchObject({
    'aria-pressed': true,
  })
  expect(findByClass(dom, 'DrawClearButton')).toMatchObject({ disabled: false })
  expect(getDrawCss(shapes)).toBe(
    '.DrawShape4{left:4px;top:5px;width:5.656854249492381px;transform:translateY(-50%) rotate(0.7853981633974483rad)}.DrawShape5{left:2px;top:3px;width:10px;height:10px}.DrawShape6{left:10px;top:20px;width:20px;height:20px}.DrawShape7{left:20px;top:30px;width:30px;height:30px}',
  )
})

test('renders selected text as an editor and committed text as a shape', () => {
  const shape: Shape = {
    id: 2,
    point: { x: 20, y: 30 },
    text: 'A note',
    type: 'text',
  }
  const editing = renderDraw(createState([shape], 'text', 2))
  const committed = renderDraw(createState([shape], 'cursor', 2))
  const emptyText = renderDraw(
    createState([{ ...shape, text: '' }], 'cursor', 2),
  )

  expect(findByClass(editing, 'DrawText')).toMatchObject({
    name: 'text',
    onInput: 'handleTextInput',
    placeholder: 'Type text…',
    value: 'A note',
  })
  expect(findByClass(editing, 'DrawText')).not.toHaveProperty('autofocus')
  expect(committed.some((node) => node.text === 'A note')).toBe(true)
  expect(emptyText.some((node) => node.text === '')).toBe(false)
  expect(getDrawCss([shape])).toBe('.DrawShape2{left:20px;top:30px}')
})
