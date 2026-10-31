import { Shape } from "./Shape";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";

export interface CubeGeometry {
  front: { x: number; y: number; a: number };
  back: { x: number; y: number; a: number };
}

export function cubeGeometry(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): CubeGeometry {
  const size = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1));
  const bx = x2 >= x1 ? x1 : x1 - size;
  const by = y2 >= y1 ? y1 : y1 - size;
  const a = size / 1.3;
  const offset = size - a;
  return {
    front: { x: bx, y: by + offset, a },
    back: { x: bx + offset, y: by, a },
  };
}

export class Cube extends Shape {
  private readonly frontFace = new Rectangle();
  private readonly backFace = new Rectangle();
  private readonly edges = [new Line(), new Line(), new Line(), new Line()];

  constructor() {
    super();
    for (const face of [this.frontFace, this.backFace]) {
      face.setStyle({ stroke: "#6a1b9a", fill: null, lineWidth: 1.5 });
    }
    for (const edge of this.edges) {
      edge.setStyle({ stroke: "#ab47bc", lineWidth: 1.5 });
    }
  }

  set(x1: number, y1: number, x2: number, y2: number) {
    super.set(x1, y1, x2, y2);
    const { front: f, back: b } = cubeGeometry(x1, y1, x2, y2);

    this.frontFace.set(f.x, f.y, f.x + f.a, f.y + f.a);
    this.backFace.set(b.x, b.y, b.x + b.a, b.y + b.a);

    this.edges[0].set(f.x, f.y, b.x, b.y); // top-left
    this.edges[1].set(f.x + f.a, f.y, b.x + b.a, b.y); // top-right
    this.edges[2].set(f.x, f.y + f.a, b.x, b.y + b.a); // bottom-left
    this.edges[3].set(f.x + f.a, f.y + f.a, b.x + b.a, b.y + b.a); // bottom-right
  }

  show(ctx: CanvasRenderingContext2D): void {
    this.backFace.show(ctx);
    for (const edge of this.edges) edge.show(ctx);
    this.frontFace.show(ctx);
  }

  getName(): string {
    return "Cube";
  }
}
