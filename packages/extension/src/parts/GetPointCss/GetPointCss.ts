import type { Point } from '../DrawState/DrawState.ts'
import { getStrokeClassName } from '../GetStrokeClassName/GetStrokeClassName.ts'

export const getPointCss = (point: Readonly<Point>, index: number): string => {
  return `.${getStrokeClassName(index)}{left:${point.x}px;top:${point.y}px}`
}
