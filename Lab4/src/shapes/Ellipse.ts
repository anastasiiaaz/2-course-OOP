import { Shape } from "./Shape";

export class Ellipse extends Shape {
  constructor() {
    super({ stroke: "black", fill: null, lineWidth: 1.5 });
  }

  show(ctx: CanvasRenderingContext2D): void {
    const radiusX = Math.abs(this.xs2 - this.xs1);
    const radiusY = Math.abs(this.ys2 - this.ys1);

    ctx.save();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.ellipse(this.xs1, this.ys1, radiusX, radiusY, 0, 0, Math.PI * 2);
    if (this.style.fill) {
      ctx.fillStyle = this.style.fill;
      ctx.fill();
    }
    ctx.strokeStyle = this.style.stroke;
    ctx.lineWidth = this.style.lineWidth;
    ctx.stroke();
    ctx.restore();
  }

  getName(): string {
    return "Ellipse";
  }
}
