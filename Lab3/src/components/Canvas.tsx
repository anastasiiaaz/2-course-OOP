import { Component } from "react";
import type { PointerEvent, RefObject } from "react";

interface CanvasProps {
  width: number;
  height: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLCanvasElement>) => void;
}

export default class Canvas extends Component<CanvasProps> {
  onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    this.props.onPointerDown(e);
  };

  render() {
    const { width, height, canvasRef, onPointerUp, onPointerMove } =
      this.props;

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="editor-canvas"
        onPointerDown={this.onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      />
    );
  }
}
