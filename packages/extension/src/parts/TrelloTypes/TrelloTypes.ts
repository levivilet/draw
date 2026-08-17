// cspell:ignore prefs

export interface DrawCredentials {
  readonly apiKey: string
  readonly token: string
}

export interface DrawOrganization {
  readonly displayName?: string
  readonly id: string
  readonly name: string
}

export interface DrawBoardBackgroundImage {
  readonly height?: number
  readonly url?: string
  readonly width?: number
}

export interface DrawBoardPreferences {
  readonly backgroundBottomColor?: string
  readonly backgroundBrightness?: string
  readonly backgroundColor?: string
  readonly backgroundImage?: string | null
  readonly backgroundImageScaled?: readonly DrawBoardBackgroundImage[]
  readonly backgroundTile?: boolean
  readonly backgroundTopColor?: string
}

export interface DrawBoard {
  readonly dateLastView?: string
  readonly id: string
  readonly idOrganization?: string
  readonly name: string
  readonly organization?: DrawOrganization
  readonly prefs?: DrawBoardPreferences
  readonly url?: string
}

export interface DrawLabel {
  readonly color?: string
  readonly id: string
  readonly idBoard?: string
  readonly name?: string
}

export interface DrawLabelCreate {
  readonly color: string
  readonly name: string
}

export interface DrawCardBadges {
  readonly comments?: number
}

export interface DrawCardCoverScaled {
  readonly height?: number
  readonly url?: string
  readonly width?: number
}

export interface DrawCardCover {
  readonly color?: string | null
  readonly scaled?: readonly DrawCardCoverScaled[]
  readonly sharedSourceUrl?: string | null
  readonly size?: string
  readonly url?: string | null
}

export interface DrawCard {
  readonly attachments?: readonly DrawAttachment[]
  readonly badges?: DrawCardBadges
  readonly cover?: DrawCardCover | null
  readonly desc?: string
  readonly id: string
  readonly idBoard?: string
  readonly idList?: string
  readonly labels?: readonly DrawLabel[]
  readonly name: string
  readonly url?: string
}

export interface DrawAttachmentPreview {
  readonly url?: string
}

export interface DrawAttachment {
  readonly id: string
  readonly mimeType?: string
  readonly name?: string
  readonly previews?: readonly DrawAttachmentPreview[]
  readonly url?: string
}

export interface DrawCommentData {
  readonly text?: string
}

export interface DrawCommentMember {
  readonly avatarHash?: string
  readonly avatarUrl?: string
  readonly fullName?: string
  readonly id?: string
  readonly initials?: string
  readonly username?: string
}

export interface DrawComment {
  readonly data: DrawCommentData
  readonly date?: string
  readonly id: string
  readonly memberCreator?: DrawCommentMember
}

export interface DrawCardDetail {
  readonly attachments: readonly DrawAttachment[]
  readonly card: DrawCard
  readonly comments: readonly DrawComment[]
}

export interface DrawCardUpdate {
  readonly desc: string
  readonly name: string
}

export interface DrawCardCreate {
  readonly name: string
  readonly pos: 'bottom'
}

export interface DrawCardMove {
  readonly idList: string
  readonly pos: 'bottom' | 'top'
}

export interface DrawList {
  readonly cards: readonly DrawCard[]
  readonly id: string
  readonly name: string
}

export interface DrawListCreate {
  readonly name: string
  readonly pos: 'bottom'
}

export interface DrawListUpdate {
  readonly name: string
}

export interface DrawBoardDetail {
  readonly board: DrawBoard
  readonly lists: readonly DrawList[]
}

export interface DrawBoardSearchResult extends DrawBoard {
  readonly type: 'board'
}

export interface DrawCardSearchResult extends DrawCard {
  readonly type: 'card'
}

export type DrawSearchResult =
  | DrawBoardSearchResult
  | DrawCardSearchResult
