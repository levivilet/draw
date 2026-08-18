import type { DrawState } from '../DrawState/DrawState.ts'
import * as ContextKey from '../ContextKey/ContextKey.ts'

export const getContext = (
  state: Readonly<DrawState>,
): Readonly<Record<string, boolean>> => {
  const { selectedShapeId, selectedTool, shapes } = state
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId)
  if (selectedTool !== 'text' || selectedShape?.type !== 'text') {
    return {}
  }
  return {
    [ContextKey.TextInputFocus]: true,
  }
}
