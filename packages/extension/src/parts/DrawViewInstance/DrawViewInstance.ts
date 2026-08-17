import type {
  MenuEntry,
  ViewContext,
  ViewEvent,
  VirtualDomViewInstance,
} from '@lvce-editor/api'
import { type VirtualDomNode, text } from '@lvce-editor/virtual-dom-worker'
import type { DrawState, Point, Stroke } from '../DrawState/DrawState.ts'
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
  readonly render: () => readonly VirtualDomNode[]
}

const activeInstances = new Set<DrawViewInstance>()

const pointsEqual = (a: Readonly<Point>, b: Readonly<Point>): boolean => {
  return a.x === b.x && a.y === b.y
}

const appendPoint = (
  strokes: readonly Stroke[],
  point: Readonly<Point>,
): readonly Stroke[] => {
  const currentStroke = strokes.at(-1)
  const lastPoint = currentStroke?.points.at(-1)
  if (!currentStroke || (lastPoint && pointsEqual(lastPoint, point))) {
    return strokes
  }
  return [
    ...strokes.slice(0, -1),
    {
      points: [...currentStroke.points, point],
    },
  ]
}

export const clearActiveDrawViewInstance = (): void => {
  for (const instance of activeInstances) {
    instance.clear()
  }
}

export const createInstance = (context?: ViewContext): DrawViewInstance => {
  let state: DrawState = {
    drawing: false,
    strokes: [],
  }

  const updateState = (nextState: DrawState): void => {
    state = nextState
    void context?.requestRerender()
  }

  const addPoint = (
    clientX: unknown,
    clientY: unknown,
    offsets: readonly unknown[],
  ): void => {
    const { strokes: currentStrokes } = state
    const strokes = appendPoint(
      currentStrokes,
      toLocalPoint(clientX, clientY, offsets),
    )
    if (strokes === currentStrokes) {
      return
    }
    updateState({
      ...state,
      strokes,
    })
  }

  const instance: DrawViewInstance = {
    clear(): void {
      updateState({
        drawing: false,
        strokes: [],
      })
    },
    dispose(): void {
      activeInstances.delete(instance)
    },
    getCss(): string {
      const { strokes } = state
      return getDrawCss(strokes)
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
      ...offsets: readonly unknown[]
    ): void {
      if (button !== 0) {
        return
      }
      const { strokes } = state
      const point = toLocalPoint(clientX, clientY, offsets)
      updateState({
        drawing: true,
        strokes: [...strokes, { points: [point] }],
      })
    },
    handleDrawPointerMove(
      clientX: unknown,
      clientY: unknown,
      ...offsets: readonly unknown[]
    ): void {
      const { drawing } = state
      if (!drawing) {
        return
      }
      addPoint(clientX, clientY, offsets)
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
      addPoint(clientX, clientY, offsets)
      updateState({
        ...state,
        drawing: false,
      })
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
    render(): readonly VirtualDomNode[] {
      const { strokes } = state
      return renderDraw(strokes)
    },
    renderActionsDom() {
      return [text('')]
    },
  }

  activeInstances.add(instance)
  return instance
}

export { appendPoint }
