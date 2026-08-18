import { expect, jest, test } from '@jest/globals'
import { exportJpgWithDependencies } from '../src/parts/ExportJpg/ExportJpg.ts'

interface Fixture {
  readonly canvas: OffscreenCanvas
  readonly context: OffscreenCanvasRenderingContext2D
  readonly convertToBlob: ReturnType<
    typeof jest.fn<(options?: Readonly<ImageEncodeOptions>) => Promise<Blob>>
  >
  readonly createCanvas: ReturnType<
    typeof jest.fn<(width: number, height: number) => OffscreenCanvas>
  >
}

const createFixture = (
  blob = new Blob(['jpg'], { type: 'image/jpeg' }),
): Fixture => {
  const context = {
    arc: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    ellipse: jest.fn(),
    fill: jest.fn(),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    roundRect: jest.fn(),
    stroke: jest.fn(),
  } as unknown as OffscreenCanvasRenderingContext2D
  const convertToBlob = jest.fn<
    (options?: Readonly<ImageEncodeOptions>) => Promise<Blob>
  >(async () => blob)
  const canvas = {
    convertToBlob,
    getContext: jest.fn(() => context),
  } as unknown as OffscreenCanvas
  const createCanvas = jest.fn<
    (width: number, height: number) => OffscreenCanvas
  >(() => canvas)
  return { canvas, context, convertToBlob, createCanvas }
}

test('draws a white background and every supported shape', async () => {
  const { context, convertToBlob, createCanvas } = createFixture()
  const shapes = [
    {
      end: { x: 20, y: 30 },
      id: 0,
      start: { x: 1, y: 2 },
      type: 'line' as const,
    },
    {
      end: { x: 21, y: 40 },
      id: 7,
      start: { x: 1, y: 40 },
      type: 'arrow' as const,
    },
    {
      end: { x: 8, y: 9 },
      id: 4,
      start: { x: 8, y: 9 },
      type: 'line' as const,
    },
    {
      end: { x: 10, y: 20 },
      id: 1,
      start: { x: 40, y: 60 },
      type: 'rectangle' as const,
    },
    {
      end: { x: 70, y: 60 },
      id: 5,
      start: { x: 40, y: 20 },
      type: 'circle' as const,
    },
    {
      end: { x: 100, y: 60 },
      id: 6,
      start: { x: 80, y: 20 },
      type: 'triangle' as const,
    },
    {
      id: 2,
      point: { x: 12, y: 24 },
      text: 'Hello',
      type: 'text' as const,
    },
    {
      id: 3,
      point: { x: 0, y: 0 },
      text: '',
      type: 'text' as const,
    },
  ]

  const blob = await exportJpgWithDependencies(
    { height: 50.4, shapes, width: 100.6 },
    createCanvas,
  )

  expect(blob.type).toBe('image/jpeg')
  expect(createCanvas).toHaveBeenCalledWith(101, 50)
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 101, 50)
  expect(context.moveTo).toHaveBeenCalledWith(1, 2)
  expect(context.lineTo).toHaveBeenCalledWith(20, 30)
  expect(context.moveTo).toHaveBeenCalledWith(1, 40)
  expect(context.lineTo).toHaveBeenCalledWith(21, 40)
  expect(context.moveTo).toHaveBeenCalledWith(10.607695154586736, 46)
  expect(context.lineTo).toHaveBeenCalledWith(10.607695154586736, 34)
  expect(context.arc).toHaveBeenCalledWith(8, 9, 1.5, 0, Math.PI * 2)
  expect(context.fill).toHaveBeenCalledTimes(1)
  expect(context.roundRect).toHaveBeenCalledWith(11, 21, 28, 38, 8)
  expect(context.ellipse).toHaveBeenCalledWith(
    55,
    40,
    14,
    19,
    0,
    0,
    Math.PI * 2,
  )
  expect(context.moveTo).toHaveBeenCalledWith(90, 21)
  expect(context.lineTo).toHaveBeenCalledWith(99, 59)
  expect(context.lineTo).toHaveBeenCalledWith(81, 59)
  expect(context.closePath).toHaveBeenCalledTimes(1)
  expect(context.fillText).toHaveBeenCalledTimes(1)
  expect(context.fillText).toHaveBeenCalledWith('Hello', 16, 24)
  expect(convertToBlob).toHaveBeenCalledWith({
    quality: 0.92,
    type: 'image/jpeg',
  })
})

test('throws when a canvas context is unavailable', async () => {
  const canvas = {
    getContext: jest.fn(() => null),
  } as unknown as OffscreenCanvas

  await expect(
    exportJpgWithDependencies(
      { height: 10, shapes: [], width: 10 },
      () => canvas,
    ),
  ).rejects.toThrow('Failed to create a 2D canvas context for JPG export')
})

test('propagates encoding failures and rejects unexpected MIME types', async () => {
  const failed = createFixture()
  failed.convertToBlob.mockRejectedValue(new Error('encoding failed'))
  await expect(
    exportJpgWithDependencies(
      { height: 10, shapes: [], width: 10 },
      failed.createCanvas,
    ),
  ).rejects.toThrow('encoding failed')

  const wrongType = createFixture(new Blob(['png'], { type: 'image/png' }))
  await expect(
    exportJpgWithDependencies(
      { height: 10, shapes: [], width: 10 },
      wrongType.createCanvas,
    ),
  ).rejects.toThrow('JPG encoding returned unexpected MIME type: image/png')
})
