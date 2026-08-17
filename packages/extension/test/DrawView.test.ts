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
})
