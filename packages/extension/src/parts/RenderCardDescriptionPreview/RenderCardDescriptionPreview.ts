import {
  AriaRoles,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderMarkdown } from '../RenderMarkdown/RenderMarkdown.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDescriptionPreview = (
  description: string,
): readonly VirtualDomNode[] => {
  const trimmedDescription = description.trim()
  if (!trimmedDescription) {
    return [
      {
        childCount: 1,
        className: MergeClassNames.mergeClassNames(
          'DrawCardDescriptionPreview',
          'DrawCardDescriptionPlaceholder',
        ),
        name: 'editCardDescription',
        onClick: DomEventListenerFunctions.HandleClick,
        role: AriaRoles.None,
        type: VirtualDomElements.Div,
      },
      text(DrawStrings.addDetailedDescription()),
    ]
  }
  const markdown = renderMarkdown(description)
  return [
    {
      childCount: markdown.childCount,
      className: 'DrawCardDescriptionPreview',
      name: 'editCardDescription',
      onClick: DomEventListenerFunctions.HandleClick,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...markdown.dom,
  ]
}
