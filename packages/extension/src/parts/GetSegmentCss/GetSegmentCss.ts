import type { Point } from '../DrawState/DrawState.ts'
import { getStrokeClassName } from '../GetStrokeClassName/GetStrokeClassName.ts'

export const getSegmentCss = (
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
