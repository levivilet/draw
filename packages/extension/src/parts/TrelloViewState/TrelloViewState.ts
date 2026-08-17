import type { ViewSelection } from '@lvce-editor/api'
import type { CredentialStorage } from '../CredentialStorage/CredentialStorage.ts'
import type { CurrentBoardStorage } from '../CurrentBoardStorage/CurrentBoardStorage.ts'
import type {
  RecentBoardStorage,
  RecentBoardView,
} from '../RecentBoardStorage/RecentBoardStorage.ts'
import type { DrawClient } from '../DrawClient/DrawClient.ts'
import type { DrawImageCache } from '../DrawImageCache/DrawImageCache.ts'
import type {
  DrawBoard,
  DrawBoardDetail,
  DrawCardDetail,
  DrawCredentials,
  DrawLabel,
  DrawSearchResult,
} from '../DrawTypes/DrawTypes.ts'

export interface DrawViewDependencies {
  readonly client: DrawClient
  readonly currentBoardStorage?: CurrentBoardStorage
  readonly imageCache?: DrawImageCache
  readonly isTest?: boolean
  readonly readBoardBackgroundEnabled?: () => Promise<boolean>
  readonly readCardDetailPopupEnabled?: () => Promise<boolean>
  readonly readSearchEnabled?: () => Promise<boolean>
  readonly recentStorage: RecentBoardStorage
  readonly storage: CredentialStorage
}

export interface DrawViewState {
  activeSearchQuery: string
  addingCardLabelId: string
  addingCardListId: string
  addingList: boolean
  attachmentImageUrls: Readonly<Record<string, string>>
  baseUrl: string
  boardBackgroundEnabled: boolean
  boardDetail: DrawBoardDetail | undefined
  boardFilterOpen: boolean
  boardLabels: readonly DrawLabel[]
  boardLabelsLoaded: boolean
  boardLabelsLoading: boolean
  boards: readonly DrawBoard[]
  cardAttachmentDropActive: boolean
  cardAttachmentsLoading: boolean
  cardAttachmentsUploading: boolean
  cardCommentsLoading: boolean
  cardDetailLoading: boolean
  cardDetailLoadingCardId: string
  cardDetailPopupEnabled: boolean
  cardDetailResizeStartWidth: number
  cardDetailResizeStartX: number
  cardDetailWidth: number
  cardLabelCreateOpen: boolean
  cardLabelPickerOpen: boolean
  context: Readonly<Record<string, boolean>>
  contextMenuCardId: string
  contextMenuListId: string
  coverImageUrls: Readonly<Record<string, string>>
  credentials: DrawCredentials | undefined
  draftApiKey: string
  draftBoardFilter: string
  draftCardDescription: string
  draftCardTitle: string
  draftComment: string
  draftLabelSearchQuery: string
  draftListTitles: Readonly<Record<string, string>>
  draftNewCardTitle: string
  draftNewLabelColor: string
  draftNewLabelName: string
  draftNewListTitle: string
  draftSearchQuery: string
  draftToken: string
  draggedCardId: string
  dragTargetListId: string
  editingCardDescription: boolean
  editingCardTitle: boolean
  error: string
  failedCardAttachmentImageIds: readonly string[]
  focusedName: string
  loading: boolean
  movingCardId: string
  pendingSelections: readonly ViewSelection[]
  recentBoardViews: readonly RecentBoardView[]
  resizingCardDetail: boolean
  savingCardDetail: boolean
  savingComment: boolean
  savingNewCard: boolean
  savingNewLabel: boolean
  savingNewList: boolean
  searchEnabled: boolean
  searchResults: readonly DrawSearchResult[]
  selectedCardDetail: DrawCardDetail | undefined
  writingComment: boolean
}

export interface DrawViewContext {
  readonly client: DrawClient
  readonly currentBoardStorage: CurrentBoardStorage
  readonly imageCache: DrawImageCache
  readonly recentStorage: RecentBoardStorage
  readonly requestRerender: () => void
  readonly showContextMenu: (
    menuId: string,
    x: number,
    y: number,
  ) => Promise<void>
  readonly state: DrawViewState
  readonly storage: CredentialStorage
}

export interface DrawViewActionContext {
  readonly client: DrawClient
  readonly currentBoardStorage: CurrentBoardStorage
  readonly imageCache: DrawImageCache
  readonly recentStorage: RecentBoardStorage
  readonly requestRerender: () => void
  readonly showContextMenu: (
    menuId: string,
    x: number,
    y: number,
  ) => Promise<void>
  readonly state: Readonly<DrawViewState>
  readonly storage: CredentialStorage
}
