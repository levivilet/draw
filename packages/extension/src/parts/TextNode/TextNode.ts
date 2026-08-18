import { text } from '@lvce-editor/virtual-dom-worker'
import type { TreeNode } from '../Tree/Tree.ts'

export const textNode = (value: string): TreeNode => {
  return {
    children: [],
    node: text(value),
  }
}
