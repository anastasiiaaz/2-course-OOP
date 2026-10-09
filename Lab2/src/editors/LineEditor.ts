import type { Shape } from "../shapes/Shape";
import { Line } from "../shapes/Line";
import { ShapeEditor } from "./ShapeEditor";

export class LineEditor extends ShapeEditor {
  getName(): string {
    return "Line";
  }

  protected createShape(): Shape {
    return new Line();
  }

  protected strokeRubber(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.currentX, this.currentY);
    ctx.stroke();
  }
}
