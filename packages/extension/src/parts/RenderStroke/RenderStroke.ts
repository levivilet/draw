import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Stroke } from '../DrawState/DrawState.ts'
import { renderPoint } from '../RenderPoint/RenderPoint.ts'
import { renderSegment } from '../RenderSegment/RenderSegment.ts'

export const renderStroke = (
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
