import type { PointerEvent, RefObject } from "react";

interface CanvasProps {
  width: number;
  height: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLCanvasElement>) => void;
}

export default function Canvas({
  width,
  height,
  canvasRef,
  onPointerDown,
  onPointerUp,
  onPointerMove,
}: CanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="editor-canvas"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onPointerDown(e);
      }}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    />
  );
}
