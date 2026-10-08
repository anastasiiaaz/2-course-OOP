import { Shape } from "./Shape";

export class Rectangle extends Shape {
  show(ctx: CanvasRenderingContext2D): void {
    const centerX = this.xs1;
    const centerY = this.ys1;
    const cornerX = this.xs2;
    const cornerY = this.ys2;

    const width = Math.abs(cornerX - centerX) * 2;
    const height = Math.abs(cornerY - centerY) * 2;

    const x = centerX - width / 2;
    const y = centerY - height / 2;

    ctx.fillStyle = "rgb(132, 132, 132)";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.3;
    ctx.strokeRect(x, y, width, height);
  }

  getName(): string {
    return "Rectangle";
  }
}
