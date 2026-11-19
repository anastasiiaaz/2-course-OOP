import type { Shape } from "../shapes/Shape";
import { Point } from "../shapes/Point";
import { ShapeEditor } from "./ShapeEditor";

export class PointEditor extends ShapeEditor {
  getName(): string {
    return "Point";
  }

  protected createShape(): Shape {
    return new Point();
  }

  protected strokeRubber(): void {}

  onLBDown(x: number, y: number): void {
    const point = this.createShape();
    point.set(x, y, x, y);
    this.addShape(point);
  }
}
