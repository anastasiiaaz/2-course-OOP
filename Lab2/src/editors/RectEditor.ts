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
    const width = Math.abs(this.currentX - this.startX) * 2;
    const height = Math.abs(this.currentY - this.startY) * 2;
    ctx.strokeRect(
      this.startX - width / 2,
      this.startY - height / 2,
      width,
      height,
    );
  }
}
