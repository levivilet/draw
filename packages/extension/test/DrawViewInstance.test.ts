import { expect, jest, test } from '@jest/globals'
import type { ViewContext } from '@lvce-editor/api'
import {
  appendPoint,
  clearActiveDrawViewInstance,
  createInstance,
} from '../src/parts/DrawViewInstance/DrawViewInstance.ts'

const createContext = () => {
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

  const path = instance.render().find((node) => node.className === 'DrawStroke')
  expect(path?.d).toBe('M 100 60 L 110 70 L 120 80')
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
