import type { Shape } from "../shapes/Shape";
import { Editor } from "./Editor";

export abstract class ShapeEditor extends Editor {
  protected startX = 0;
  protected startY = 0;
  protected currentX = 0;
  protected currentY = 0;
  protected isDrawing = false;

  protected shapes: (Shape | null)[];
  protected onFull: () => void;

  constructor(shapes: (Shape | null)[], onFull: () => void) {
    super();
    this.shapes = shapes;
    this.onFull = onFull;
  }

  protected abstract createShape(): Shape;

  protected abstract strokeRubber(ctx: CanvasRenderingContext2D): void;

  onLBDown(x: number, y: number): void {
    this.startX = this.currentX = x;
    this.startY = this.currentY = y;
    this.isDrawing = true;
  }

  onLBUp(x: number, y: number): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const shape = this.createShape();
    shape.set(this.startX, this.startY, x, y);
    this.addShape(shape);
  }

  onMouseMove(x: number, y: number): void {
    if (!this.isDrawing) return;
    this.currentX = x;
    this.currentY = y;
  }

  onPaint(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const shape of this.shapes) {
      if (shape === null) break;
      shape.show(ctx);
    }

    if (this.isDrawing) {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      this.strokeRubber(ctx);
      ctx.restore();
    }
  }

  protected addShape(shape: Shape): void {
    const index = this.shapes.indexOf(null);
    if (index === -1) {
      this.onFull();
      return;
    }
    this.shapes[index] = shape;
  }
}
