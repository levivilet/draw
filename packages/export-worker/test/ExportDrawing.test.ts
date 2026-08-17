import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { exportDrawing } from '../src/parts/ExportDrawing/ExportDrawing.ts'

test('registers the drawing export RPC command', () => {
  expect(commandMap).toEqual({
    'DrawExport.export': exportDrawing,
  })
})

test('dispatches SVG exports and rejects unknown formats', async () => {
  await expect(
    exportDrawing({ format: 'svg', height: 10, shapes: [], width: 20 }),
  ).resolves.toMatchObject({ type: 'image/svg+xml;charset=utf-8' })

  expect(() =>
    exportDrawing({
      format: 'png' as 'svg',
      height: 10,
      shapes: [],
      width: 20,
    }),
  ).toThrow('Unsupported drawing export format: png')
})
