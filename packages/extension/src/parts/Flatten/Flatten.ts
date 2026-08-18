import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { TreeNode } from '../Tree/Tree.ts'

export const flatten = (node: TreeNode): readonly VirtualDomNode[] => {
  return [node.node, ...node.children.flatMap(flatten)]
}
