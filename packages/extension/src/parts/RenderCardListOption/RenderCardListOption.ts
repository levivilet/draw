import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawList } from '../DrawTypes/DrawTypes.ts'

export const renderCardListOption = (
  list: Readonly<DrawList>,
  selectedListId: string,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      selected: list.id === selectedListId,
      type: VirtualDomElements.Option,
      value: list.id,
    },
    text(list.name),
  ]
}
