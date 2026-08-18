import type { View } from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'
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
  displayName: DrawStrings.draw(),
  eventListeners: [
    {
      name: 'handleClear',
      params: ['handleClear'],
    },
    {
      name: 'handleDrawContextMenu',
      params: [
        'handleDrawContextMenu',
        'event.clientX',
        'event.clientY',
        'event.currentTarget.clientWidth',
        'event.currentTarget.clientHeight',
      ],
      preventDefault: true,
    },
    {
      name: 'handleDrawKeyDown',
      params: [
        'handleDrawKeyDown',
        'event.defaultPrevented',
        'event.key',
        'event.target.tagName',
      ],
    },
    {
      name: 'handleDrawPointerDown',
      params: [
        'handleDrawPointerDown',
        'event.button',
        'event.clientX',
        'event.clientY',
        'event.target.dataset.shapeId',
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
        'event.ctrlKey',
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
        'event.ctrlKey',
        ...offsetParameters,
      ],
      preventDefault: true,
    },
    {
      name: 'handleSave',
      params: ['handleSave'],
    },
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
  ],
  icon: 'edit',
  id: viewId,
  kind: 'virtualDom',
  preferredLocation: 'preview',
  title: DrawStrings.draw(),
}
