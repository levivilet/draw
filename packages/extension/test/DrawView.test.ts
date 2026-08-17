import { expect, test } from '@jest/globals'
import { view } from '../src/parts/DrawView/DrawView.ts'

test('registers the whiteboard view and pointer tracking', () => {
  expect(view).toMatchObject({
    displayName: 'Draw',
    id: 'draw.views.whiteboard',
    preferredLocation: 'preview',
    title: 'Draw',
  })
  expect(view.eventListeners?.[1]).toMatchObject({
    name: 'handleDrawPointerDown',
    preventDefault: true,
    trackPointerEvents: ['handleDrawPointerMove', 'handleDrawPointerUp'],
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
