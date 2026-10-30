import { Shape } from "./Shape";

export class Point extends Shape {
  constructor() {
    super({ fill: "black" });
  }

  show(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.style.fill ?? "black";
    ctx.beginPath();
    ctx.arc(this.xs1, this.ys1, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  getName(): string {
    return "Point";
  }
}
