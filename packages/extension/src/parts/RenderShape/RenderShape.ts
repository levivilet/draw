import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Shape, Tool } from '../DrawState/DrawState.ts'
import { getShapeClassName } from '../GetShapeClassName/GetShapeClassName.ts'
import { textNode } from '../TextNode/TextNode.ts'
import { tree, type TreeNode } from '../Tree/Tree.ts'

const handleTextInput = 'handleTextInput'

export const renderShape = (
  shape: Readonly<Shape>,
  selectedShapeId: number | undefined,
  selectedTool: Tool,
): TreeNode => {
  const properties = {
    className: getShapeClassName(shape, selectedShapeId),
    'data-shapeId': String(shape.id),
  }
  if (shape.type !== 'text') {
    return tree(VirtualDomElements.Div, properties)
  }
  if (selectedShapeId === shape.id && selectedTool === 'text') {
    return tree(VirtualDomElements.Input, {
      ...properties,
      'aria-label': 'Text',
      autofocus: true,
      onInput: handleTextInput,
      placeholder: 'Type text…',
      value: shape.text,
    })
  }
  return tree(
    VirtualDomElements.Div,
    properties,
    shape.text ? [textNode(shape.text)] : [],
  )
}
