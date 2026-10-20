import { Shape } from "./Shape";

export class Ellipse extends Shape {
  show(ctx: CanvasRenderingContext2D): void {
    const radiusX = Math.abs(this.xs2 - this.xs1);
    const radiusY = Math.abs(this.ys2 - this.ys1);

    ctx.beginPath();
    ctx.ellipse(this.xs1, this.ys1, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  getName(): string {
    return "Ellipse";
  }
}
