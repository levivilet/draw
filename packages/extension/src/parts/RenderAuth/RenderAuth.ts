import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderError } from '../RenderError/RenderError.ts'
import { renderField } from '../RenderField/RenderField.ts'
import { renderWelcome } from '../RenderWelcome/RenderWelcome.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderAuth = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { draftApiKey, draftToken, error, loading } = state
  const errorDom = renderError(error)
  return [
    {
      childCount: 2,
      className: MergeClassNames.mergeClassNames('DrawView', 'DrawAuth'),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2 + (errorDom.length > 0 ? 1 : 0),
      className: 'DrawAuthForm',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'DrawAuthFields',
      type: VirtualDomElements.Div,
    },
    ...renderField(DrawStrings.apiKey(), 'apiKey', draftApiKey),
    ...renderField(DrawStrings.token(), 'token', draftToken, 'password'),
    {
      childCount: 1,
      className: 'DrawButton',
      name: 'connect',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(loading ? DrawStrings.connecting() : DrawStrings.connect()),
    ...errorDom,
    ...renderWelcome(),
  ]
}
