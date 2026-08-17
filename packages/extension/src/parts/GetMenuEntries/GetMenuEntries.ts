import type { MenuEntry } from '@lvce-editor/api'
import { contextMenuId } from '../Constants/Constants.ts'

const createMenuEntries = (uid: number): readonly MenuEntry[] => [
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'paste',
    label: 'Paste',
  },
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'undo',
    label: 'Undo',
  },
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'redo',
    label: 'Redo',
  },
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'export',
    label: 'Export As…',
  },
]

export const getMenuEntries = (
  menuId: string,
  uid: number,
): readonly MenuEntry[] => {
  if (menuId !== contextMenuId) {
    return []
  }
  return createMenuEntries(uid)
}
