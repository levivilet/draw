import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'

export interface TreeNode {
  readonly children: readonly TreeNode[]
  readonly node: VirtualDomNode
}

export const tree = (
  type: number,
  properties: Readonly<Record<string, unknown>> = {},
  children: readonly TreeNode[] = [],
): TreeNode => {
  return {
    children,
    node: {
      ...properties,
      childCount: children.length,
      type,
    },
  }
}
