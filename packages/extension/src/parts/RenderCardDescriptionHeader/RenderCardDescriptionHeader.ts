import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDescriptionHeader = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'DrawCardDescriptionHeader',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'DrawCardDetailSectionTitle',
      type: VirtualDomElements.H3,
    },
    text(DrawStrings.description()),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardDescriptionEditButton',
      ),
      name: 'editCardDescription',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(DrawStrings.edit()),
  ]
}
