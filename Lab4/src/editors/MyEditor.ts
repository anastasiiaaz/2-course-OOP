import type { Shape } from "../shapes/Shape";
import type { Tool } from "../tools";
import type { Editor } from "./Editor";
import type { ShapeEditor } from "./ShapeEditor";
import { PointEditor } from "./PointEditor";
import { LineEditor } from "./LineEditor";
import { RectEditor } from "./RectEditor";
import { EllipseEditor } from "./EllipseEditor";
import { LineOOEditor } from "./LineOOEditor";
import { CubeEditor } from "./CubeEditor";

const MAX_SHAPES = 112;

type EditorClass = new (
  shapes: (Shape | null)[],
  onFull: () => void,
) => ShapeEditor;

const EDITORS: Record<Tool, EditorClass> = {
  Point: PointEditor,
  Line: LineEditor,
  Rectangle: RectEditor,
  Ellipse: EllipseEditor,
  LineOO: LineOOEditor,
  Cube: CubeEditor,
};

class MyEditor {
  private readonly shapes: (Shape | null)[] = new Array(MAX_SHAPES).fill(null);
  private tool: Tool = "Point";
  private editor: Editor;
  private fullHandler: () => void = () => {};

  constructor() {
    this.editor = this.createEditor(this.tool);
  }

  private createEditor(tool: Tool): Editor {
    return new EDITORS[tool](this.shapes, () => this.fullHandler());
  }

  get maxShapes(): number {
    return MAX_SHAPES;
  }

  getTool(): Tool {
    return this.tool;
  }

  setFullHandler(handler: () => void): void {
    this.fullHandler = handler;
  }

  start(tool: Tool): void {
    this.tool = tool;
    this.editor = this.createEditor(tool);
  }

  clear(): void {
    this.shapes.fill(null);
  }

  onLBDown(x: number, y: number): void {
    this.editor.onLBDown(x, y);
  }

  onLBUp(x: number, y: number): void {
    this.editor.onLBUp(x, y);
  }

  onMouseMove(x: number, y: number): void {
    this.editor.onMouseMove(x, y);
  }

  onPaint(ctx: CanvasRenderingContext2D): void {
    this.editor.onPaint(ctx);
  }
}

export const myEditor = new MyEditor();
