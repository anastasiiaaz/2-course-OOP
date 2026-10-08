import { Shape } from "./Shape";

export class Ellipse extends Shape {
  show(ctx: CanvasRenderingContext2D): void {
    const x = Math.min(this.xs1, this.xs2);
    const y = Math.min(this.ys1, this.ys2);
    const width = Math.abs(this.xs2 - this.xs1);
    const height = Math.abs(this.ys2 - this.ys1);

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

    ctx.fillStyle = "white";
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  getName(): string {
    return "Ellipse";
  }
}
