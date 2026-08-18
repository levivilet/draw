export interface Point {
  readonly x: number
  readonly y: number
}

interface BoundedShape {
  readonly end: Point
  readonly id: number
  readonly start: Point
}

export interface ArrowShape extends BoundedShape {
  readonly type: 'arrow'
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

export interface TextShape {
  readonly id: number
  readonly point: Point
  readonly text: string
  readonly type: 'text'
}

export type Shape =
  | ArrowShape
  | CircleShape
  | LineShape
  | RectangleShape
  | TextShape
  | TriangleShape

export type ExportFormat = 'jpg' | 'svg'

export interface ExportDrawingOptions {
  readonly format: ExportFormat
  readonly height: number
  readonly shapes: readonly Shape[]
  readonly width: number
}

export interface ExportDimensions {
  readonly height: number
  readonly width: number
}
