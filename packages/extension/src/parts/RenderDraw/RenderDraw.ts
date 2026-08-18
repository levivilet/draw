import {
  AriaRoles,
  mergeClassNames,
  text,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawState, Shape, Tool } from '../DrawState/DrawState.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const handleClear = 'handleClear'
const handleDrawContextMenu = 'handleDrawContextMenu'
const handleDrawPointerDown = 'handleDrawPointerDown'
const handleSelectTool = 'handleSelectTool'
const handleTextInput = 'handleTextInput'

interface TreeNode {
  readonly children: readonly TreeNode[]
  readonly node: VirtualDomNode
}

const tree = (
  type: number,
  properties: Readonly<Record<string, unknown>> = {},
  children: readonly TreeNode[] = [],
): TreeNode => {
  return {
    children,
    node: {
      ...properties,
      childCount: children.length,
      type,
    },
  }
}

const textNode = (value: string): TreeNode => {
  return {
    children: [],
    node: text(value),
  }
}

const flatten = (node: TreeNode): readonly VirtualDomNode[] => {
  return [node.node, ...node.children.flatMap(flatten)]
}

interface ToolDetails {
  readonly icon: string
  readonly label: string
  readonly tool: Tool
}

const shapeToolDetails: readonly ToolDetails[] = [
  { icon: '□', label: 'Rectangle', tool: 'rectangle' },
  { icon: '○', label: 'Circle', tool: 'circle' },
  { icon: '△', label: 'Triangle', tool: 'triangle' },
]

const renderToolButton = (
  selectedTool: Tool,
  tool: Tool,
  label: string,
  icon: string,
  className = 'DrawToolButton',
): TreeNode => {
  const selected = selectedTool === tool
  return tree(
    VirtualDomElements.Button,
    {
      'aria-label': `${label} tool`,
      'aria-pressed': selected,
      className: mergeClassNames(
        className,
        selected ? 'DrawToolButtonSelected' : '',
      ),
      name: tool,
      onClick: handleSelectTool,
      title: label,
    },
    [textNode(icon)],
  )
}

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
    activeShape.label,
    activeShape.icon,
  )
  const picker = pickerVisible
    ? [
        tree(
          VirtualDomElements.Div,
          {
            'aria-label': 'Shape tools',
            className: 'DrawShapePicker',
            role: AriaRoles.ToolBar,
          },
          shapeToolDetails.map(({ icon, label, tool }) =>
            renderToolButton(
              selectedTool,
              tool,
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

const renderToolbar = (selectedTool: Tool, empty: boolean): TreeNode => {
  const toolbar = tree(
    VirtualDomElements.Div,
    {
      'aria-label': 'Drawing tools',
      className: 'DrawToolbar',
      role: AriaRoles.ToolBar,
    },
    [
      renderToolButton(selectedTool, 'cursor', 'Select', '↖'),
      renderToolButton(selectedTool, 'line', 'Line', '╱'),
      renderShapeTool(selectedTool),
      renderToolButton(selectedTool, 'text', 'Text', 'T'),
    ],
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

const getShapeClassName = (
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

const renderShape = (
  shape: Readonly<Shape>,
  selectedShapeId: number | undefined,
  selectedTool: Tool,
): TreeNode => {
  const properties = {
    className: getShapeClassName(shape, selectedShapeId),
    'data-shape-id': String(shape.id),
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

const renderBoard = (state: Readonly<DrawState>): TreeNode => {
  const { selectedShapeId, selectedTool, shapes } = state
  const shapeNodes = shapes.map((shape) =>
    renderShape(shape, selectedShapeId, selectedTool),
  )
  const emptyNodes =
    shapes.length === 0
      ? [
          tree(VirtualDomElements.P, { className: 'DrawEmptyMessage' }, [
            textNode('Choose a tool and start creating'),
          ]),
        ]
      : []
  return tree(
    VirtualDomElements.Div,
    {
      'aria-label': 'Whiteboard drawing area',
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
