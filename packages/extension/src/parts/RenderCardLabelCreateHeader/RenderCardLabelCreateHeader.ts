import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardLabelCreateHeader = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: 'DrawCardLabelPickerHeader',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardLabelPickerBackButton',
      ),
      name: 'closeCardLabelCreate',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text('<'),
    {
      childCount: 1,
      className: 'DrawCardLabelPickerTitle',
      type: VirtualDomElements.Div,
    },
    text(DrawStrings.createLabel()),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardLabelPickerCloseButton',
      ),
      name: 'closeCardLabelPicker',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text('x'),
  ]
}
