import {
  AriaRoles,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { Point, Stroke } from '../DrawState/DrawState.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const handleClear = 'handleClear'
const handleDrawPointerDown = 'handleDrawPointerDown'

const renderText = (text: string): VirtualDomNode => {
  return {
    childCount: 0,
    text,
    type: VirtualDomElements.Text,
  }
}

const toPathData = (points: readonly Point[]): string => {
  const [first, ...rest] = points
  if (!first) {
    return ''
  }
  const linePoints = rest.length === 0 ? [first] : rest
  return `M ${first.x} ${first.y} ${linePoints
    .map((point) => `L ${point.x} ${point.y}`)
    .join(' ')}`
}

const renderStroke = (stroke: Readonly<Stroke>): VirtualDomNode => {
  return {
    childCount: 0,
    className: 'DrawStroke',
    d: toPathData(stroke.points),
    type: VirtualDomElements.Path,
  }
}

const renderEmptyMessage = (empty: boolean): readonly VirtualDomNode[] => {
  if (!empty) {
    return []
  }
  return [
    {
      childCount: 1,
      className: 'DrawEmptyMessage',
      type: VirtualDomElements.P,
    },
    renderText('Start drawing anywhere'),
  ]
}

export const renderDraw = (
  strokes: readonly Readonly<Stroke>[],
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: 'DrawBoard',
      type: VirtualDomElements.Div,
    },
  ]
  const empty = strokes.length === 0
  return [
    {
      childCount: 2,
      className: 'DrawView',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'DrawToolbar',
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'DrawHint',
      type: VirtualDomElements.P,
    },
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
      onPointerDown: handleDrawPointerDown,
      role: AriaRoles.Group,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      'aria-hidden': true,
      childCount: strokes.length,
      className: 'DrawCanvas',
      type: VirtualDomElements.Svg,
    },
    ...strokes.map(renderStroke),
    ...renderEmptyMessage(empty),
  ]
}

export { toPathData }
