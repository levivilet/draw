import { executeCommand } from '@lvce-editor/api'
import type { ExportFormat } from '../DrawExportWorker/DrawExportWorker.ts'

interface DownloadDrawingDependencies {
  readonly createObjectUrl: (blob: Blob) => string
  readonly executeCommand: (
    id: string,
    ...args: readonly unknown[]
  ) => Promise<unknown>
  readonly revokeObjectUrl: (url: string) => void
  readonly waitForDownload: () => Promise<void>
}

const fileNames: Readonly<Record<ExportFormat, string>> = {
  jpg: 'drawing.jpg',
  svg: 'drawing.svg',
}

const defaultDependencies: DownloadDrawingDependencies = {
  createObjectUrl(blob: Blob): string {
    return URL.createObjectURL(blob)
  },
  executeCommand,
  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url)
  },
  async waitForDownload(): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0)
    })
  },
}

export const downloadDrawingWithDependencies = async (
  blob: Blob,
  format: ExportFormat,
  dependencies: Readonly<DownloadDrawingDependencies>,
): Promise<void> => {
  const url = dependencies.createObjectUrl(blob)
  try {
    await dependencies.executeCommand(
      'Download.downloadFile',
      fileNames[format],
      url,
    )
  } finally {
    await dependencies.waitForDownload()
    dependencies.revokeObjectUrl(url)
  }
}

export const downloadDrawing = (
  blob: Blob,
  format: ExportFormat,
): Promise<void> => {
  return downloadDrawingWithDependencies(blob, format, defaultDependencies)
}
