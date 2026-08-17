import { exportDrawing } from '../ExportDrawing/ExportDrawing.ts'

export const commandMap: Readonly<Record<string, unknown>> = {
  'DrawExport.export': exportDrawing,
}
