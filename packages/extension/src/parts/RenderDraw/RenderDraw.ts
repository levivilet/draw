import {
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawState } from '../DrawState/DrawState.ts'
import { flatten } from '../Flatten/Flatten.ts'
import { renderBoard } from '../RenderBoard/RenderBoard.ts'
import { renderToolbar } from '../RenderToolbar/RenderToolbar.ts'
import { tree } from '../Tree/Tree.ts'

export const renderDraw = (
  state: Readonly<DrawState>,
): readonly VirtualDomNode[] => {
  const { selectedTool, shapes } = state
  const root = tree(VirtualDomElements.Div, { className: 'DrawView' }, [
    renderBoard(state),
    renderToolbar(selectedTool, shapes.length === 0),
  ])
  return flatten(root)
}
