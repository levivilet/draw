import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawComment } from '../DrawTypes/DrawTypes.ts'
import {
  getCommentAuthor,
  getCommentAvatarUrl,
  getCommentDateText,
  getCommentText,
} from '../CommentHelpers/CommentHelpers.ts'
import { renderCardDetailAvatar } from '../RenderCardDetailAvatar/RenderCardDetailAvatar.ts'

const renderCommentDate = (dateText: string): readonly VirtualDomNode[] => {
  if (!dateText) {
    return []
  }
  return [
    {
      childCount: 1,
      className: 'DrawCardCommentDate',
      type: VirtualDomElements.Div,
    },
    text(dateText),
  ]
}

export const renderCardDetailComment = (
  comment: Readonly<DrawComment>,
): readonly VirtualDomNode[] => {
  const author = getCommentAuthor(comment)
  const avatarUrl = getCommentAvatarUrl(comment)
  const dateText = getCommentDateText(comment)
  const commentText = getCommentText(comment)
  const dateDom = renderCommentDate(dateText)
  return [
    {
      childCount: 2,
      className: 'DrawCardComment',
      type: VirtualDomElements.Div,
    },
    ...renderCardDetailAvatar(comment, author, avatarUrl),
    {
      childCount: 2,
      className: 'DrawCardCommentContent',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1 + (dateDom.length > 0 ? 1 : 0),
      className: 'DrawCardCommentHeader',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'DrawCardCommentAuthor',
      type: VirtualDomElements.Div,
    },
    text(author),
    ...dateDom,
    {
      childCount: 1,
      className: 'DrawCardCommentText',
      type: VirtualDomElements.Div,
    },
    text(commentText),
  ]
}
