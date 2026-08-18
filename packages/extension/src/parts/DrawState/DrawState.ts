export interface Point {
  readonly x: number
  readonly y: number
}

interface ShapeBase {
  readonly id: number
}

interface BoundedShape extends ShapeBase {
  readonly end: Point
  readonly start: Point
}

export interface CircleShape extends BoundedShape {
  readonly type: 'circle'
}

export interface LineShape extends BoundedShape {
  readonly type: 'line'
}

export interface RectangleShape extends BoundedShape {
  readonly type: 'rectangle'
}

export interface TriangleShape extends BoundedShape {
  readonly type: 'triangle'
}

export interface TextShape extends ShapeBase {
  readonly point: Point
  readonly text: string
  readonly type: 'text'
}

export type Shape =
  | CircleShape
  | LineShape
  | RectangleShape
  | TextShape
  | TriangleShape

export type Tool =
  | 'circle'
  | 'cursor'
  | 'line'
  | 'rectangle'
  | 'text'
  | 'triangle'

export interface DrawState {
  readonly drawing: boolean
  readonly nextShapeId: number
  readonly originalShape: Shape | undefined
  readonly pointerStart: Point | undefined
  readonly selectedShapeId: number | undefined
  readonly selectedTool: Tool
  readonly shapes: readonly Shape[]
}
