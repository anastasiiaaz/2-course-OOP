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
    const x = Math.min(this.startX, this.currentX);
    const y = Math.min(this.startY, this.currentY);
    const width = Math.abs(this.currentX - this.startX);
    const height = Math.abs(this.currentY - this.startY);

    ctx.beginPath();
    ctx.ellipse(
      x + width / 2,
      y + height / 2,
      width / 2,
      height / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
}
