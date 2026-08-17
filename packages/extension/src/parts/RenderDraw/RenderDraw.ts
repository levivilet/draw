import {
  AriaRoles,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { Stroke } from '../DrawState/DrawState.ts'
import { renderEmptyMessage } from '../RenderEmptyMessage/RenderEmptyMessage.ts'
import { renderStroke } from '../RenderStroke/RenderStroke.ts'
import { renderText } from '../RenderText/RenderText.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const handleClear = 'handleClear'
const handleContextMenu = 'handleContextMenu'
const handleDrawPointerDown = 'handleDrawPointerDown'

const drawViewNode: VirtualDomNode = {
  childCount: 2,
  className: 'DrawView',
  type: VirtualDomElements.Div,
}

const drawToolbarNode: VirtualDomNode = {
  childCount: 2,
  className: 'DrawToolbar',
  role: AriaRoles.ToolBar,
  type: VirtualDomElements.Div,
}

const drawHintNode: VirtualDomNode = {
  childCount: 1,
  className: 'DrawHint',
  type: VirtualDomElements.P,
}

export const renderDraw = (
  strokes: readonly Readonly<Stroke>[],
): readonly VirtualDomNode[] => {
  const empty = strokes.length === 0
  let strokeIndex = 0
  const strokeNodes = strokes.flatMap((stroke) => {
    const nodes = renderStroke(stroke, strokeIndex)
    strokeIndex += nodes.length
    return nodes
  })
  return [
    drawViewNode,
    drawToolbarNode,
    drawHintNode,
    renderText('Draw with your mouse or pointer'),
    {
      'aria-label': 'Clear drawing',
      childCount: 1,
      className: 'DrawClearButton',
      disabled: empty,
      onClick: handleClear,
      title: 'Clear drawing',
      type: VirtualDomElements.Button,
    },
    renderText('Clear'),
    {
      'aria-label': 'Whiteboard drawing area',
      childCount: empty ? 2 : 1,
      className: 'DrawBoard',
      name: 'board',
      onContextMenu: handleContextMenu,
      onPointerDown: handleDrawPointerDown,
      role: AriaRoles.Group,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      'aria-hidden': true,
      childCount: strokeNodes.length,
      className: 'DrawCanvas',
      type: VirtualDomElements.Div,
    },
    ...strokeNodes,
    ...renderEmptyMessage(empty),
  ]
}
