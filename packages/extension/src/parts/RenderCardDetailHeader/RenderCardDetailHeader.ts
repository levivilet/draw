import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardDetailTitle } from '../RenderCardDetailTitle/RenderCardDetailTitle.ts'

export const renderCardDetailHeader = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'DrawCardDetailHeader',
      type: VirtualDomElements.Div,
    },
    ...renderCardDetailTitle(state),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardDetailCloseButton',
      ),
      name: 'closeCardDetail',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text('x'),
  ]
}
