import type {
  CircleShape,
  ExportDimensions,
  ExportDrawingOptions,
  RectangleShape,
  Shape,
  TriangleShape,
} from '../Types/Types.ts'

const background = '#ffffff'
const foreground = '#202020'

const normalizeDimensions = (
  width: number,
  height: number,
): ExportDimensions => {
  if (!Number.isFinite(width) || width <= 0) {
    throw new RangeError('Drawing export width must be a positive number')
  }
  if (!Number.isFinite(height) || height <= 0) {
    throw new RangeError('Drawing export height must be a positive number')
  }
  return {
    height: Math.max(1, Math.round(height)),
    width: Math.max(1, Math.round(width)),
  }
}

const escapeXml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const getRectangleGeometry = (
  shape: Readonly<CircleShape | RectangleShape | TriangleShape>,
): {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
} => {
  const outerWidth = Math.max(2, Math.abs(shape.end.x - shape.start.x))
  const outerHeight = Math.max(2, Math.abs(shape.end.y - shape.start.y))
  return {
    height: Math.max(0, outerHeight - 2),
    width: Math.max(0, outerWidth - 2),
    x: Math.min(shape.start.x, shape.end.x) + 1,
    y: Math.min(shape.start.y, shape.end.y) + 1,
  }
}

const renderShape = (shape: Readonly<Shape>): string => {
  switch (shape.type) {
    case 'circle': {
      const { height, width, x, y } = getRectangleGeometry(shape)
      return `<ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="none" stroke="${foreground}" stroke-width="2"/>`
    }
    case 'line': {
      if (shape.start.x === shape.end.x && shape.start.y === shape.end.y) {
        return `<circle cx="${shape.start.x}" cy="${shape.start.y}" r="1.5" fill="${foreground}"/>`
      }
      return `<line x1="${shape.start.x}" y1="${shape.start.y}" x2="${shape.end.x}" y2="${shape.end.y}" fill="none" stroke="${foreground}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    }
    case 'rectangle': {
      const { height, width, x, y } = getRectangleGeometry(shape)
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${foreground}" stroke-width="2"/>`
    }
    case 'text':
      if (!shape.text) {
        return ''
      }
      return `<text x="${shape.point.x + 4}" y="${shape.point.y}" fill="${foreground}" font-family="sans-serif" font-size="18" dominant-baseline="middle" xml:space="preserve">${escapeXml(shape.text)}</text>`
    case 'triangle': {
      const { height, width, x, y } = getRectangleGeometry(shape)
      return `<polygon points="${x + width / 2},${y} ${x + width},${y + height} ${x},${y + height}" fill="none" stroke="${foreground}" stroke-width="2" stroke-linejoin="round"/>`
    }
  }
}

export const createSvg = (
  options: Omit<Readonly<ExportDrawingOptions>, 'format'>,
): string => {
  const { height, width } = normalizeDimensions(options.width, options.height)
  const shapes = options.shapes.map(renderShape).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${background}"/>${shapes}</svg>`
}

export const exportSvg = (
  options: Omit<Readonly<ExportDrawingOptions>, 'format'>,
): Blob => {
  return new Blob([createSvg(options)], {
    type: 'image/svg+xml;charset=utf-8',
  })
}

export { getRectangleGeometry, normalizeDimensions }
