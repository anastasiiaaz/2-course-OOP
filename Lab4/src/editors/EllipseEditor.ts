import type { Shape } from "../shapes/Shape";
import { Ellipse } from "../shapes/Ellipse";
import { ShapeEditor } from "./ShapeEditor";

export class EllipseEditor extends ShapeEditor {
  getName(): string {
    return "Ellipse";
  }

  protected createShape(): Shape {
    return new Ellipse();
  }

  protected strokeRubber(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.ellipse(
      this.startX,
      this.startY,
      Math.abs(this.currentX - this.startX),
      Math.abs(this.currentY - this.startY),
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
}
