import {
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'

export const renderToolbar = (
  children: readonly (readonly VirtualDomNode[])[],
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: children.length,
      className: 'DrawToolbar',
      type: VirtualDomElements.Div,
    },
    ...children.flat(),
  ]
}
