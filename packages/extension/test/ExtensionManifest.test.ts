import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

test('defines only the basic Draw extension surface', async () => {
  const text = await readFile(
    new URL('../extension.json', import.meta.url),
    'utf8',
  )
  const manifest = JSON.parse(text) as {
    readonly activation: readonly string[]
    readonly browser: string
    readonly commands: readonly { readonly id: string }[]
    readonly configuration?: unknown
    readonly repository: string
    readonly views: readonly { readonly css: string; readonly id: string }[]
  }

  expect(text.toLowerCase()).not.toContain('trello')
  expect(manifest).toMatchObject({
    activation: [
      'onView:draw.views.whiteboard',
      'onCommand:draw.clear',
      'onCommand:draw.show',
    ],
    browser: 'dist/drawMain.js',
    repository: 'https://github.com/levivilet/draw',
  })
  expect(manifest.commands.map(({ id }) => id)).toEqual([
    'draw.show',
    'draw.clear',
  ])
  expect(manifest.configuration).toBeUndefined()
  expect(manifest.views).toEqual([
    expect.objectContaining({
      css: 'media/draw.css',
      id: 'draw.views.whiteboard',
    }),
  ])
})
