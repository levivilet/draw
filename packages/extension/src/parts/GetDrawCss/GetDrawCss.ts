import type {
  LineShape,
  RectangleShape,
  Shape,
  TextShape,
} from '../DrawState/DrawState.ts'

const getClassName = (id: number): string => {
  return `DrawShape${id}`
}

const getLineCss = ({ end, id, start }: Readonly<LineShape>): string => {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const length = Math.hypot(deltaX, deltaY)
  const angle = Math.atan2(deltaY, deltaX)
  return `.${getClassName(id)}{left:${start.x}px;top:${start.y}px;width:${length}px;transform:translateY(-50%) rotate(${angle}rad)}`
}

const getRectangleCss = ({
  end,
  id,
  start,
}: Readonly<RectangleShape>): string => {
  const left = Math.min(start.x, end.x)
  const top = Math.min(start.y, end.y)
  const width = Math.abs(end.x - start.x)
  const height = Math.abs(end.y - start.y)
  return `.${getClassName(id)}{left:${left}px;top:${top}px;width:${width}px;height:${height}px}`
}

const getTextCss = ({ id, point }: Readonly<TextShape>): string => {
  return `.${getClassName(id)}{left:${point.x}px;top:${point.y}px}`
}

export const getDrawCss = (shapes: readonly Readonly<Shape>[]): string => {
  return shapes
    .map((shape) => {
      switch (shape.type) {
        case 'line':
          return getLineCss(shape)
        case 'rectangle':
          return getRectangleCss(shape)
        case 'text':
          return getTextCss(shape)
      }
    })
    .join('')
}
