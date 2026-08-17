import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'

const errorNode: VirtualDomNode = {
  childCount: 1,
  className: 'DrawError',
  type: VirtualDomElements.Div,
}

export const renderError = (error: string): readonly VirtualDomNode[] => {
  if (!error) {
    return []
  }
  return [errorNode, text(error)]
}
