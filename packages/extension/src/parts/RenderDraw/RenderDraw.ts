import {
  AriaRoles,
  mergeClassNames,
  text,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawState, Shape, Tool } from '../DrawState/DrawState.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'
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

const renderToolButton = (
  selectedTool: Tool,
  tool: Tool,
  ariaLabel: string,
  label: string,
  icon: string,
): TreeNode => {
  const selected = selectedTool === tool
  return tree(
    VirtualDomElements.Button,
    {
      'aria-label': ariaLabel,
      'aria-pressed': selected,
      className: mergeClassNames(
        'DrawToolButton',
        selected ? 'DrawToolButtonSelected' : '',
      ),
      name: tool,
      onClick: handleSelectTool,
      title: label,
    },
    [textNode(icon)],
  )
}

const renderToolbar = (selectedTool: Tool, empty: boolean): TreeNode => {
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
    'data-shapeId': String(shape.id),
  }
  if (shape.type !== 'text') {
    return tree(VirtualDomElements.Div, properties)
  }
  if (selectedShapeId === shape.id && selectedTool === 'text') {
    return tree(VirtualDomElements.Input, {
      ...properties,
      'aria-label': DrawStrings.text(),
      autofocus: true,
      onInput: handleTextInput,
      placeholder: DrawStrings.typeText(),
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
