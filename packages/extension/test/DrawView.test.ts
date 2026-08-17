import { expect, test } from '@jest/globals'
import { view } from '../src/parts/DrawView/DrawView.ts'

test('registers the whiteboard view and pointer tracking', () => {
  expect(view).toMatchObject({
    displayName: 'Draw',
    id: 'draw.views.whiteboard',
    preferredLocation: 'preview',
    title: 'Draw',
  })
  expect(
    view.eventListeners?.find(
      (listener) => listener.name === 'handleDrawPointerDown',
    ),
  ).toMatchObject({
    name: 'handleDrawPointerDown',
    preventDefault: true,
    trackPointerEvents: ['handleDrawPointerMove', 'handleDrawPointerUp'],
  })
  expect(
    view.eventListeners?.find(
      (listener) => listener.name === 'handleDrawContextMenu',
    ),
  ).toEqual({
    name: 'handleDrawContextMenu',
    params: [
      'handleDrawContextMenu',
      'event.clientX',
      'event.clientY',
      'event.currentTarget.clientWidth',
      'event.currentTarget.clientHeight',
    ],
    preventDefault: true,
  })
  expect(view.eventListeners?.slice(-2)).toEqual([
    {
      name: 'handleSelectTool',
      params: ['handleSelectTool', 'event.currentTarget.name'],
    },
    {
      name: 'handleTextInput',
      params: [
        'handleTextInput',
        'event.currentTarget.dataset.shapeId',
        'event.target.value',
      ],
    },
  ])
})
