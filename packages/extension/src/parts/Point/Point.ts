import type { Point } from '../DrawState/DrawState.ts'

const toFiniteNumber = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

const sumOffsets = (offsets: readonly unknown[], start: number): number => {
  let total = 0
  for (let index = start; index < offsets.length; index += 2) {
    total += toFiniteNumber(offsets[index])
  }
  return total
}

export const toLocalPoint = (
  clientX: unknown,
  clientY: unknown,
  offsets: readonly unknown[],
): Point => {
  return {
    x: Math.max(0, toFiniteNumber(clientX) - sumOffsets(offsets, 0)),
    y: Math.max(0, toFiniteNumber(clientY) - sumOffsets(offsets, 1)),
  }
}
