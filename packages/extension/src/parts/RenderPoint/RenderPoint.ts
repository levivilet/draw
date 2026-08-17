import {
  mergeClassNames,
  type VirtualDomNode,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import { getStrokeClassName } from '../GetStrokeClassName/GetStrokeClassName.ts'

export const renderPoint = (index: number): VirtualDomNode => {
  return {
    childCount: 0,
    className: mergeClassNames(
      'DrawStroke',
      'DrawStrokePoint',
      getStrokeClassName(index),
    ),
    type: VirtualDomElements.Div,
  }
}
