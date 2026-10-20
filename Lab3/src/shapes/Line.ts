import { Shape } from "./Shape";

export class Line extends Shape {
  show(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.xs1, this.ys1);
    ctx.lineTo(this.xs2, this.ys2);
    ctx.stroke();
  }

  getName(): string {
    return "Line";
  }
}
