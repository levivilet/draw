export interface Point {
  readonly x: number
  readonly y: number
}

export interface Stroke {
  readonly points: readonly Point[]
}

export interface DrawState {
  readonly drawing: boolean
  readonly strokes: readonly Stroke[]
}
