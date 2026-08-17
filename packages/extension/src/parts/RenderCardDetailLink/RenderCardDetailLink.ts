import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDetailLink = (
  url: string,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'DrawCardDetailLink',
      href: url,
      rel: 'noopener noreferrer',
      target: '_blank',
      type: VirtualDomElements.A,
    },
    text(DrawStrings.openInDraw()),
  ]
}
