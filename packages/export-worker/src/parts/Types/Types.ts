export interface Point {
  readonly x: number
  readonly y: number
}

export interface LineShape {
  readonly end: Point
  readonly id: number
  readonly start: Point
  readonly type: 'line'
}

export interface RectangleShape {
  readonly end: Point
  readonly id: number
  readonly start: Point
  readonly type: 'rectangle'
}

export interface TextShape {
  readonly id: number
  readonly point: Point
  readonly text: string
  readonly type: 'text'
}

export type Shape = LineShape | RectangleShape | TextShape

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
