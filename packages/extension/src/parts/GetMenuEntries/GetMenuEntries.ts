import type { MenuEntry } from '@lvce-editor/api'
import { contextMenuId, exportMenuId } from '../Constants/Constants.ts'

const createContextMenuEntries = (uid: number): readonly MenuEntry[] => [
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
    command: '',
    flags: 4,
    id: exportMenuId,
    label: 'Export As…',
  },
]

const createExportMenuEntries = (uid: number): readonly MenuEntry[] => [
  {
    args: [uid, 'handleViewCommand', 'handleExport', 'svg'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'exportSvg',
    label: 'SVG',
  },
  {
    args: [uid, 'handleViewCommand', 'handleExport', 'jpg'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'exportJpg',
    label: 'JPG',
  },
]

export const getMenuEntries = (
  menuId: string,
  uid: number,
): readonly MenuEntry[] => {
  switch (menuId) {
    case contextMenuId:
      return createContextMenuEntries(uid)
    case exportMenuId:
      return createExportMenuEntries(uid)
    default:
      return []
  }
}
