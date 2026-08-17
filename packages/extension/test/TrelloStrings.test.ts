import { expect, test } from '@jest/globals'
import * as DrawStrings from '../src/parts/DrawStrings/DrawStrings.ts'

test('renders every Draw string', () => {
  const stringFunctions = Object.values(
    DrawStrings as unknown as Readonly<
      Record<string, (value?: string | number) => string>
    >,
  )
  const strings = stringFunctions.map((stringFunction) => {
    return stringFunction('value')
  })

  expect(strings).toHaveLength(stringFunctions.length)
  expect(strings.every(Boolean)).toBe(true)
})

test('renders placeholders', () => {
  expect(DrawStrings.boardNotFound('board-1')).toBe(
    'Board not found: board-1',
  )
  expect(DrawStrings.cardComments(2)).toBe('2 comments')
  expect(DrawStrings.searchResultsFor('roadmap')).toBe(
    'Search results for "roadmap"',
  )
  expect(DrawStringsdrawBoard('Roadmap')).toBe('Draw: Roadmap')
})
