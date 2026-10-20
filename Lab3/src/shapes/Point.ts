import { Shape } from "./Shape";

export class Point extends Shape {
  show(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.xs1, this.ys1, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  getName(): string {
    return "Point";
  }
}
