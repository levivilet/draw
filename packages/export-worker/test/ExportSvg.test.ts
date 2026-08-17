import { expect, test } from '@jest/globals'
import { createSvg, exportSvg } from '../src/parts/ExportSvg/ExportSvg.ts'

test('exports an empty white drawing at rounded dimensions', async () => {
  const blob = exportSvg({ height: 50.4, shapes: [], width: 100.6 })

  expect(blob.type).toBe('image/svg+xml;charset=utf-8')
  await expect(blob.text()).resolves.toBe(
    '<svg xmlns="http://www.w3.org/2000/svg" width="101" height="50" viewBox="0 0 101 50"><rect width="101" height="50" fill="#ffffff"/></svg>',
  )
})

test('exports lines, rectangles, and escaped text without selection UI', () => {
  const svg = createSvg({
    height: 80,
    shapes: [
      {
        end: { x: 20, y: 30 },
        id: 0,
        start: { x: -5, y: 10 },
        type: 'line',
      },
      {
        end: { x: 50, y: 40 },
        id: 4,
        start: { x: 50, y: 40 },
        type: 'line',
      },
      {
        end: { x: 10, y: 20 },
        id: 1,
        start: { x: 40, y: 60 },
        type: 'rectangle',
      },
      {
        id: 2,
        point: { x: 12, y: 24 },
        text: 'A & <B>',
        type: 'text',
      },
      {
        id: 3,
        point: { x: 0, y: 0 },
        text: '',
        type: 'text',
      },
    ],
    width: 120,
  })

  expect(svg).toContain(
    '<line x1="-5" y1="10" x2="20" y2="30" fill="none" stroke="#202020" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  )
  expect(svg).toContain('<circle cx="50" cy="40" r="1.5" fill="#202020"/>')
  expect(svg).toContain(
    '<rect x="11" y="21" width="28" height="38" fill="none" stroke="#202020" stroke-width="2"/>',
  )
  expect(svg).toContain(
    '<text x="16" y="24" fill="#202020" font-family="sans-serif" font-size="18" dominant-baseline="middle" xml:space="preserve">A &amp; &lt;B&gt;</text>',
  )
  expect(svg).not.toContain('DrawShapeSelected')
})

test('rejects invalid dimensions', () => {
  expect(() => createSvg({ height: 10, shapes: [], width: 0 })).toThrow(
    'Drawing export width must be a positive number',
  )
  expect(() => createSvg({ height: NaN, shapes: [], width: 10 })).toThrow(
    'Drawing export height must be a positive number',
  )
})
