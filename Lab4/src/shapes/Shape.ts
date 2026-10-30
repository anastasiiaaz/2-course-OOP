export interface ShapeStyle {
  stroke: string;
  fill: string | null;
  lineWidth: number;
}

export abstract class Shape {
  protected xs1 = 0;
  protected ys1 = 0;
  protected xs2 = 0;
  protected ys2 = 0;
  protected style: ShapeStyle;

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

  abstract show(ctx: CanvasRenderingContext2D): void;
  abstract getName(): string;
}
