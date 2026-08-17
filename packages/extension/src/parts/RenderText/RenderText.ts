import {
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'

export const renderText = (text: string): VirtualDomNode => {
  return {
    childCount: 0,
    text,
    type: VirtualDomElements.Text,
  }
}
