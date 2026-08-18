import { AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tool } from '../DrawState/DrawState.ts'
import { renderToolButton } from '../RenderToolButton/RenderToolButton.ts'
import { textNode } from '../TextNode/TextNode.ts'
import { tree, type TreeNode } from '../Tree/Tree.ts'

const handleClear = 'handleClear'

const toolDetails: readonly {
  readonly icon: string
  readonly label: string
  readonly tool: Tool
}[] = [
  { icon: '↖', label: 'Select', tool: 'cursor' },
  { icon: '╱', label: 'Line', tool: 'line' },
  { icon: '□', label: 'Rectangle', tool: 'rectangle' },
  { icon: 'T', label: 'Text', tool: 'text' },
]

export const renderToolbar = (selectedTool: Tool, empty: boolean): TreeNode => {
  const toolbar = tree(
    VirtualDomElements.Div,
    {
      'aria-label': 'Drawing tools',
      className: 'DrawToolbar',
      role: AriaRoles.ToolBar,
    },
    toolDetails.map(({ icon, label, tool }) =>
      renderToolButton(selectedTool, tool, label, icon),
    ),
  )
  const clearButton = tree(
    VirtualDomElements.Button,
    {
      'aria-label': 'Clear drawing',
      className: 'DrawClearButton',
      disabled: empty,
      onClick: handleClear,
      title: 'Clear drawing',
    },
    [textNode('⌫')],
  )
  return tree(VirtualDomElements.Div, { className: 'DrawControls' }, [
    toolbar,
    clearButton,
  ])
}
