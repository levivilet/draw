import {
  AriaRoles,
  mergeClassNames,
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

const getStrokeClassName = (index: number): string => {
  return `DrawStroke${index}`
}

const renderPoint = (index: number): VirtualDomNode => {
  return {
    childCount: 0,
    className: mergeClassNames(
      'DrawStroke',
      'DrawStrokePoint',
      getStrokeClassName(index),
    ),
    type: VirtualDomElements.Div,
  }
}

const renderSegment = (index: number): VirtualDomNode => {
  return {
    childCount: 0,
    className: mergeClassNames('DrawStroke', getStrokeClassName(index)),
    type: VirtualDomElements.Div,
  }
}

const renderStroke = (
  stroke: Readonly<Stroke>,
  startIndex = 0,
): readonly VirtualDomNode[] => {
  const { points } = stroke
  if (points.length === 0) {
    return []
  }
  if (points.length === 1) {
    return [renderPoint(startIndex)]
  }
  const segments: VirtualDomNode[] = []
  for (let index = 1; index < points.length; index++) {
    segments.push(renderSegment(startIndex + index - 1))
  }
  return segments
}

const getPointCss = (point: Readonly<Point>, index: number): string => {
  return `.${getStrokeClassName(index)}{left:${point.x}px;top:${point.y}px}`
}

const getSegmentCss = (
  start: Readonly<Point>,
  end: Readonly<Point>,
  index: number,
): string => {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const length = Math.hypot(deltaX, deltaY)
  const angle = Math.atan2(deltaY, deltaX)
  return `.${getStrokeClassName(index)}{left:${start.x}px;top:${start.y}px;width:${length}px;transform:translateY(-50%) rotate(${angle}rad)}`
}

export const getDrawCss = (strokes: readonly Readonly<Stroke>[]): string => {
  const rules: string[] = []
  let index = 0
  for (const { points } of strokes) {
    if (points.length === 1) {
      rules.push(getPointCss(points[0], index))
      index++
      continue
    }
    for (let pointIndex = 1; pointIndex < points.length; pointIndex++) {
      rules.push(
        getSegmentCss(points[pointIndex - 1], points[pointIndex], index),
      )
      index++
    }
  }
  return rules.join('')
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
  const empty = strokes.length === 0
  let strokeIndex = 0
  const strokeNodes = strokes.flatMap((stroke) => {
    const nodes = renderStroke(stroke, strokeIndex)
    strokeIndex += nodes.length
    return nodes
  })
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
      childCount: strokeNodes.length,
      className: 'DrawCanvas',
      type: VirtualDomElements.Div,
    },
    ...strokeNodes,
    ...renderEmptyMessage(empty),
  ]
}

export { renderStroke }
