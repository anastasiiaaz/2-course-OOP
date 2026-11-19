import type { Shape } from "../shapes/Shape";
import { Cube, cubeGeometry } from "../shapes/Cube";
import { ShapeEditor } from "./ShapeEditor";

export class CubeEditor extends ShapeEditor {
  getName(): string {
    return "Cube";
  }

  protected createShape(): Shape {
    return new Cube();
  }

  protected strokeRubber(ctx: CanvasRenderingContext2D): void {
    const { front: f, back: b } = cubeGeometry(
      this.startX,
      this.startY,
      this.currentX,
      this.currentY,
    );

    ctx.strokeRect(f.x, f.y, f.a, f.a);
    ctx.strokeRect(b.x, b.y, b.a, b.a);

    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(b.x, b.y);
    ctx.moveTo(f.x + f.a, f.y);
    ctx.lineTo(b.x + b.a, b.y);
    ctx.moveTo(f.x, f.y + f.a);
    ctx.lineTo(b.x, b.y + b.a);
    ctx.moveTo(f.x + f.a, f.y + f.a);
    ctx.lineTo(b.x + b.a, b.y + b.a);
    ctx.stroke();
  }
}
