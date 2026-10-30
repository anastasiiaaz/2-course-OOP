import type { Shape } from "../shapes/Shape";
import { Rectangle } from "../shapes/Rectangle";
import { ShapeEditor } from "./ShapeEditor";

export class RectEditor extends ShapeEditor {
  getName(): string {
    return "Rectangle";
  }

  protected createShape(): Shape {
    return new Rectangle();
  }

  protected strokeRubber(ctx: CanvasRenderingContext2D): void {
    ctx.strokeRect(
      Math.min(this.startX, this.currentX),
      Math.min(this.startY, this.currentY),
      Math.abs(this.currentX - this.startX),
      Math.abs(this.currentY - this.startY),
    );
  }
}
