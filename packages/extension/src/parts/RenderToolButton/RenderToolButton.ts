import {
  mergeClassNames,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { Tool } from '../DrawState/DrawState.ts'
import { textNode } from '../TextNode/TextNode.ts'
import { tree, type TreeNode } from '../Tree/Tree.ts'

const handleSelectTool = 'handleSelectTool'

export const renderToolButton = (
  selectedTool: Tool,
  tool: Tool,
  ariaLabel: string,
  label: string,
  icon: string,
  className = 'DrawToolButton',
): TreeNode => {
  const selected = selectedTool === tool
  return tree(
    VirtualDomElements.Button,
    {
      'aria-label': ariaLabel,
      'aria-pressed': selected,
      className: mergeClassNames(
        className,
        selected ? 'DrawToolButtonSelected' : '',
      ),
      name: tool,
      onClick: handleSelectTool,
      title: label,
    },
    [textNode(icon)],
  )
}
