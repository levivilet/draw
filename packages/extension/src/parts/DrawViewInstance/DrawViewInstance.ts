import type {
  MenuEntry,
  ViewContext,
  ViewEvent,
  VirtualDomViewInstance,
} from '@lvce-editor/api'
import { type VirtualDomNode, text } from '@lvce-editor/virtual-dom-worker'
import type { DrawState, Point, Shape, Tool } from '../DrawState/DrawState.ts'
import { contextMenuId } from '../Constants/Constants.ts'
import { getDrawCss } from '../GetDrawCss/GetDrawCss.ts'
import { getMenuEntries } from '../GetMenuEntries/GetMenuEntries.ts'
import { toLocalPoint } from '../Point/Point.ts'
import { renderDraw } from '../RenderDraw/RenderDraw.ts'

export interface DrawViewInstance extends VirtualDomViewInstance {
  readonly clear: () => void
  readonly getCss: () => string
  readonly getMenuEntries: (menuId: string) => readonly MenuEntry[]
  readonly handleClear: () => void
  readonly handleDrawPointerDown: (
    button: unknown,
    clientX: unknown,
    clientY: unknown,
    shapeId: unknown,
    ...offsets: readonly unknown[]
  ) => void
  readonly handleDrawPointerMove: (
    clientX: unknown,
    clientY: unknown,
    ...offsets: readonly unknown[]
  ) => void
  readonly handleDrawPointerUp: (
    clientX: unknown,
    clientY: unknown,
    ...offsets: readonly unknown[]
  ) => void
  readonly handleNoop: () => void
  readonly handleSelectTool: (tool: unknown) => void
  readonly handleTextInput: (shapeId: unknown, value: unknown) => void
  readonly render: () => readonly VirtualDomNode[]
}

const activeInstances = new Set<DrawViewInstance>()

const tools: readonly Tool[] = ['cursor', 'line', 'rectangle', 'text']

const isTool = (value: unknown): value is Tool => {
  return typeof value === 'string' && tools.includes(value as Tool)
}

const parseShapeId = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value === '') {
    return undefined
  }
  const id = Number(value)
  return Number.isSafeInteger(id) ? id : undefined
}

const replaceShape = (
  shapes: readonly Shape[],
  replacement: Readonly<Shape>,
): readonly Shape[] => {
  return shapes.map((shape) =>
    shape.id === replacement.id ? replacement : shape,
  )
}

const movePoint = (
  point: Readonly<Point>,
  deltaX: number,
  deltaY: number,
): Point => {
  return { x: point.x + deltaX, y: point.y + deltaY }
}

const moveShape = (
  shape: Readonly<Shape>,
  deltaX: number,
  deltaY: number,
): Shape => {
  switch (shape.type) {
    case 'line':
    case 'rectangle':
      return {
        ...shape,
        end: movePoint(shape.end, deltaX, deltaY),
        start: movePoint(shape.start, deltaX, deltaY),
      }
    case 'text':
      return {
        ...shape,
        point: movePoint(shape.point, deltaX, deltaY),
      }
  }
}

const resizeShape = (shape: Readonly<Shape>, end: Readonly<Point>): Shape => {
  if (shape.type === 'text') {
    return shape
  }
  return { ...shape, end }
}

export const clearActiveDrawViewInstance = (): void => {
  for (const instance of activeInstances) {
    instance.clear()
  }
}

export const createInstance = (context?: ViewContext): DrawViewInstance => {
  let state: DrawState = {
    drawing: false,
    nextShapeId: 0,
    originalShape: undefined,
    pointerStart: undefined,
    selectedShapeId: undefined,
    selectedTool: 'cursor',
    shapes: [],
  }

  const updateState = (nextState: DrawState): void => {
    state = nextState
    void context?.requestRerender()
  }

  const updatePointer = (
    clientX: unknown,
    clientY: unknown,
    offsets: readonly unknown[],
    drawing: boolean,
  ): boolean => {
    const {
      drawing: wasDrawing,
      originalShape,
      pointerStart,
      selectedShapeId,
      selectedTool,
      shapes,
    } = state
    if (!wasDrawing || selectedShapeId === undefined) {
      return false
    }
    const point = toLocalPoint(clientX, clientY, offsets)
    let replacement: Shape | undefined
    if (selectedTool === 'cursor' && originalShape && pointerStart) {
      replacement = moveShape(
        originalShape,
        point.x - pointerStart.x,
        point.y - pointerStart.y,
      )
    } else {
      const selectedShape = shapes.find((shape) => shape.id === selectedShapeId)
      if (selectedShape) {
        replacement = resizeShape(selectedShape, point)
      }
    }
    if (!replacement) {
      return false
    }
    updateState({
      ...state,
      drawing,
      originalShape: drawing ? originalShape : undefined,
      pointerStart: drawing ? pointerStart : undefined,
      shapes: replaceShape(shapes, replacement),
    })
    return true
  }

  const instance: DrawViewInstance = {
    clear(): void {
      const { selectedTool } = state
      updateState({
        drawing: false,
        nextShapeId: 0,
        originalShape: undefined,
        pointerStart: undefined,
        selectedShapeId: undefined,
        selectedTool,
        shapes: [],
      })
    },
    dispose(): void {
      activeInstances.delete(instance)
    },
    getCss(): string {
      const { shapes } = state
      return getDrawCss(shapes)
    },
    getMenuEntries(menuId: string): readonly MenuEntry[] {
      return getMenuEntries(menuId, context?.uid ?? 0)
    },
    handleClear(): void {
      instance.clear()
    },
    handleDrawPointerDown(
      button: unknown,
      clientX: unknown,
      clientY: unknown,
      shapeIdValue: unknown,
      ...offsets: readonly unknown[]
    ): void {
      if (button !== 0) {
        return
      }
      const point = toLocalPoint(clientX, clientY, offsets)
      const shapeId = parseShapeId(shapeIdValue)
      const { nextShapeId, selectedTool, shapes } = state
      const selectedShape = shapes.find((shape) => shape.id === shapeId)
      if (selectedTool === 'cursor') {
        updateState({
          ...state,
          drawing: Boolean(selectedShape),
          originalShape: selectedShape,
          pointerStart: selectedShape ? point : undefined,
          selectedShapeId: selectedShape?.id,
        })
        return
      }
      if (selectedTool === 'text') {
        if (selectedShape?.type === 'text') {
          updateState({ ...state, selectedShapeId: selectedShape.id })
          return
        }
        const shape: Shape = {
          id: nextShapeId,
          point,
          text: '',
          type: 'text',
        }
        updateState({
          ...state,
          nextShapeId: nextShapeId + 1,
          selectedShapeId: shape.id,
          shapes: [...shapes, shape],
        })
        return
      }
      const shape: Shape = {
        end: point,
        id: nextShapeId,
        start: point,
        type: selectedTool,
      }
      updateState({
        ...state,
        drawing: true,
        nextShapeId: nextShapeId + 1,
        pointerStart: point,
        selectedShapeId: shape.id,
        shapes: [...shapes, shape],
      })
    },
    handleDrawPointerMove(
      clientX: unknown,
      clientY: unknown,
      ...offsets: readonly unknown[]
    ): void {
      updatePointer(clientX, clientY, offsets, true)
    },
    handleDrawPointerUp(
      clientX: unknown,
      clientY: unknown,
      ...offsets: readonly unknown[]
    ): void {
      const { drawing } = state
      if (!drawing) {
        return
      }
      updatePointer(clientX, clientY, offsets, false)
    },
    async handleEvent(event: Readonly<ViewEvent>): Promise<void> {
      if (event.type === 'contextmenu' && event.name === 'board') {
        const x = typeof event.x === 'number' ? event.x : 0
        const y = typeof event.y === 'number' ? event.y : 0
        await context?.showContextMenu(contextMenuId, x, y)
        return
      }
      if (event.type === 'click' && event.name === 'clear') {
        instance.clear()
      }
    },
    handleNoop(): void {},
    handleSelectTool(tool: unknown): void {
      const { selectedTool } = state
      if (!isTool(tool) || tool === selectedTool) {
        return
      }
      updateState({
        ...state,
        drawing: false,
        originalShape: undefined,
        pointerStart: undefined,
        selectedTool: tool,
      })
    },
    handleTextInput(shapeIdValue: unknown, value: unknown): void {
      const shapeId = parseShapeId(shapeIdValue)
      const { shapes } = state
      const shape = shapes.find((candidate) => candidate.id === shapeId)
      if (!shape || shape.type !== 'text' || typeof value !== 'string') {
        return
      }
      updateState({
        ...state,
        shapes: replaceShape(shapes, { ...shape, text: value }),
      })
    },
    render(): readonly VirtualDomNode[] {
      return renderDraw(state)
    },
    renderActionsDom(): readonly VirtualDomNode[] {
      return [text('')]
    },
  }

  activeInstances.add(instance)
  return instance
}

export { moveShape, replaceShape, resizeShape }
