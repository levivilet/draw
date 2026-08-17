import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import { getLabelText } from '../LabelHelpers/LabelHelpers.ts'

export const getMatchingLabels = (
  state: Readonly<DrawViewState>,
): readonly DrawLabel[] => {
  const { boardLabels, draftLabelSearchQuery } = state
  const query = draftLabelSearchQuery.trim().toLowerCase()
  return boardLabels.filter((label) => {
    if (!query) {
      return true
    }
    return getLabelText(label).toLowerCase().includes(query)
  })
}
