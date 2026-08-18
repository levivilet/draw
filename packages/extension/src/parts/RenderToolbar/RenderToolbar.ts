import { AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tool } from '../DrawState/DrawState.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'
import { renderToolButton } from '../RenderToolButton/RenderToolButton.ts'
import { textNode } from '../TextNode/TextNode.ts'
import { tree, type TreeNode } from '../Tree/Tree.ts'

const handleClear = 'handleClear'

interface ToolDetails {
  readonly ariaLabel: string
  readonly icon: string
  readonly label: string
  readonly tool: Tool
}

const shapeToolDetails: readonly ToolDetails[] = [
  {
    ariaLabel: DrawStrings.rectangleTool(),
    icon: '□',
    label: DrawStrings.rectangle(),
    tool: 'rectangle',
  },
  {
    ariaLabel: DrawStrings.circleTool(),
    icon: '○',
    label: DrawStrings.circle(),
    tool: 'circle',
  },
  {
    ariaLabel: DrawStrings.triangleTool(),
    icon: '△',
    label: DrawStrings.triangle(),
    tool: 'triangle',
  },
]

const isShapeTool = (tool: Tool): boolean => {
  return shapeToolDetails.some((details) => details.tool === tool)
}

const renderShapeTool = (selectedTool: Tool): TreeNode => {
  const pickerVisible = isShapeTool(selectedTool)
  const activeShape = pickerVisible
    ? shapeToolDetails.find((details) => details.tool === selectedTool)!
    : shapeToolDetails[0]
  const button = renderToolButton(
    selectedTool,
    activeShape.tool,
    activeShape.ariaLabel,
    activeShape.label,
    activeShape.icon,
  )
  const picker = pickerVisible
    ? [
        tree(
          VirtualDomElements.Div,
          {
            'aria-label': DrawStrings.shapeTools(),
            className: 'DrawShapePicker',
            role: AriaRoles.ToolBar,
          },
          shapeToolDetails.map(
            ({ ariaLabel, icon, label, tool }): TreeNode =>
              renderToolButton(
                selectedTool,
                tool,
                ariaLabel,
                label,
                icon,
                'DrawShapeOptionButton',
              ),
          ),
        ),
      ]
    : []
  return tree(VirtualDomElements.Div, { className: 'DrawShapeTool' }, [
    {
      ...button,
      node: {
        ...button.node,
        'aria-expanded': pickerVisible,
        'aria-haspopup': true,
      },
    },
    ...picker,
  ])
}

export const renderToolbar = (selectedTool: Tool, empty: boolean): TreeNode => {
  const toolbar = tree(
    VirtualDomElements.Div,
    {
      'aria-label': DrawStrings.drawingTools(),
      className: 'DrawToolbar',
      role: AriaRoles.ToolBar,
    },
    [
      renderToolButton(
        selectedTool,
        'cursor',
        DrawStrings.selectTool(),
        DrawStrings.select(),
        '↖',
      ),
      renderToolButton(
        selectedTool,
        'line',
        DrawStrings.lineTool(),
        DrawStrings.line(),
        '╱',
      ),
      renderShapeTool(selectedTool),
      renderToolButton(
        selectedTool,
        'text',
        DrawStrings.textTool(),
        DrawStrings.text(),
        'T',
      ),
    ],
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
  return tree(VirtualDomElements.Div, { className: 'DrawControls' }, [
    toolbar,
    clearButton,
  ])
}
