import {
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import { renderText } from '../RenderText/RenderText.ts'

const emptyMessageNode: VirtualDomNode = {
  childCount: 1,
  className: 'DrawEmptyMessage',
  type: VirtualDomElements.P,
}

export const renderEmptyMessage = (
  empty: boolean,
): readonly VirtualDomNode[] => {
  if (!empty) {
    return []
  }
  return [emptyMessageNode, renderText('Start drawing anywhere')]
}
