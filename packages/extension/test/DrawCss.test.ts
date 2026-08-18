import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

const rectangleRuleRegex = /\.DrawRectangle \{[^}]+\}/

test('renders rectangles with slightly rounded corners by default', async () => {
  const css = await readFile(
    new URL('../media/draw.css', import.meta.url),
    'utf8',
  )
  const rectangleRule = css.match(rectangleRuleRegex)?.[0]

  expect(rectangleRule).toContain('border-radius: 8px')
})
