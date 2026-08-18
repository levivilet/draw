import { expect, jest, test } from '@jest/globals'
import { downloadDrawingWithDependencies } from '../src/parts/DownloadDrawing/DownloadDrawing.ts'

interface Dependencies {
  readonly createObjectUrl: ReturnType<typeof jest.fn<(blob: Blob) => string>>
  readonly executeCommand: ReturnType<
    typeof jest.fn<
      (id: string, ...args: readonly unknown[]) => Promise<unknown>
    >
  >
  readonly revokeObjectUrl: ReturnType<typeof jest.fn<(url: string) => void>>
  readonly waitForDownload: ReturnType<typeof jest.fn<() => Promise<void>>>
}

const createDependencies = (): Dependencies => ({
  createObjectUrl: jest.fn<(blob: Blob) => string>(
    () => 'blob:https://example.com/drawing',
  ),
  executeCommand: jest.fn<
    (id: string, ...args: readonly unknown[]) => Promise<unknown>
  >(async () => undefined),
  revokeObjectUrl: jest.fn<(url: string) => void>(),
  waitForDownload: jest.fn<() => Promise<void>>(async () => {}),
})

test.each([
  ['draw' as const, 'drawing.draw'],
  ['svg' as const, 'drawing.svg'],
  ['jpg' as const, 'drawing.jpg'],
])('downloads %s with the expected filename', async (format, fileName) => {
  const dependencies = createDependencies()
  const blob = new Blob([format])

  await downloadDrawingWithDependencies(blob, format, dependencies)

  expect(dependencies.createObjectUrl).toHaveBeenCalledWith(blob)
  expect(dependencies.executeCommand).toHaveBeenCalledWith(
    'Download.downloadFile',
    fileName,
    'blob:https://example.com/drawing',
  )
  expect(dependencies.waitForDownload).toHaveBeenCalledTimes(1)
  expect(dependencies.revokeObjectUrl).toHaveBeenCalledWith(
    'blob:https://example.com/drawing',
  )
})

test('revokes the object URL when the download fails', async () => {
  const dependencies = createDependencies()
  dependencies.executeCommand.mockRejectedValue(new Error('download failed'))

  await expect(
    downloadDrawingWithDependencies(new Blob(), 'svg', dependencies),
  ).rejects.toThrow('download failed')
  expect(dependencies.waitForDownload).toHaveBeenCalledTimes(1)
  expect(dependencies.revokeObjectUrl).toHaveBeenCalledTimes(1)
})
