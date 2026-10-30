import { Shape } from "./Shape";
import { Line } from "./Line";
import { Ellipse } from "./Ellipse";

const CIRCLE_RADIUS = 6;

export class LineOO extends Shape {
  private readonly line = new Line();
  private readonly startCircle = new Ellipse();
  private readonly endCircle = new Ellipse();

  constructor() {
    super();
    const color = "#43e5f0";
    this.line.setStyle({ stroke: color, lineWidth: 1.5 });
    for (const circle of [this.startCircle, this.endCircle]) {
      circle.setStyle({ stroke: color, fill: "#e05aa6", lineWidth: 1.5 });
    }
  }

  set(x1: number, y1: number, x2: number, y2: number) {
    super.set(x1, y1, x2, y2);
    this.line.set(x1, y1, x2, y2);
    this.startCircle.set(x1, y1, x1 + CIRCLE_RADIUS, y1 + CIRCLE_RADIUS);
    this.endCircle.set(x2, y2, x2 + CIRCLE_RADIUS, y2 + CIRCLE_RADIUS);
  }

  show(ctx: CanvasRenderingContext2D): void {
    this.line.show(ctx);
    this.startCircle.show(ctx);
    this.endCircle.show(ctx);
  }

  getName(): string {
    return "Line with circles";
  }
}
