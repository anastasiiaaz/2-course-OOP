import { Shape } from "./Shape";

export class Rectangle extends Shape {
  constructor() {
    super({ stroke: "black", fill: "yellow", lineWidth: 1.3 });
  }

  show(ctx: CanvasRenderingContext2D): void {
    const x = Math.min(this.xs1, this.xs2);
    const y = Math.min(this.ys1, this.ys2);
    const width = Math.abs(this.xs2 - this.xs1);
    const height = Math.abs(this.ys2 - this.ys1);

    ctx.save();
    ctx.setLineDash([]);
    if (this.style.fill) {
      ctx.fillStyle = this.style.fill;
      ctx.fillRect(x, y, width, height);
    }
    ctx.strokeStyle = this.style.stroke;
    ctx.lineWidth = this.style.lineWidth;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  getName(): string {
    return "Rectangle";
  }
}
