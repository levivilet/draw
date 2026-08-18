import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

// cspell:ignore builtindraw

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
    readonly keybindings: readonly {
      readonly command: string
      readonly key: string
      readonly when: string
    }[]
    readonly repository: string
    readonly rpc: readonly {
      readonly id: string
      readonly type: string
      readonly url: string
    }[]
    readonly views: readonly {
      readonly css: string
      readonly icon: string
      readonly id: string
      readonly preferredLocation: string
    }[]
  }

  expect(manifest).toMatchObject({
    activation: [
      'onView:draw.views.whiteboard',
      'onCommand:draw.clear',
      'onCommand:draw.duplicate',
      'onCommand:draw.show',
    ],
    browser: 'dist/drawMain.js',
    repository: 'https://github.com/levivilet/draw',
  })
  expect(manifest.commands.map(({ id }) => id)).toEqual([
    'draw.show',
    'draw.clear',
    'draw.duplicate',
  ])
  expect(manifest.keybindings).toEqual([
    {
      command: 'draw.duplicate',
      key: 'Ctrl+D',
      when: 'draw.selectedShape',
    },
  ])
  expect(manifest.configuration).toBeUndefined()
  expect(manifest.rpc).toEqual([
    expect.objectContaining({
      id: 'builtindraw.export-worker',
      type: 'web-worker',
      url: 'dist/drawExportWorkerMain.js',
    }),
  ])
  expect(manifest.views).toEqual([
    expect.objectContaining({
      css: 'media/draw.css',
      icon: 'media/draw.svg',
      id: 'draw.views.whiteboard',
      preferredLocation: 'secondaryPreview',
    }),
  ])
})
