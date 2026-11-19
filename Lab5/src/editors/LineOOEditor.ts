import type { Shape } from "../shapes/Shape";
import { LineOO } from "../shapes/LineOO";
import { ShapeEditor } from "./ShapeEditor";

export class LineOOEditor extends ShapeEditor {
  getName(): string {
    return "Line with circles";
  }

  protected createShape(): Shape {
    return new LineOO();
  }

  protected strokeRubber(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.currentX, this.currentY);
    ctx.stroke();
  }
}
