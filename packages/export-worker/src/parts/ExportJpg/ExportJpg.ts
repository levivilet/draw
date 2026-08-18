import type { ExportDrawingOptions, Shape } from '../Types/Types.ts'
import {
  getArrowHeadPoints,
  getRectangleGeometry,
  normalizeDimensions,
  rectangleCornerRadius,
} from '../ExportSvg/ExportSvg.ts'

type CreateCanvas = (width: number, height: number) => OffscreenCanvas

const jpegMimeType = 'image/jpeg'
const jpegQuality = 0.92

const createCanvas = (width: number, height: number): OffscreenCanvas => {
  return new OffscreenCanvas(width, height)
}

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
const renderShape = (
  context: OffscreenCanvasRenderingContext2D,
  shape: Readonly<Shape>,
): void => {
  switch (shape.type) {
    case 'arrow': {
      const { left, right } = getArrowHeadPoints(shape)
      // Each arrow is an independent drawing shape, not a reusable path.
      context.beginPath()
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 3
      context.strokeStyle = '#202020'
      // eslint-disable-next-line unicorn/prefer-path2d
      context.moveTo(shape.start.x, shape.start.y)
      context.lineTo(shape.end.x, shape.end.y)
      context.moveTo(left.x, left.y)
      context.lineTo(shape.end.x, shape.end.y)
      context.lineTo(right.x, right.y)
      context.stroke()
      return
    }
    case 'circle': {
      const geometry = getRectangleGeometry(shape)
      context.beginPath()
      context.ellipse(
        geometry.x + geometry.width / 2,
        geometry.y + geometry.height / 2,
        geometry.width / 2,
        geometry.height / 2,
        0,
        0,
        Math.PI * 2,
      )
      context.lineWidth = 2
      context.strokeStyle = '#202020'
      context.stroke()
      return
    }
    case 'line':
      context.beginPath()
      if (shape.start.x === shape.end.x && shape.start.y === shape.end.y) {
        // Each point is an independent drawing shape, not a reusable path.
        // eslint-disable-next-line unicorn/prefer-path2d
        context.arc(shape.start.x, shape.start.y, 1.5, 0, Math.PI * 2)
        context.fillStyle = '#202020'
        context.fill()
        return
      }
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 3
      context.strokeStyle = '#202020'
      context.moveTo(shape.start.x, shape.start.y)
      context.lineTo(shape.end.x, shape.end.y)
      context.stroke()
      return
    case 'rectangle': {
      const geometry = getRectangleGeometry(shape)
      context.beginPath()
      context.roundRect(
        geometry.x,
        geometry.y,
        geometry.width,
        geometry.height,
        rectangleCornerRadius,
      )
      context.lineWidth = 2
      context.strokeStyle = '#202020'
      context.stroke()
      return
    }
    case 'triangle': {
      const geometry = getRectangleGeometry(shape)
      context.beginPath()
      // Each triangle is an independent drawing shape, not a reusable path.
      // eslint-disable-next-line unicorn/prefer-path2d
      context.moveTo(geometry.x + geometry.width / 2, geometry.y)
      context.lineTo(geometry.x + geometry.width, geometry.y + geometry.height)
      context.lineTo(geometry.x, geometry.y + geometry.height)
      context.closePath()
      context.lineJoin = 'round'
      context.lineWidth = 2
      context.strokeStyle = '#202020'
      context.stroke()
      return
    }
    case 'text':
      if (!shape.text) {
        return
      }
      context.fillStyle = '#202020'
      context.font = '18px sans-serif'
      context.textBaseline = 'middle'
      context.fillText(shape.text, shape.point.x + 4, shape.point.y)
  }
}
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const exportJpgWithDependencies = async (
  options: Omit<Readonly<ExportDrawingOptions>, 'format'>,
  createCanvasFn: CreateCanvas,
): Promise<Blob> => {
  const { height, width } = normalizeDimensions(options.width, options.height)
  const canvas = createCanvasFn(width, height)
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Failed to create a 2D canvas context for JPG export')
  }
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  for (const shape of options.shapes) {
    renderShape(context, shape)
  }
  const blob = await canvas.convertToBlob({
    quality: jpegQuality,
    type: jpegMimeType,
  })
  if (blob.type !== jpegMimeType) {
    throw new Error(`JPG encoding returned unexpected MIME type: ${blob.type}`)
  }
  return blob
}

export const exportJpg = (
  options: Omit<Readonly<ExportDrawingOptions>, 'format'>,
): Promise<Blob> => {
  return exportJpgWithDependencies(options, createCanvas)
}

export { jpegMimeType, jpegQuality }
