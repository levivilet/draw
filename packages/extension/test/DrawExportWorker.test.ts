import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DrawExportWorker from '../src/parts/DrawExportWorker/DrawExportWorker.ts'

// cspell:ignore builtindraw

const invoke =
  jest.fn<(method: string, ...params: readonly unknown[]) => Promise<unknown>>()
const dispose = jest.fn<() => Promise<void>>(async () => {})
const createRpc = jest.fn<
  (options: { readonly id: string }) => Promise<{
    readonly dispose: typeof dispose
    readonly invoke: typeof invoke
  }>
>(async () => ({ dispose, invoke }))

beforeEach(() => {
  jest.resetAllMocks()
  createRpc.mockResolvedValue({ dispose, invoke })
  DrawExportWorker.state.createRpc = createRpc
  DrawExportWorker.state.rpcPromise = undefined
})

test('lazily creates and reuses the export worker', async () => {
  const svg = new Blob(['svg'], { type: 'image/svg+xml' })
  const jpg = new Blob(['jpg'], { type: 'image/jpeg' })
  const svgOptions = {
    format: 'svg' as const,
    height: 100,
    shapes: [],
    width: 200,
  }
  const jpgOptions = { ...svgOptions, format: 'jpg' as const }
  invoke.mockResolvedValueOnce(svg).mockResolvedValueOnce(jpg)

  await expect(DrawExportWorker.exportDrawing(svgOptions)).resolves.toBe(svg)
  await expect(DrawExportWorker.exportDrawing(jpgOptions)).resolves.toBe(jpg)

  expect(createRpc).toHaveBeenCalledTimes(1)
  expect(createRpc).toHaveBeenCalledWith({ id: 'builtindraw.export-worker' })
  expect(invoke).toHaveBeenNthCalledWith(1, 'DrawExport.export', svgOptions)
  expect(invoke).toHaveBeenNthCalledWith(2, 'DrawExport.export', jpgOptions)
})

test('disposes an initialized worker and can be called before initialization', async () => {
  await DrawExportWorker.dispose()
  expect(dispose).not.toHaveBeenCalled()

  invoke.mockResolvedValue(new Blob())
  await DrawExportWorker.exportDrawing({
    format: 'svg',
    height: 1,
    shapes: [],
    width: 1,
  })
  await DrawExportWorker.dispose()

  expect(dispose).toHaveBeenCalledTimes(1)
  expect(DrawExportWorker.state.rpcPromise).toBeUndefined()
})
