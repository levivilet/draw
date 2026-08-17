import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const getLabelText = (label: Readonly<DrawLabel>): string => {
  return label.name?.trim() || label.color?.trim() || DrawStrings.label()
}

export const labelColors = [
  'green_light',
  'yellow_light',
  'orange_light',
  'red_light',
  'purple_light',
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'green_dark',
  'yellow_dark',
  'orange_dark',
  'red_dark',
  'purple_dark',
  'blue_light',
  'sky_light',
  'lime_light',
  'pink_light',
  'black_light',
  'blue',
  'sky',
  'lime',
  'pink',
  'black',
  'blue_dark',
  'sky_dark',
  'lime_dark',
  'pink_dark',
  'black_dark',
] as const

const knownLabelColors = new Set<string>(labelColors)

const toLabelColorClassSuffix = (color: string): string => {
  return color
    .split('_')
    .map((part) => {
      return `${part[0].toUpperCase()}${part.slice(1)}`
    })
    .join('')
}

export const getLabelColorClassName = (color: string | undefined): string => {
  if (!color || !knownLabelColors.has(color)) {
    return 'DrawCardLabelColorNeutral'
  }
  return `DrawCardLabelColor${toLabelColorClassSuffix(color)}`
}
