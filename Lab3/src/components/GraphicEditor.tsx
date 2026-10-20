import { Component, createRef } from "react";
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
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import ModalWindow from "./ModalWindow";

const MAX_SHAPES = 112; 

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

interface GraphicEditorState {
  tool: Tool;
  editor: Editor;
  modal: ModalState | null;
}

export default class GraphicEditor extends Component<
  object,
  GraphicEditorState
> {
  private canvasRef = createRef<HTMLCanvasElement>();

  private shapes: (Shape | null)[] = new Array(MAX_SHAPES).fill(null);

  onFull = () =>
    this.setState({
      modal: {
        title: "error",
        body: (
          <p>
            Масив заповнений ({MAX_SHAPES} об'єктів). Новий об'єкт не додано.
          </p>
        ),
      },
    });

  state: GraphicEditorState = {
    tool: "Point",
    editor: new PointEditor(this.shapes, this.onFull),
    modal: null,
  };

  componentDidMount() {
    this.onPaint();
  }

  componentDidUpdate(_prevProps: object, prevState: GraphicEditorState) {
    if (prevState.editor !== this.state.editor) this.onPaint();
  }

  onSelectTool = (tool: Tool) =>
    this.setState({
      tool,
      editor: new EDITORS[tool](this.shapes, this.onFull),
    });

  onClear = () => {
    this.shapes.fill(null);
    this.onPaint();
  };

  onInitMenuPopup = (): Tool => this.state.tool;

  onNotify = (tool: Tool): string => tool;

  onAbout = () =>
    this.setState({
      modal: {
        title: "Варіант 12",
        body: (
          <>
            <h4>Масив</h4>
            <p>динамічний, N = 112</p>
            <h4>Гумовий слід</h4>
            <p>суцільна лінія чорного кольору</p>
            <h4>Прямокутник</h4>
            <p>
              Ввід: по двох протилежних кутах
              <br />
              Відображення: чорний контур з кольоровим заповненням
              <br />
              Колір заповнення: жовтий
            </p>
            <h4>Еліпс</h4>
            <p>
              Ввід: від центру до одного з кутів охоплюючого прямокутника
              <br />
              Відображення: чорний контур без заповнення
            </p>
            <h4>Позначка поточного типу об'єкта</h4>
            <p>в меню</p>
          </>
        ),
      },
    });

  onCloseModal = () => this.setState({ modal: null });

  private position(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  onLBDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = this.position(e);
    this.state.editor.onLBDown(x, y);
    this.onPaint();
  };

  onLBUp = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = this.position(e);
    this.state.editor.onLBUp(x, y);
    this.onPaint();
  };

  onMouseMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = this.position(e);
    this.state.editor.onMouseMove(x, y);
    this.onPaint();
  };

  onPaint = () => {
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) this.state.editor.onPaint(ctx);
  };

  render() {
    const { tool, modal } = this.state;

    return (
      <div className="editor-container">
        <MenuBar
          onSelectTool={this.onSelectTool}
          onClear={this.onClear}
          onAbout={this.onAbout}
          onInitMenuPopup={this.onInitMenuPopup}
        />

        <Toolbar
          activeTool={tool}
          onSelectTool={this.onSelectTool}
          onNotify={this.onNotify}
        />

        <Canvas
          width={900}
          height={700}
          canvasRef={this.canvasRef}
          onPointerDown={this.onLBDown}
          onPointerUp={this.onLBUp}
          onPointerMove={this.onMouseMove}
        />

        <ModalWindow
          isOpen={modal !== null}
          onClose={this.onCloseModal}
          title={modal?.title ?? ""}
        >
          {modal?.body}
        </ModalWindow>
      </div>
    );
  }
}
