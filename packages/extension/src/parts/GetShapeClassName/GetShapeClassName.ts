import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import type { Shape } from '../DrawState/DrawState.ts'

export const getShapeClassName = (
  shape: Readonly<Shape>,
  selectedShapeId: number | undefined,
): string => {
  return mergeClassNames(
    'DrawShape',
    `Draw${shape.type[0].toUpperCase()}${shape.type.slice(1)}`,
    `DrawShape${shape.id}`,
    selectedShapeId === shape.id ? 'DrawShapeSelected' : '',
  )
}
