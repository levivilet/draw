export interface Point {
  readonly x: number
  readonly y: number
}

interface ShapeBase {
  readonly id: number
}

export interface LineShape extends ShapeBase {
  readonly end: Point
  readonly start: Point
  readonly type: 'line'
}

export interface RectangleShape extends ShapeBase {
  readonly end: Point
  readonly start: Point
  readonly type: 'rectangle'
}

export interface TextShape extends ShapeBase {
  readonly point: Point
  readonly text: string
  readonly type: 'text'
}

export type Shape = LineShape | RectangleShape | TextShape

export type Tool = 'cursor' | 'line' | 'rectangle' | 'text'

export interface DrawState {
  readonly drawing: boolean
  readonly nextShapeId: number
  readonly originalShape: Shape | undefined
  readonly pointerStart: Point | undefined
  readonly selectedShapeId: number | undefined
  readonly selectedTool: Tool
  readonly shapes: readonly Shape[]
}
