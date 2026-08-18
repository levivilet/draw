import type { MenuEntry } from '@lvce-editor/api'
import { contextMenuId, exportMenuId } from '../Constants/Constants.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const createContextMenuEntries = (uid: number): readonly MenuEntry[] => [
  {
    args: [uid, 'handleViewCommand', 'handleDuplicate'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'duplicate',
    label: DrawStrings.duplicate(),
  },
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'paste',
    label: DrawStrings.paste(),
  },
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'undo',
    label: DrawStrings.undo(),
  },
  {
    args: [uid, 'handleViewCommand', 'handleNoop'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'redo',
    label: DrawStrings.redo(),
  },
  {
    args: [uid, 'handleViewCommand', 'handleSave'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'saveDrawing',
    label: DrawStrings.saveAs(),
  },
  {
    command: '',
    flags: 4,
    id: exportMenuId,
    label: DrawStrings.exportAs(),
  },
]

const createExportMenuEntries = (uid: number): readonly MenuEntry[] => [
  {
    args: [uid, 'handleViewCommand', 'handleExport', 'svg'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'exportSvg',
    label: DrawStrings.svg(),
  },
  {
    args: [uid, 'handleViewCommand', 'handleExport', 'jpg'],
    command: 'Viewlet.executeViewletCommand',
    flags: 6,
    id: 'exportJpg',
    label: DrawStrings.jpg(),
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
