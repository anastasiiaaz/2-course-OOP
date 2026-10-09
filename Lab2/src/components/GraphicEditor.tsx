import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { Shape } from "../shapes/Shape";
import type { Editor } from "../editors/Editor";
import type { ShapeEditor } from "../editors/ShapeEditor";
import { PointEditor } from "../editors/PointEditor";
import { LineEditor } from "../editors/LineEditor";
import { RectEditor } from "../editors/RectEditor";
import { EllipseEditor } from "../editors/EllipseEditor";
import MenuBar from "./MenuBar";
import type { Tool } from "./MenuBar";
import Canvas from "./Canvas";
import ModalWindow from "./ModalWindow";

const MAX_SHAPES = 111;

type EditorClass = new (
  shapes: (Shape | null)[],
  onFull: () => void,
) => ShapeEditor;

const EDITORS: Record<Tool, EditorClass> = {
  Point: PointEditor,
  Line: LineEditor,
  Rectangle: RectEditor,
  Ellipse: EllipseEditor,
};

interface ModalState {
  title: string;
  body: ReactNode;
}

export default function GraphicEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes] = useState<(Shape | null)[]>(() =>
    new Array(MAX_SHAPES).fill(null),
  );
  const [modal, setModal] = useState<ModalState | null>(null);

  const onFull = () =>
    setModal({
      title: "error",
      body: (
        <p>Масив заповнений ({MAX_SHAPES} об'єктів). Новий об'єкт не додано.</p>
      ),
    });

  const [editor, setEditor] = useState<Editor>(
    () => new PointEditor(shapes, onFull),
  );

  useEffect(() => {
    document.title = `OOP_lab2 — ${editor.getName()}`;
  }, [editor]);

  const repaint = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) editor.onPaint(ctx);
  };

  useEffect(repaint, [editor]);

  const handle =
    (action: (x: number, y: number) => void) =>
    (e: PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      action(e.clientX - rect.left, e.clientY - rect.top);
      repaint();
    };

  const selectTool = (tool: Tool) =>
    setEditor(new EDITORS[tool](shapes, onFull));

  const clear = () => {
    shapes.fill(null);
    repaint();
  };

  const showAbout = () =>
    setModal({
      title: "Варіант 11",
      body: (
        <>
          <h4>Масив</h4>
          <p>статичний, N = 111</p>
          <h4>Гумовий слід</h4>
          <p>пунктирна лінія чорного кольору</p>
          <h4>Прямокутник</h4>
          <p>
            Ввід: від центру до одного з кутів
            <br />
            Відображення: чорний контур з кольоровим заповненням
            <br />
            Колір заповнення: сірий
          </p>
          <h4>Еліпс</h4>
          <p>
            Ввід: по двох протилежних кутах охоплюючого прямокутника
            <br />
            Відображення: чорний контур з білим заповненням
          </p>
          <h4>Позначка поточного типу об'єкта</h4>
          <p>в заголовку вікна</p>
        </>
      ),
    });

  return (
    <div className="editor-container">
      <MenuBar onSelectTool={selectTool} onClear={clear} onAbout={showAbout} />

      <Canvas
        width={900}
        height={700}
        canvasRef={canvasRef}
        onPointerDown={handle((x, y) => editor.onLBDown(x, y))}
        onPointerUp={handle((x, y) => editor.onLBUp(x, y))}
        onPointerMove={handle((x, y) => editor.onMouseMove(x, y))}
      />

      <ModalWindow
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.title ?? ""}
      >
        {modal?.body}
      </ModalWindow>
    </div>
  );
}
