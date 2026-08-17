import {
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardLabelCreate } from '../RenderCardLabelCreate/RenderCardLabelCreate.ts'
import { renderCardLabelPickerContent } from '../RenderCardLabelPickerContent/RenderCardLabelPickerContent.ts'
import { renderCardLabelPickerHeader } from '../RenderCardLabelPickerHeader/RenderCardLabelPickerHeader.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardLabelPicker = (
  state: Readonly<DrawViewState>,
  labels: readonly DrawLabel[] | undefined,
): readonly VirtualDomNode[] => {
  const { cardLabelCreateOpen, draftLabelSearchQuery } = state
  if (cardLabelCreateOpen) {
    return [
      {
        childCount: 1,
        className: 'DrawCardLabelPicker',
        name: 'cardLabelPicker',
        onPointerDown:
          DomEventListenerFunctions.HandleCardLabelPickerPointerDown,
        type: VirtualDomElements.Div,
      },
      ...renderCardLabelCreate(state),
    ]
  }
  return [
    {
      childCount: 3,
      className: 'DrawCardLabelPicker',
      name: 'cardLabelPicker',
      onPointerDown: DomEventListenerFunctions.HandleCardLabelPickerPointerDown,
      type: VirtualDomElements.Div,
    },
    ...renderCardLabelPickerHeader(),
    {
      autocomplete: 'off',
      childCount: 0,
      className: MergeClassNames.mergeClassNames(
        'DrawInput',
        'DrawCardLabelSearchInput',
      ),
      name: 'cardLabelSearch',
      onBlur: DomEventListenerFunctions.HandleBlur,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: DrawStrings.searchLabels(),
      type: VirtualDomElements.Input,
      value: draftLabelSearchQuery,
    },
    ...renderCardLabelPickerContent(state, labels),
  ]
}
