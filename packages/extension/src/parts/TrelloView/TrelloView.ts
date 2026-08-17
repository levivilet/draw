import type { View } from '@lvce-editor/api'
import { viewId } from '../Constants/Constants.ts'
import {
  type ActiveDrawViewInstance,
  createInstance,
} from '../CreateInstance/CreateInstance.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

type DrawView = Omit<View<ActiveDrawViewInstance>, 'commands'> & {
  readonly commands: NonNullable<View<ActiveDrawViewInstance>['commands']>
  readonly eventListeners?: ReturnType<typeof renderEventListeners>
}

const runViewAction =
  (action: (instance: ActiveDrawViewInstance) => Promise<void>) =>
    async (
      instance: ActiveDrawViewInstance,
    ): Promise<ActiveDrawViewInstance> => {
      await action(instance)
      return instance
    }

export const view: DrawView = {
  commands: {
    'trello.backToBoards': runViewAction((instance) => instance.backToBoards()),
    'trello.logout': runViewAction((instance) => instance.logout()),
    'trello.refreshBoards': runViewAction((instance) =>
      instance.refreshBoards(),
    ),
  },
  create: createInstance,
  // @ts-ignore
  displayName: DrawStringsdraw(),
  eventListeners: renderEventListeners(),
  icon: 'list-tree',
  id: viewId,
  kind: 'virtualDom',
  preferredLocation: 'preview',
  title: DrawStringsdraw(),
}

export {
  readCardDetailPopupEnabledPreference,
  resetDrawViewDependencyFactory,
  setDrawViewDependencyFactory,
} from '../DependencyFactory/DependencyFactory.ts'
export {
  backToBoardsActiveDrawViewInstance,
  cancelNewCardActiveDrawViewInstance,
  closeBoardFilterActiveDrawViewInstance,
  closeCardDetailActiveDrawViewInstance,
  logoutActiveDrawViewInstance,
  openCardActiveDrawViewInstance,
  refreshBoardsActiveDrawViewInstance,
  reloadActiveDrawViewInstances,
  saveCardDetailActiveDrawViewInstance,
  startAddCardActiveDrawViewInstance,
  submitNewCardActiveDrawViewInstance,
  addList,
  addCard,
  openMockBoard,
} from '../CreateInstance/CreateInstance.ts'
export { getMenuEntries } from '../MenuEntries/MenuEntries.ts'
export { renderActionsDom } from '../RenderActionsDom/RenderActionsDom.ts'
export {
  boardBackgroundEnabledPreference,
  cardDetailPopupEnabledPreference,
  searchEnabledPreference,
  viewId,
} from '../Constants/Constants.ts'
