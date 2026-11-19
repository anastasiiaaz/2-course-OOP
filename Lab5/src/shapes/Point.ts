import { Shape } from "./Shape";
import type { Bounds } from "./Shape";
import type { Tool } from "../tools";

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

  getBounds(): Bounds {
    return { x: this.xs1 - 2, y: this.ys1 - 2, width: 4, height: 4 };
  }

  getType(): Tool {
    return "Point";
  }

  getName(): string {
    return "Point";
  }
}
