import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'

export const hasCardLabel = (
  labels: readonly DrawLabel[] | undefined,
  labelId: string,
): boolean => {
  return Boolean(
    labels?.some((label) => {
      return label.id === labelId
    }),
  )
}
