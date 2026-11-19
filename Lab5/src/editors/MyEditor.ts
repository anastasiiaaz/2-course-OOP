import type { Shape } from "../shapes/Shape";
import type { ShapeRecord } from "../shapes/ShapeRecord";
import { createShape } from "../shapes/ShapeFactory";
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
  onChange: () => void,
) => ShapeEditor;

const EDITORS: Record<Tool, EditorClass> = {
  Point: PointEditor,
  Line: LineEditor,
  Rectangle: RectEditor,
  Ellipse: EllipseEditor,
  LineOO: LineOOEditor,
  Cube: CubeEditor,
};

export type ChangeListener = () => void;

export class MyEditor {
  private static instance: MyEditor | undefined;

  static getInstance(): MyEditor {
    MyEditor.instance ??= new MyEditor();
    return MyEditor.instance;
  }

  private readonly shapes: (Shape | null)[] = new Array(MAX_SHAPES).fill(null);
  private readonly listeners = new Set<ChangeListener>();
  private tool: Tool = "Point";
  private editor: Editor;
  private selected: number | null = null;
  private fullHandler: () => void = () => {};

  private constructor() {
    this.editor = this.createEditor(this.tool);
  }

  private createEditor(tool: Tool): Editor {
    return new EDITORS[tool](
      this.shapes,
      () => this.fullHandler(),
      () => this.notify(),
    );
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

  subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of [...this.listeners]) listener();
  }

  private count(): number {
    const index = this.shapes.indexOf(null);
    return index === -1 ? MAX_SHAPES : index;
  }

  getRecords(): ShapeRecord[] {
    const records: ShapeRecord[] = [];
    for (const shape of this.shapes) {
      if (shape === null) break;
      const [x1, y1, x2, y2] = shape.getCoords();
      records.push({ type: shape.getType(), x1, y1, x2, y2 });
    }
    return records;
  }

  getSelected(): number | null {
    return this.selected;
  }

  private applySelection(index: number | null): void {
    this.selected = index;
    this.shapes.forEach((shape, i) => shape?.setSelected(i === index));
  }

  select(index: number | null): void {
    const valid = index !== null && index >= 0 && index < this.count();
    const next = valid ? index : null;
    if (next === this.selected) return;
    this.applySelection(next);
    this.notify();
  }

  remove(index: number): void {
    if (index < 0 || index >= this.count()) return;

    this.shapes.splice(index, 1);
    this.shapes.push(null);

    const left = this.count();
    this.applySelection(left === 0 ? null : Math.min(index, left - 1));
    this.notify();
  }

  clear(): void {
    this.shapes.fill(null);
    this.applySelection(null);
    this.notify();
  }

  load(records: ShapeRecord[]): number {
    this.shapes.fill(null);
    const loaded = records.slice(0, MAX_SHAPES);
    loaded.forEach((record, i) => {
      this.shapes[i] = createShape(record);
    });
    this.applySelection(null);
    this.notify();
    return loaded.length;
  }

  start(tool: Tool): void {
    this.tool = tool;
    this.editor = this.createEditor(tool);
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
