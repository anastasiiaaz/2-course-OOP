import { Component, createRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { myEditor } from "../editors/MyEditor";
import { TOOL_LABELS } from "../tools";
import type { Tool } from "../tools";
import MenuBar from "./MenuBar";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import ModalWindow from "./ModalWindow";

interface ModalState {
  title: string;
  body: ReactNode;
}

interface GraphicEditorState {
  tool: Tool;
  modal: ModalState | null;
}

export default class GraphicEditor extends Component<
  object,
  GraphicEditorState
> {
  private canvasRef = createRef<HTMLCanvasElement>();

  state: GraphicEditorState = {
    tool: myEditor.getTool(),
    modal: null,
  };

  onFull = () =>
    this.setState({
      modal: {
        title: "error",
        body: (
          <p>
            Масив заповнений ({myEditor.maxShapes} об'єктів). Новий об'єкт не
            додано.
          </p>
        ),
      },
    });

  componentDidMount() {
    myEditor.setFullHandler(this.onFull);
    this.onPaint();
  }

  componentWillUnmount() {
    myEditor.setFullHandler(() => {});
  }

  onSelectTool = (tool: Tool) => {
    myEditor.start(tool);
    this.setState({ tool }, this.onPaint);
  };

  onClear = () => {
    myEditor.clear();
    this.onPaint();
  };

  onInitMenuPopup = (): Tool => myEditor.getTool();

  onNotify = (tool: Tool): string => TOOL_LABELS[tool];

  onAbout = () =>
    this.setState({
      modal: {
        title: "Варіант 11",
        body: (
          <>
            <h4>Редактор</h4>
            <p>глобальний статичний об'єкт класу MyEditor</p>
            <h4>Масив</h4>
            <p>N = {myEditor.maxShapes}</p>
            <h4>Гумовий слід</h4>
            <p>пунктирна лінія чорного кольору (для всіх фігур)</p>
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
            <h4>Лінія з кружечками</h4>
            <p>
              Ввід: від початкової до кінцевої точки
              <br />
              Відображення: синя лінія та два кружечки на кінцях
              (помаранчеве заповнення)
              <br />
              Реалізація: композиція Line + Ellipse
            </p>
            <h4>Каркас куба</h4>
            <p>
              Ввід: по діагоналі охоплюючого квадрата
              <br />
              Відображення: два фіолетові квадрати та чотири ребра
              <br />
              Реалізація: композиція Rectangle + Line
            </p>
            <h4>Позначка поточного типу об'єкта</h4>
            <p>в меню та на панелі інструментів</p>
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
    myEditor.onLBDown(x, y);
    this.onPaint();
  };

  onLBUp = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = this.position(e);
    myEditor.onLBUp(x, y);
    this.onPaint();
  };

  onMouseMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = this.position(e);
    myEditor.onMouseMove(x, y);
    this.onPaint();
  };

  onPaint = () => {
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) myEditor.onPaint(ctx);
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
