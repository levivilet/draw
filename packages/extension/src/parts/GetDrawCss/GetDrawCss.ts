import type { Stroke } from '../DrawState/DrawState.ts'
import { getPointCss } from '../GetPointCss/GetPointCss.ts'
import { getSegmentCss } from '../GetSegmentCss/GetSegmentCss.ts'

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
