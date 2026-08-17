import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawComment } from '../DrawTypes/DrawTypes.ts'
import { getCommentInitials } from '../CommentHelpers/CommentHelpers.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDetailAvatar = (
  comment: Readonly<DrawComment>,
  author: string,
  avatarUrl: string,
): readonly VirtualDomNode[] => {
  if (avatarUrl) {
    return [
      {
        alt: DrawStrings.avatar(author),
        childCount: 0,
        className: 'DrawCardCommentAvatar',
        src: avatarUrl,
        type: VirtualDomElements.Img,
      },
    ]
  }
  return [
    {
      childCount: 1,
      className: 'DrawCardCommentAvatar',
      type: VirtualDomElements.Div,
    },
    text(getCommentInitials(comment)),
  ]
}
