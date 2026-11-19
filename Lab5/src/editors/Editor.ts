export abstract class Editor {
  abstract getName(): string;
  abstract onLBDown(x: number, y: number): void;
  abstract onLBUp(x: number, y: number): void;
  abstract onMouseMove(x: number, y: number): void;
  abstract onPaint(ctx: CanvasRenderingContext2D): void;
}
