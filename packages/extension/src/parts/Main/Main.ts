import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
} from '@lvce-editor/api'
import {
  clearCommandId,
  duplicateCommandId,
  showCommandId,
  viewId,
} from '../Constants/Constants.ts'
import { dispose as disposeExportWorker } from '../DrawExportWorker/DrawExportWorker.ts'
import { view } from '../DrawView/DrawView.ts'
import {
  clearActiveDrawViewInstance,
  duplicateSelectedShapeInActiveDrawViewInstance,
} from '../DrawViewInstance/DrawViewInstance.ts'

const state = {
  activated: false,
}

export const activate = async (): Promise<void> => {
  const { activated } = state
  if (activated) {
    return
  }
  state.activated = true
  await activateExtensionApi()
  registerView(view)
  registerCommand({
    execute() {
      return executeCommand('Layout.toggleSideBarView', viewId)
    },
    id: showCommandId,
  })
  registerCommand({
    execute: clearActiveDrawViewInstance,
    id: clearCommandId,
  })
  registerCommand({
    execute: duplicateSelectedShapeInActiveDrawViewInstance,
    id: duplicateCommandId,
  })
}

export const deactivate = async (): Promise<void> => {
  state.activated = false
  await disposeExportWorker()
}
