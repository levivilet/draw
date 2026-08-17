import type { ExportDrawingOptions } from '../Types/Types.ts'
import { exportJpg } from '../ExportJpg/ExportJpg.ts'
import { exportSvg } from '../ExportSvg/ExportSvg.ts'

export const exportDrawing = (
  options: Readonly<ExportDrawingOptions>,
): Promise<Blob> => {
  switch (options.format) {
    case 'jpg':
      return exportJpg(options)
    case 'svg':
      return Promise.resolve(exportSvg(options))
    default:
      throw new TypeError(
        `Unsupported drawing export format: ${options.format}`,
      )
  }
}
