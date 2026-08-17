import type { View } from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import {
  createInstance,
  type DrawViewInstance,
} from '../DrawViewInstance/DrawViewInstance.ts'

const offsetParameters = [
  'event.currentTarget.offsetLeft',
  'event.currentTarget.offsetTop',
  'event.currentTarget.offsetParent.offsetLeft',
  'event.currentTarget.offsetParent.offsetTop',
  'event.currentTarget.offsetParent.offsetParent.offsetLeft',
  'event.currentTarget.offsetParent.offsetParent.offsetTop',
  'event.currentTarget.offsetParent.offsetParent.offsetParent.offsetLeft',
  'event.currentTarget.offsetParent.offsetParent.offsetParent.offsetTop',
  'event.currentTarget.offsetParent.offsetParent.offsetParent.offsetParent.offsetLeft',
  'event.currentTarget.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop',
  'event.currentTarget.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.offsetLeft',
  'event.currentTarget.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop',
] as const

export const view: View<DrawViewInstance> = {
  create: createInstance,
  displayName: 'Draw',
  eventListeners: [
    {
      name: 'handleClear',
      params: ['handleClear'],
    },
    {
      name: 'handleDrawPointerDown',
      params: [
        'handleDrawPointerDown',
        'event.button',
        'event.clientX',
        'event.clientY',
        ...offsetParameters,
      ],
      preventDefault: true,
      trackPointerEvents: ['handleDrawPointerMove', 'handleDrawPointerUp'],
    },
    {
      name: 'handleDrawPointerMove',
      params: [
        'handleDrawPointerMove',
        'event.clientX',
        'event.clientY',
        ...offsetParameters,
      ],
      preventDefault: true,
    },
    {
      name: 'handleDrawPointerUp',
      params: [
        'handleDrawPointerUp',
        'event.clientX',
        'event.clientY',
        ...offsetParameters,
      ],
      preventDefault: true,
    },
  ],
  icon: 'edit',
  id: viewId,
  kind: 'virtualDom',
  preferredLocation: 'preview',
  title: 'Draw',
}
