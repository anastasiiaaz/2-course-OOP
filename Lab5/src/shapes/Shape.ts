import type { Tool } from "../tools";

export interface ShapeStyle {
  stroke: string;
  fill: string | null;
  lineWidth: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export abstract class Shape {
  protected xs1 = 0;
  protected ys1 = 0;
  protected xs2 = 0;
  protected ys2 = 0;
  protected style: ShapeStyle;
  protected selected = false;

  constructor(style: Partial<ShapeStyle> = {}) {
    this.style = { stroke: "black", fill: null, lineWidth: 1, ...style };
  }

  set(x1: number, y1: number, x2: number, y2: number) {
    this.xs1 = x1;
    this.ys1 = y1;
    this.xs2 = x2;
    this.ys2 = y2;
  }

  setStyle(style: Partial<ShapeStyle>) {
    this.style = { ...this.style, ...style };
  }

  getCoords(): [number, number, number, number] {
    return [this.xs1, this.ys1, this.xs2, this.ys2];
  }

  getBounds(): Bounds {
    return {
      x: Math.min(this.xs1, this.xs2),
      y: Math.min(this.ys1, this.ys2),
      width: Math.abs(this.xs2 - this.xs1),
      height: Math.abs(this.ys2 - this.ys1),
    };
  }

  setSelected(selected: boolean) {
    this.selected = selected;
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.show(ctx);
    if (this.selected) this.drawSelection(ctx);
  }

  protected drawSelection(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this.getBounds();
    const pad = 5;

    ctx.save();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(229, 57, 53, 0.08)";
    ctx.fillRect(x - pad, y - pad, width + 2 * pad, height + 2 * pad);
    ctx.strokeStyle = "#e53935";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - pad, y - pad, width + 2 * pad, height + 2 * pad);
    ctx.restore();
  }

  abstract show(ctx: CanvasRenderingContext2D): void;
  abstract getName(): string;
  abstract getType(): Tool;
}
