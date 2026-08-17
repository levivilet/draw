import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawComment } from '../DrawTypes/DrawTypes.ts'
import { renderCardDetailComment } from '../RenderCardDetailComment/RenderCardDetailComment.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDetailComments = (
  loading: boolean,
  comments: readonly DrawComment[],
): readonly VirtualDomNode[] => {
  if (loading) {
    return [
      {
        childCount: 1,
        className: 'DrawCardDetailEmpty',
        type: VirtualDomElements.Div,
      },
      text(DrawStrings.loadingComments()),
    ]
  }
  if (comments.length === 0) {
    return [
      {
        childCount: 1,
        className: 'DrawCardDetailEmpty',
        type: VirtualDomElements.Div,
      },
      text(DrawStrings.noComments()),
    ]
  }
  return [
    {
      childCount: comments.length,
      className: 'DrawCardComments',
      type: VirtualDomElements.Div,
    },
    ...comments.flatMap(renderCardDetailComment),
  ]
}
