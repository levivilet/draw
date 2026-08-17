import type {
  DrawBoard,
  DrawBoardDetail,
  DrawAttachment,
  DrawCard,
  DrawCardCreate,
  DrawCardDetail,
  DrawCardMove,
  DrawCardUpdate,
  DrawComment,
  DrawCredentials,
  DrawLabel,
  DrawLabelCreate,
  DrawList,
  DrawListCreate,
  DrawListUpdate,
  DrawSearchResult,
} from '../DrawTypes/DrawTypes.ts'

export interface DrawCacheFirstResult<T> {
  readonly cached: T | undefined
  readonly fresh: Promise<T>
}

export interface DrawCardDetailPartsResult {
  readonly cached: DrawCardDetail | undefined
  readonly fresh: {
    readonly attachments: Promise<DrawCardDetail['attachments']>
    readonly card: Promise<DrawCard>
    readonly comments: Promise<DrawCardDetail['comments']>
  }
}

export interface DrawClient {
  readonly addCardAttachment: (
    card: DrawCard,
    file: File,
    credentials: DrawCredentials,
  ) => Promise<DrawAttachment>
  readonly addCardComment: (
    card: DrawCard,
    text: string,
    credentials: DrawCredentials,
  ) => Promise<DrawComment>
  readonly addCardLabel: (
    card: DrawCard,
    label: DrawLabel,
    credentials: DrawCredentials,
  ) => Promise<DrawCard>
  readonly createCard: (
    list: DrawList,
    create: DrawCardCreate,
    credentials: DrawCredentials,
  ) => Promise<DrawCard>
  readonly createLabel: (
    board: DrawBoard,
    create: DrawLabelCreate,
    credentials: DrawCredentials,
  ) => Promise<DrawLabel>
  readonly createList: (
    board: DrawBoard,
    create: DrawListCreate,
    credentials: DrawCredentials,
  ) => Promise<DrawList>
  readonly getBoardDetail: (
    board: DrawBoard,
    credentials: DrawCredentials,
  ) => Promise<DrawBoardDetail>
  readonly getBoardDetailCacheFirst: (
    board: DrawBoard,
    credentials: DrawCredentials,
  ) => Promise<DrawCacheFirstResult<DrawBoardDetail>>
  readonly getCardDetail: (
    card: DrawCard,
    credentials: DrawCredentials,
  ) => Promise<DrawCardDetail>
  readonly getCardDetailCacheFirst: (
    card: DrawCard,
    credentials: DrawCredentials,
  ) => Promise<DrawCacheFirstResult<DrawCardDetail>>
  readonly getCardDetailPartsCacheFirst: (
    card: DrawCard,
    credentials: DrawCredentials,
  ) => Promise<DrawCardDetailPartsResult>
  readonly listBoardLabels: (
    board: DrawBoard,
    credentials: DrawCredentials,
  ) => Promise<readonly DrawLabel[]>
  readonly listBoards: (
    credentials: DrawCredentials,
  ) => Promise<readonly DrawBoard[]>
  readonly listBoardsCacheFirst: (
    credentials: DrawCredentials,
  ) => Promise<DrawCacheFirstResult<readonly DrawBoard[]>>
  readonly moveCard: (
    card: DrawCard,
    move: DrawCardMove,
    credentials: DrawCredentials,
  ) => Promise<DrawCard>
  readonly search: (
    query: string,
    credentials: DrawCredentials,
  ) => Promise<readonly DrawSearchResult[]>
  readonly searchCacheFirst: (
    query: string,
    credentials: DrawCredentials,
  ) => Promise<DrawCacheFirstResult<readonly DrawSearchResult[]>>
  readonly updateCard: (
    card: DrawCard,
    update: DrawCardUpdate,
    credentials: DrawCredentials,
  ) => Promise<DrawCard>
  readonly updateList: (
    list: DrawList,
    update: DrawListUpdate,
    credentials: DrawCredentials,
  ) => Promise<DrawList>
}

export interface DrawResponse {
  readonly json: () => Promise<unknown>
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  readonly text: () => Promise<string>
}

export interface DrawRequestInit {
  readonly body?: Readonly<FormData>
  readonly method?: string
}

export interface DrawClientOptions {
  readonly readBatchRequestsEnabled?: () => Promise<boolean>
}

export type FetchLike = (
  input: string,
  init?: DrawRequestInit,
) => Promise<DrawResponse>
