import { Shape } from "./Shape";

export class Rectangle extends Shape {
  show(ctx: CanvasRenderingContext2D): void {
    const x = Math.min(this.xs1, this.xs2);
    const y = Math.min(this.ys1, this.ys2);
    const width = Math.abs(this.xs2 - this.xs1);
    const height = Math.abs(this.ys2 - this.ys1);

    ctx.fillStyle = "yellow";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.3;
    ctx.strokeRect(x, y, width, height);
  }

  getName(): string {
    return "Rectangle";
  }
}
