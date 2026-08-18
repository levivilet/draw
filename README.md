# builtindraw

Whiteboard extension for Lvce Editor with a compact, floating tool palette.
Create lines, arrows, rectangles, circles, and triangles by dragging, place text with a click, or
use the cursor to select and move shapes. Use **Clear** to reset the whiteboard.

Right-click the whiteboard and choose **Export As…** to download the current
drawing as SVG or JPG.

Choose **Save drawing** in the toolbar or **Save As…** in the context menu to
save an editable `drawing.draw` file. The format is versioned, indented JSON so
changes are easy to review in Git. Shape records use tldraw v1-style fields such
as string IDs, points, sizes, and line or arrow handles; `.draw` files are LVCE Draw files
and are not intended to be directly interchangeable with tldraw documents.

## Development

```sh
npm ci
npm run build
npm test
```
