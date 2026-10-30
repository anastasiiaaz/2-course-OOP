import { Shape } from "./Shape";

export class Line extends Shape {
  constructor() {
    super({ stroke: "black", lineWidth: 1 });
  }

  show(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = this.style.stroke;
    ctx.lineWidth = this.style.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.xs1, this.ys1);
    ctx.lineTo(this.xs2, this.ys2);
    ctx.stroke();
    ctx.restore();
  }

  getName(): string {
    return "Line";
  }
}
