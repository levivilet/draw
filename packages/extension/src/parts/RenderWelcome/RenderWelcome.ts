import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import { trelloPowerUpsUrl } from '../Constants/Constants.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const renderWelcomeText = (value: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'DrawWelcomeText',
      type: VirtualDomElements.Div,
    },
    text(value),
  ]
}

const renderWelcomeNote = (value: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'DrawWelcomeNote',
      type: VirtualDomElements.Div,
    },
    text(value),
  ]
}

const renderWelcomeLink = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'DrawWelcomeLink',
      href: trelloPowerUpsUrl,
      rel: 'noopener noreferrer',
      target: '_blank',
      type: VirtualDomElements.A,
    },
    text(trelloPowerUpsUrl),
  ]
}

const renderWelcomeStep = (
  number: string,
  children: readonly VirtualDomNode[],
  childCount: number,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'DrawWelcomeStep',
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: 'DrawWelcomeStepNumber',
      type: VirtualDomElements.Span,
    },
    text(number),
    {
      childCount,
      className: 'DrawWelcomeStepText',
      type: VirtualDomElements.Span,
    },
    ...children,
  ]
}

const renderWelcomeSteps = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: 'DrawWelcomeSteps',
      type: VirtualDomElements.Ol,
    },
    ...renderWelcomeStep(
      '1',
      [text(DrawStrings.welcomePowerUp()), ...renderWelcomeLink(), text('.')],
      3,
    ),
    ...renderWelcomeStep('2', [text(DrawStrings.welcomeApiKey())], 1),
    ...renderWelcomeStep('3', [text(DrawStrings.welcomeToken())], 1),
  ]
}

export const renderWelcome = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 4,
      className: 'DrawWelcome',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'DrawWelcomeTitle',
      type: VirtualDomElements.H3,
    },
    text(DrawStrings.welcome()),
    ...renderWelcomeText(DrawStrings.welcomeDescription()),
    ...renderWelcomeSteps(),
    ...renderWelcomeNote(DrawStrings.welcomeSecurity()),
  ]
}
