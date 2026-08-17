import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
} from '@lvce-editor/api'
import {
  clearCommandId,
  showCommandId,
  viewId,
} from '../Constants/Constants.ts'
import { view } from '../DrawView/DrawView.ts'
import { clearActiveDrawViewInstance } from '../DrawViewInstance/DrawViewInstance.ts'

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
}

export const deactivate = (): void => {}
