import { expect, test } from '@jest/globals'
import * as DrawStrings from '../src/parts/DrawStrings/DrawStrings.ts'

test.each([
  [DrawStrings.chooseAToolAndStartCreating, 'Choose a tool and start creating'],
  [DrawStrings.clearDrawing, 'Clear drawing'],
  [DrawStrings.draw, 'Draw'],
  [DrawStrings.drawingTools, 'Drawing tools'],
  [DrawStrings.exportAs, 'Export As…'],
  [DrawStrings.jpg, 'JPG'],
  [DrawStrings.line, 'Line'],
  [DrawStrings.lineTool, 'Line tool'],
  [DrawStrings.paste, 'Paste'],
  [DrawStrings.rectangle, 'Rectangle'],
  [DrawStrings.rectangleTool, 'Rectangle tool'],
  [DrawStrings.redo, 'Redo'],
  [DrawStrings.saveAs, 'Save As…'],
  [DrawStrings.saveDrawing, 'Save drawing'],
  [DrawStrings.select, 'Select'],
  [DrawStrings.selectTool, 'Select tool'],
  [DrawStrings.svg, 'SVG'],
  [DrawStrings.text, 'Text'],
  [DrawStrings.textTool, 'Text tool'],
  [DrawStrings.typeText, 'Type text…'],
  [DrawStrings.undo, 'Undo'],
  [DrawStrings.whiteboardDrawingArea, 'Whiteboard drawing area'],
])('returns the default string', (getString, expected) => {
  expect(getString()).toBe(expected)
})
