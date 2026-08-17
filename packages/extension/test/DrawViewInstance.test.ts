import type { ViewContext } from '@lvce-editor/api'
import { expect, jest, test } from '@jest/globals'
import {
  appendPoint,
  clearActiveDrawViewInstance,
  createInstance,
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

test('draws a stroke with the primary pointer and clears it', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)

  instance.handleDrawPointerDown(0, 110, 80, 10, 20)
  instance.handleDrawPointerMove(120, 90, 10, 20)
  instance.handleDrawPointerMove(120, 90, 10, 20)
  instance.handleDrawPointerUp(130, 100, 10, 20)

  const segments = instance
    .render()
    .filter((node) => node.className?.startsWith('DrawStroke'))
  expect(segments).toHaveLength(2)
  expect(instance.getCss()).toContain('.DrawStroke0{left:100px;top:60px;')
  expect(requestRerender).toHaveBeenCalledTimes(4)

  instance.handleClear()
  expect(
    instance.render().some((node) => node.className === 'DrawStroke'),
  ).toBe(false)
  instance.dispose?.()
})

test('ignores non-primary and inactive pointer events', () => {
  const { context, requestRerender } = createContext()
  const instance = createInstance(context)

  instance.handleDrawPointerDown(1, 10, 10)
  instance.handleDrawPointerMove(20, 20)
  instance.handleDrawPointerUp(20, 20)

  expect(requestRerender).not.toHaveBeenCalled()
  instance.handleEvent?.({ name: 'somethingElse', type: 'click' })
  instance.handleEvent?.({ name: 'clear', type: 'input' })
  expect(requestRerender).not.toHaveBeenCalled()
  instance.dispose?.()
})

test('clear command clears all active instances', () => {
  const first = createInstance(createContext().context)
  const second = createInstance(createContext().context)
  first.handleDrawPointerDown(0, 1, 1)
  second.handleDrawPointerDown(0, 2, 2)

  clearActiveDrawViewInstance()

  expect(first.render().some((node) => node.className === 'DrawStroke')).toBe(
    false,
  )
  expect(second.render().some((node) => node.className === 'DrawStroke')).toBe(
    false,
  )
  first.handleEvent?.({ name: 'clear', type: 'click' })
  first.dispose?.()
  second.dispose?.()
})

test('appendPoint handles an absent stroke', () => {
  const strokes: readonly never[] = []
  expect(appendPoint(strokes, { x: 1, y: 2 })).toBe(strokes)
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

  await instance.handleEvent?.({
    name: 'board',
    type: 'contextmenu',
    x: 10,
    y: 20,
  })

  expect(showContextMenu).toHaveBeenCalledWith('draw.contextMenu', 10, 20)
  expect(instance.getMenuEntries('draw.contextMenu')).toEqual([
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
      args: [1, 'handleViewCommand', 'handleNoop'],
      command: 'Viewlet.executeViewletCommand',
      flags: 6,
      id: 'export',
      label: 'Export As…',
    },
  ])
  expect(instance.getMenuEntries('unknown')).toEqual([])
  expect(instance.handleNoop()).toBeUndefined()
  instance.dispose?.()
})

test('uses zero coordinates when context menu coordinates are absent', async () => {
  const { context } = createContext()
  const showContextMenu = jest.fn<
    (menuId: string, x: number, y: number) => Promise<void>
  >(async () => {})
  const instance = createInstance({
    ...context,
    showContextMenu,
  })

  await instance.handleEvent?.({ name: 'board', type: 'contextmenu' })

  expect(showContextMenu).toHaveBeenCalledWith('draw.contextMenu', 0, 0)
  instance.dispose?.()
})
