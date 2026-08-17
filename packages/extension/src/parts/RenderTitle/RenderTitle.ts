import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'

const titleNode: VirtualDomNode = {
  childCount: 1,
  className: 'DrawTitle',
  type: VirtualDomElements.H2,
}

export const renderTitle = (value: string): readonly VirtualDomNode[] => {
  return [titleNode, text(value)]
}
