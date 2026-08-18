import { AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tool } from '../DrawState/DrawState.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'
import { renderToolButton } from '../RenderToolButton/RenderToolButton.ts'
import { textNode } from '../TextNode/TextNode.ts'
import { tree, type TreeNode } from '../Tree/Tree.ts'

const handleClear = 'handleClear'
const handleSave = 'handleSave'

const toolDetails: readonly {
  readonly ariaLabel: string
  readonly icon: string
  readonly label: string
  readonly tool: Tool
}[] = [
  {
    ariaLabel: DrawStrings.selectTool(),
    icon: '↖',
    label: DrawStrings.select(),
    tool: 'cursor',
  },
  {
    ariaLabel: DrawStrings.lineTool(),
    icon: '╱',
    label: DrawStrings.line(),
    tool: 'line',
  },
  {
    ariaLabel: DrawStrings.rectangleTool(),
    icon: '□',
    label: DrawStrings.rectangle(),
    tool: 'rectangle',
  },
  {
    ariaLabel: DrawStrings.textTool(),
    icon: 'T',
    label: DrawStrings.text(),
    tool: 'text',
  },
]

export const renderToolbar = (selectedTool: Tool, empty: boolean): TreeNode => {
  const toolbar = tree(
    VirtualDomElements.Div,
    {
      'aria-label': DrawStrings.drawingTools(),
      className: 'DrawToolbar',
      role: AriaRoles.ToolBar,
    },
    toolDetails.map(({ ariaLabel, icon, label, tool }) =>
      renderToolButton(selectedTool, tool, ariaLabel, label, icon),
    ),
  )
  const clearButton = tree(
    VirtualDomElements.Button,
    {
      'aria-label': DrawStrings.clearDrawing(),
      className: 'DrawClearButton',
      disabled: empty,
      onClick: handleClear,
      title: DrawStrings.clearDrawing(),
    },
    [textNode('⌫')],
  )
  const saveButton = tree(
    VirtualDomElements.Button,
    {
      'aria-label': DrawStrings.saveDrawing(),
      className: 'DrawSaveButton',
      onClick: handleSave,
      title: DrawStrings.saveDrawing(),
    },
    [textNode('⇩')],
  )
  return tree(VirtualDomElements.Div, { className: 'DrawControls' }, [
    toolbar,
    saveButton,
    clearButton,
  ])
}
