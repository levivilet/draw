import {
  AriaRoles,
  mergeClassNames,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawState } from '../DrawState/DrawState.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'
import { renderShape } from '../RenderShape/RenderShape.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'
import { textNode } from '../TextNode/TextNode.ts'
import { tree, type TreeNode } from '../Tree/Tree.ts'

const handleDrawContextMenu = 'handleDrawContextMenu'
const handleDrawPointerDown = 'handleDrawPointerDown'

export const renderBoard = (state: Readonly<DrawState>): TreeNode => {
  const { selectedShapeId, selectedTool, shapes } = state
  const shapeNodes = shapes.map((shape) =>
    renderShape(shape, selectedShapeId, selectedTool),
  )
  const emptyNodes =
    shapes.length === 0
      ? [
          tree(VirtualDomElements.P, { className: 'DrawEmptyMessage' }, [
            textNode(DrawStrings.chooseAToolAndStartCreating()),
          ]),
        ]
      : []
  return tree(
    VirtualDomElements.Div,
    {
      'aria-label': DrawStrings.whiteboardDrawingArea(),
      className: mergeClassNames('DrawBoard', `DrawBoardTool-${selectedTool}`),
      name: 'board',
      onContextMenu: handleDrawContextMenu,
      onPointerDown: handleDrawPointerDown,
      role: AriaRoles.Group,
      tabIndex: TabIndex.Focusable,
    },
    [...shapeNodes, ...emptyNodes],
  )
}
