import type { ViewContext } from '@lvce-editor/api'
import { expect, jest, test } from '@jest/globals'
import type { DownloadFormat } from '../src/parts/DownloadDrawing/DownloadDrawing.ts'
import type { ExportDrawingOptions } from '../src/parts/DrawExportWorker/DrawExportWorker.ts'
import type { Shape } from '../src/parts/DrawState/DrawState.ts'
import {
  clearActiveDrawViewInstance,
  createInstance,
  createInstanceWithApi,
  duplicateSelectedShapeInActiveDrawViewInstance,
  duplicateShape,
  moveShape,
  replaceShape,
  resizeShape,
} from '../src/parts/DrawViewInstance/DrawViewInstance.ts'

const createContext = (): {
  readonly context: ViewContext
  readonly requestRerender: ReturnType<typeof jest.fn<() => Promise<void>>>
} => {
  const requestRerender = jest.fn<() => Promise<void>>(async () => {})
  const context: ViewContext = {
    requestRerender,
    showContextMenu: async () => {},
    uid: 1,
    viewId: 'draw.views.whiteboard',
  }
  return { context, requestRerender }
}

const getShape = (
  instance: ReturnType<typeof createInstance>,
  className: string,
): ReturnType<typeof instance.render>[number] | undefined => {
  return instance
    .render()
    .find((node) => node.className?.split(' ').includes(className))
}

test('creates lines and bounded shapes with primary pointer drags', () => {
  const { context } = createContext()
  const instance = createInstance(context)

  instance.handleSelectTool('line')
  instance.handleDrawPointerDown(0, 110, 80, undefined, 10, 20)
  instance.handleDrawPointerMove(120, 90, 10, 20)
  instance.handleDrawPointerUp(130, 100, 10, 20)

  expect(getShape(instance, 'DrawLine')).toBeDefined()
  expect(instance.getCss()).toContain(
    '.DrawShape0{left:100px;top:60px;width:28.284271247461902px;',
  )

  instance.handleSelectTool('rectangle')
  instance.handleDrawPointerDown(0, 100, 100, undefined)
  instance.handleDrawPointerUp(60, 70)

  expect(getShape(instance, 'DrawRectangle')).toBeDefined()
  expect(instance.getCss()).toContain(
    '.DrawShape1{left:60px;top:70px;width:40px;height:30px}',
  )

  instance.handleSelectTool('circle')
  instance.handleDrawPointerDown(0, 20, 30, undefined)
  instance.handleDrawPointerUp(70, 90)
  expect(getShape(instance, 'DrawCircle')).toBeDefined()

  instance.handleSelectTool('triangle')
  instance.handleDrawPointerDown(0, 80, 90, undefined)
  instance.handleDrawPointerUp(30, 40)
  expect(getShape(instance, 'DrawTriangle')).toBeDefined()
  instance.dispose?.()
})

test('places and edits text', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)
  const oldContext = instance.getContext()

  instance.handleSelectTool('text')
  instance.handleDrawPointerDown(0, 40, 50, undefined)
  instance.handleTextInput('0', 'Hello whiteboard')

  expect(getShape(instance, 'DrawText')).toMatchObject({
    value: 'Hello whiteboard',
  })
  const newContext = instance.getContext()
  expect(newContext).toEqual({ 'draw.textInputFocus': true })
  expect(instance.renderFocus(oldContext, newContext)).toBe('.DrawText')
  expect(instance.renderFocus(newContext, newContext)).toBe('')
  expect(instance.getCss()).toBe('.DrawShape0{left:40px;top:50px}')

  instance.handleDrawPointerDown(0, 40, 50, '0')
  instance.handleTextInput('', 'ignored')
  instance.handleTextInput('0', 42)
  instance.handleTextInput('9', 'ignored')
  expect(requestRerender).toHaveBeenCalledTimes(4)

  instance.handleSelectTool('cursor')
  expect(instance.getContext()).toEqual({ 'draw.selectedShape': true })
  expect(
    instance.render().some((node) => node.text === 'Hello whiteboard'),
  ).toBe(true)
  instance.dispose?.()
})

test('cursor selects, moves, and deselects shapes', () => {
  const instance = createInstance(createContext().context)
  instance.handleSelectTool('rectangle')
  instance.handleDrawPointerDown(0, 20, 30, undefined)
  instance.handleDrawPointerUp(80, 90)
  instance.handleSelectTool('cursor')

  instance.handleDrawPointerDown(0, 40, 50, '0')
  expect(getShape(instance, 'DrawShapeSelected')).toBeDefined()
  instance.handleDrawPointerMove(50, 70)
  instance.handleDrawPointerUp(60, 80)
  expect(instance.getCss()).toBe(
    '.DrawShape0{left:40px;top:60px;width:60px;height:60px}',
  )

  instance.handleDrawPointerDown(0, 5, 5, undefined)
  expect(getShape(instance, 'DrawShapeSelected')).toBeUndefined()
  instance.dispose?.()
})

test('cursor selection does not move a shape when pointer-up offsets include the shape', () => {
  const instance = createInstance(createContext().context)
  instance.handleSelectTool('rectangle')
  instance.handleDrawPointerDown(0, 120, 130, undefined, 100, 100)
  instance.handleDrawPointerUp(180, 190, 100, 100)
  instance.handleSelectTool('cursor')

  instance.handleDrawPointerDown(0, 140, 150, '0', 100, 100)
  instance.handleDrawPointerUp(140, 150, 20, 30, 100, 100)

  expect(instance.getCss()).toBe(
    '.DrawShape0{left:20px;top:30px;width:60px;height:60px}',
  )
  instance.dispose?.()
})

test('duplicates the selected shape and selects the duplicate', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)
  instance.handleSelectTool('rectangle')
  instance.handleDrawPointerDown(0, 20, 30, undefined)
  instance.handleDrawPointerUp(80, 90)
  instance.handleSelectTool('cursor')
  instance.handleDrawPointerDown(0, 40, 50, '0')

  duplicateSelectedShapeInActiveDrawViewInstance()

  expect(getShape(instance, 'DrawShape1')).toMatchObject({
    className: expect.stringContaining('DrawShapeSelected'),
  })
  expect(instance.getCss()).toBe(
    '.DrawShape0{left:20px;top:30px;width:60px;height:60px}.DrawShape1{left:36px;top:46px;width:60px;height:60px}',
  )
  expect(instance.getContext()).toEqual({ 'draw.selectedShape': true })
  expect(requestRerender).toHaveBeenCalledTimes(6)
  instance.dispose?.()
})

test('duplicate command targets the most recently active draw view', () => {
  const first = createInstance(createContext().context)
  const second = createInstance(createContext().context)
  for (const instance of [first, second]) {
    instance.handleSelectTool('line')
    instance.handleDrawPointerDown(0, 1, 2, undefined)
    instance.handleDrawPointerUp(3, 4)
    instance.handleSelectTool('cursor')
  }
  first.handleDrawPointerDown(0, 2, 3, '0')

  duplicateSelectedShapeInActiveDrawViewInstance()

  expect(getShape(first, 'DrawShape1')).toBeDefined()
  expect(getShape(second, 'DrawShape1')).toBeUndefined()
  first.dispose?.()
  second.dispose?.()
})

test('duplicate is ignored outside the cursor tool or without a selection', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)
  instance.duplicateSelectedShape()
  instance.handleSelectTool('text')
  instance.handleDrawPointerDown(0, 10, 20, undefined)

  instance.handleDuplicate()

  expect(instance.getCss()).toBe('.DrawShape0{left:10px;top:20px}')
  expect(requestRerender).toHaveBeenCalledTimes(2)
  instance.dispose?.()
})

test('delete removes the selected shape', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)
  instance.handleSelectTool('rectangle')
  instance.handleDrawPointerDown(0, 20, 30, undefined)
  instance.handleDrawPointerUp(80, 90)
  instance.handleDrawPointerDown(0, 100, 110, undefined)
  instance.handleDrawPointerUp(160, 170)
  instance.handleSelectTool('cursor')
  instance.handleDrawPointerDown(0, 120, 130, '1')

  instance.handleDrawKeyDown(false, 'Delete', 'DIV')

  expect(getShape(instance, 'DrawShape1')).toBeUndefined()
  expect(getShape(instance, 'DrawShape0')).toBeDefined()
  expect(getShape(instance, 'DrawShapeSelected')).toBeUndefined()
  expect(instance.getCss()).not.toContain('.DrawShape1')
  expect(requestRerender).toHaveBeenCalledTimes(8)
  instance.dispose?.()
})

test('delete is ignored when handled, editing text, or no shape is selected', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)
  instance.handleSelectTool('text')
  instance.handleDrawPointerDown(0, 40, 50, undefined)

  instance.handleDrawKeyDown(false, 'Delete', 'INPUT')
  instance.handleDrawKeyDown(false, 'Backspace', 'DIV')
  instance.handleDrawKeyDown(true, 'Delete', 'DIV')

  expect(getShape(instance, 'DrawText')).toBeDefined()
  expect(requestRerender).toHaveBeenCalledTimes(2)

  instance.handleSelectTool('cursor')
  instance.handleDrawPointerDown(0, 5, 5, undefined)
  instance.handleDrawKeyDown(false, 'Delete', 'DIV')
  expect(getShape(instance, 'DrawText')).toBeDefined()
  expect(requestRerender).toHaveBeenCalledTimes(4)
  instance.dispose?.()
})

test('ignores invalid tools, non-primary, and inactive pointer events', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)

  instance.handleSelectTool('cursor')
  instance.handleSelectTool('unknown')
  instance.handleDrawPointerDown(1, 10, 10, undefined)
  instance.handleDrawPointerMove(20, 20)
  instance.handleDrawPointerUp(20, 20)
  instance.handleEvent?.({ name: 'somethingElse', type: 'click' })
  instance.handleEvent?.({ name: 'clear', type: 'input' })

  expect(requestRerender).not.toHaveBeenCalled()
  instance.dispose?.()
})

test('clear command clears all active instances', () => {
  const first = createInstance(createContext().context)
  const second = createInstance(createContext().context)
  first.handleSelectTool('line')
  second.handleSelectTool('rectangle')
  first.handleDrawPointerDown(0, 1, 1, undefined)
  second.handleDrawPointerDown(0, 2, 2, undefined)

  clearActiveDrawViewInstance()

  expect(getShape(first, 'DrawShape')).toBeUndefined()
  expect(getShape(second, 'DrawShape')).toBeUndefined()
  first.handleEvent?.({ name: 'clear', type: 'click' })
  first.handleClear()
  first.dispose?.()
  second.dispose?.()
})

test('shape helpers cover each shape kind', () => {
  const line: Shape = {
    end: { x: 3, y: 4 },
    id: 0,
    start: { x: 1, y: 2 },
    type: 'line',
  }
  const rectangle: Shape = {
    end: { x: 4, y: 5 },
    id: 1,
    start: { x: 2, y: 3 },
    type: 'rectangle',
  }
  const circle: Shape = {
    end: { x: 6, y: 7 },
    id: 3,
    start: { x: 4, y: 5 },
    type: 'circle',
  }
  const triangle: Shape = {
    end: { x: 8, y: 9 },
    id: 4,
    start: { x: 6, y: 7 },
    type: 'triangle',
  }
  const label: Shape = {
    id: 2,
    point: { x: 5, y: 6 },
    text: 'Hello',
    type: 'text',
  }

  expect(moveShape(line, 2, 3)).toMatchObject({
    end: { x: 5, y: 7 },
    start: { x: 3, y: 5 },
  })
  expect(moveShape(rectangle, 2, 3)).toMatchObject({
    end: { x: 6, y: 8 },
    start: { x: 4, y: 6 },
  })
  expect(moveShape(circle, 2, 3)).toMatchObject({
    end: { x: 8, y: 10 },
    start: { x: 6, y: 8 },
  })
  expect(moveShape(triangle, 2, 3)).toMatchObject({
    end: { x: 10, y: 12 },
    start: { x: 8, y: 10 },
  })
  expect(moveShape(label, 2, 3)).toMatchObject({ point: { x: 7, y: 9 } })
  expect(duplicateShape(line, 5)).toEqual({
    end: { x: 19, y: 20 },
    id: 5,
    start: { x: 17, y: 18 },
    type: 'line',
  })
  expect(duplicateShape(label, 6)).toEqual({
    id: 6,
    point: { x: 21, y: 22 },
    text: 'Hello',
    type: 'text',
  })
  expect(resizeShape(line, { x: 9, y: 10 })).toMatchObject({
    end: { x: 9, y: 10 },
  })
  expect(resizeShape(label, { x: 9, y: 10 })).toBe(label)
  expect(replaceShape([line, rectangle], label)).toEqual([line, rectangle])
})

test('shows a context menu for the drawing board', async () => {
  const { context } = createContext()
  const showContextMenu = jest.fn<
    (menuId: string, x: number, y: number) => Promise<void>
  >(async () => {})
  const instance = createInstance({
    ...context,
    showContextMenu,
  })

  await instance.handleDrawContextMenu(10, 20, 640, 480)

  expect(showContextMenu).toHaveBeenCalledWith('draw.contextMenu', 10, 20)
  expect(instance.getMenuEntries('draw.contextMenu')).toEqual([
    {
      args: [1, 'handleViewCommand', 'handleDuplicate'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'duplicate',
      label: 'Duplicate',
    },
    {
      args: [1, 'handleViewCommand', 'handleNoop'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'paste',
      label: 'Paste',
    },
    {
      args: [1, 'handleViewCommand', 'handleNoop'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'undo',
      label: 'Undo',
    },
    {
      args: [1, 'handleViewCommand', 'handleNoop'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'redo',
      label: 'Redo',
    },
    {
      args: [1, 'handleViewCommand', 'handleSave'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'saveDrawing',
      label: 'Save As…',
    },
    {
      command: '',
      flags: 4,
      id: 'draw.exportMenu',
      label: 'Export As…',
    },
  ])
  expect(instance.getMenuEntries('draw.exportMenu')).toEqual([
    {
      args: [1, 'handleViewCommand', 'handleExport', 'svg'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'exportSvg',
      label: 'SVG',
    },
    {
      args: [1, 'handleViewCommand', 'handleExport', 'jpg'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'exportJpg',
      label: 'JPG',
    },
  ])
  expect(instance.getMenuEntries('unknown')).toEqual([])
  expect(instance.handleNoop()).toBeUndefined()
  instance.dispose?.()
})

test('uses safe context-menu coordinates and export dimensions', async () => {
  const { context } = createContext()
  const showContextMenu = jest.fn<
    (menuId: string, x: number, y: number) => Promise<void>
  >(async () => {})
  const blob = new Blob(['svg'], { type: 'image/svg+xml' })
  const exportDrawing = jest.fn<
    (options: Readonly<ExportDrawingOptions>) => Promise<Blob>
  >(async () => blob)
  const downloadDrawing = jest.fn<
    (value: Blob, format: DownloadFormat) => Promise<void>
  >(async () => {})
  const instance = createInstanceWithApi(
    {
      ...context,
      showContextMenu,
    },
    { downloadDrawing, exportDrawing },
  )

  instance.handleSelectTool('line')
  instance.handleDrawPointerDown(0, 2, 3, undefined)
  instance.handleDrawPointerUp(10, 20)
  await instance.handleDrawContextMenu(undefined, NaN, 320.4, 199.6)
  await instance.handleExport('svg')

  expect(showContextMenu).toHaveBeenCalledWith('draw.contextMenu', 0, 0)
  expect(exportDrawing).toHaveBeenCalledWith({
    format: 'svg',
    height: 200,
    shapes: [
      {
        end: { x: 10, y: 20 },
        id: 0,
        start: { x: 2, y: 3 },
        type: 'line',
      },
    ],
    width: 320,
  })
  expect(downloadDrawing).toHaveBeenCalledWith(blob, 'svg')
  await expect(instance.handleExport('png')).rejects.toThrow(
    'Unsupported drawing export format: png',
  )
  instance.dispose?.()
})

test('saves the current shapes as a json draw file', async () => {
  const downloadDrawing = jest.fn<
    (value: Blob, format: DownloadFormat) => Promise<void>
  >(async () => {})
  const exportDrawing = jest.fn<
    (options: Readonly<ExportDrawingOptions>) => Promise<Blob>
  >(async () => new Blob())
  const instance = createInstanceWithApi(createContext().context, {
    downloadDrawing,
    exportDrawing,
  })

  instance.handleSelectTool('text')
  instance.handleDrawPointerDown(0, 40, 50, undefined)
  instance.handleTextInput('0', 'Saved text')
  await instance.handleSave()

  expect(downloadDrawing).toHaveBeenCalledTimes(1)
  const [blob, format] = downloadDrawing.mock.calls[0]
  expect(format).toBe('draw')
  expect(blob.type).toBe('application/json')
  await expect(blob.text()).resolves.toContain('"text": "Saved text"')
  expect(exportDrawing).not.toHaveBeenCalled()
  instance.dispose?.()
})
