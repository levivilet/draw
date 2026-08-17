import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import {
  getLabelColorClassName,
  labelColors,
} from '../LabelHelpers/LabelHelpers.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardLabelColorChoice } from '../RenderCardLabelColorChoice/RenderCardLabelColorChoice.ts'
import { renderCardLabelCreateHeader } from '../RenderCardLabelCreateHeader/RenderCardLabelCreateHeader.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardLabelCreate = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { draftNewLabelColor, draftNewLabelName, savingNewLabel } = state
  return [
    {
      childCount: 3,
      className: 'DrawCardLabelCreate',
      type: VirtualDomElements.Div,
    },
    ...renderCardLabelCreateHeader(),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawCardLabelCreatePreview',
        getLabelColorClassName(draftNewLabelColor),
      ),
      type: VirtualDomElements.Div,
    },
    text(draftNewLabelName || DrawStrings.labelTitle()),
    {
      childCount: 5,
      className: 'DrawCardLabelCreateFields',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Label,
    },
    text(DrawStrings.title()),
    {
      autocomplete: 'off',
      childCount: 0,
      className: 'DrawInput',
      disabled: savingNewLabel,
      name: 'newLabelName',
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: DrawStrings.labelTitle(),
      type: VirtualDomElements.Input,
      value: draftNewLabelName,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Label,
    },
    text(DrawStrings.selectAColor()),
    {
      childCount: labelColors.length,
      className: 'DrawCardLabelColorGrid',
      type: VirtualDomElements.Div,
    },
    ...labelColors.map((color) => renderCardLabelColorChoice(state, color)),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawPrimaryButton',
      ),
      disabled: savingNewLabel || !draftNewLabelName.trim(),
      name: 'createCardLabel',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(savingNewLabel ? DrawStrings.creating() : DrawStrings.create()),
  ]
}
