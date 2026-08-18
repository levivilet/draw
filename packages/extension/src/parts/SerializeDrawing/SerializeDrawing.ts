import type { Shape } from '../DrawState/DrawState.ts'

const documentFormat = 'lvce-draw'
const documentVersion = 1
const pageId = 'page:1'

interface FileShapeBase {
  readonly childIndex: number
  readonly id: string
  readonly name: string
  readonly parentId: string
  readonly point: readonly [number, number]
  readonly rotation: number
}

interface FileLineShape extends FileShapeBase {
  readonly handles: {
    readonly end: FileShapeHandle
    readonly start: FileShapeHandle
  }
  readonly type: 'arrow' | 'line'
}

interface FileBoxShape extends FileShapeBase {
  readonly size: readonly [number, number]
  readonly type: 'circle' | 'rectangle' | 'triangle'
}

interface FileShapeHandle {
  readonly id: string
  readonly index: number
  readonly point: readonly [number, number]
}

interface FileTextShape extends FileShapeBase {
  readonly text: string
  readonly type: 'text'
}

export type FileShape = FileBoxShape | FileLineShape | FileTextShape

export interface DrawingFile {
  readonly format: typeof documentFormat
  readonly page: {
    readonly id: typeof pageId
    readonly name: 'Page 1'
    readonly shapes: Readonly<Record<string, FileShape>>
  }
  readonly version: typeof documentVersion
}

const toShapeId = (id: number): string => `shape:${id}`

const toFileShape = (shape: Readonly<Shape>, childIndex: number): FileShape => {
  const base = {
    childIndex,
    id: toShapeId(shape.id),
    name: `${shape.type[0].toUpperCase()}${shape.type.slice(1)}`,
    parentId: pageId,
    rotation: 0,
  }
  if (
    shape.type !== 'arrow' &&
    shape.type !== 'line' &&
    shape.type !== 'text'
  ) {
    const x = Math.min(shape.start.x, shape.end.x)
    const y = Math.min(shape.start.y, shape.end.y)
    return {
      ...base,
      point: [x, y],
      size: [
        Math.abs(shape.end.x - shape.start.x),
        Math.abs(shape.end.y - shape.start.y),
      ],
      type: shape.type,
    }
  }
  switch (shape.type) {
    case 'arrow':
    case 'line': {
      const x = Math.min(shape.start.x, shape.end.x)
      const y = Math.min(shape.start.y, shape.end.y)
      return {
        ...base,
        handles: {
          end: {
            id: 'end',
            index: 1,
            point: [shape.end.x - x, shape.end.y - y],
          },
          start: {
            id: 'start',
            index: 0,
            point: [shape.start.x - x, shape.start.y - y],
          },
        },
        point: [x, y],
        type: shape.type,
      }
    }
    case 'text':
      return {
        ...base,
        point: [shape.point.x, shape.point.y],
        text: shape.text,
        type: shape.type,
      }
  }
}

export const createDrawingFile = (
  shapes: readonly Readonly<Shape>[],
): DrawingFile => {
  const fileShapes: Record<string, FileShape> = {}
  for (const [childIndex, shape] of shapes.entries()) {
    fileShapes[toShapeId(shape.id)] = toFileShape(shape, childIndex)
  }
  return {
    format: documentFormat,
    page: {
      id: pageId,
      name: 'Page 1',
      shapes: fileShapes,
    },
    version: documentVersion,
  }
}

export const serializeDrawing = (
  shapes: readonly Readonly<Shape>[],
): string => {
  return `${JSON.stringify(createDrawingFile(shapes), undefined, 2)}\n`
}
