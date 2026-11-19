import { Component, createRef } from "react";
import type { ChangeEvent, PointerEvent, ReactNode } from "react";
import { MyEditor } from "../editors/MyEditor";
import { parseShapes, serializeShapes } from "../storage/shapesFile";
import { MyTable } from "../my_table";
import type { TableRow } from "../my_table";
import { TOOL_LABELS } from "../tools";
import type { Tool } from "../tools";
import MenuBar from "./MenuBar";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import ModalWindow from "./ModalWindow";

// The single global object of the editor (Meyers' singleton).
const myEditor = MyEditor.getInstance();

interface ModalState {
  title: string;
  body: ReactNode;
}

interface GraphicEditorState {
  tool: Tool;
  modal: ModalState | null;
  tableOpen: boolean;
}

export default class GraphicEditor extends Component<
  object,
  GraphicEditorState
> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private fileInputRef = createRef<HTMLInputElement>();
  private unsubscribe: (() => void) | null = null;

  state: GraphicEditorState = {
    tool: myEditor.getTool(),
    modal: null,
    tableOpen: false,
  };

  onFull = () =>
    this.showMessage(
      "error",
      <p>
        Масив заповнений ({myEditor.maxShapes} об'єктів). Новий об'єкт не
        додано.
      </p>,
    );

  componentDidMount() {
    myEditor.setFullHandler(this.onFull);
    this.unsubscribe = myEditor.subscribe(this.onShapesChanged);
    this.onShapesChanged();
  }

  componentWillUnmount() {
    myEditor.setFullHandler(() => {});
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  // Observer callback: the set of shapes or the selection has changed.
  // The data is read from myEditor in render(), so only a re-render is needed.
  onShapesChanged = () => this.forceUpdate(this.onPaint);

  // ---------- table window ----------

  onToggleTable = () => {
    if (this.state.tableOpen) this.onCloseTable();
    else this.setState({ tableOpen: true });
  };

  onCloseTable = () => {
    this.setState({ tableOpen: false });
    myEditor.select(null);
  };

  onTableSelect = (index: number | null) => myEditor.select(index);

  onTableDelete = (index: number) => myEditor.remove(index);

  // ---------- file ----------

  onSave = () => {
    const text = serializeShapes(myEditor.getRecords());
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "shapes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  onOpen = () => this.fileInputRef.current?.click();

  onFileChosen = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const { records, errors } = parseShapes(await file.text());

    if (errors.length > 0) {
      this.showMessage(
        "error",
        <>
          <p>Файл не завантажено — у ньому є помилки:</p>
          {errors.slice(0, 5).map((message) => (
            <p key={message}>{message}</p>
          ))}
          {errors.length > 5 && <p>... і ще {errors.length - 5}</p>}
        </>,
      );
      return;
    }

    const loaded = myEditor.load(records);
    if (records.length > loaded) {
      this.showMessage(
        "Увага",
        <p>
          У файлі {records.length} об'єктів, завантажено перші {loaded} (розмір
          масиву — {myEditor.maxShapes}).
        </p>,
      );
    }
  };

  private showMessage(title: string, body: ReactNode) {
    this.setState({ modal: { title, body } });
  }

  onSelectTool = (tool: Tool) => {
    myEditor.start(tool);
    this.setState({ tool }, this.onPaint);
  };

  onClear = () => myEditor.clear();

  onInitMenuPopup = (): Tool => myEditor.getTool();

  onNotify = (tool: Tool): string => TOOL_LABELS[tool];

  onAbout = () =>
    this.showMessage(
      "Варіант 11",
      <>
        <h4>Редактор</h4>
        <p>
          глобальний статичний об'єкт класу MyEditor у вигляді Singleton Меерса
        </p>
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
          Відображення: блакитна лінія та два кружечки на кінцях (рожеве
          заповнення)
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
        <h4>Вікно таблиці</h4>
        <p>
          Немодальна плаваюча панель (меню View → Table), клас MyTable в
          окремому модулі my_table
          <br />
          Виділення рядка підсвічує об'єкт, Delete вилучає його з масиву
        </p>
        <h4>Файл</h4>
        <p>
          Текстовий файл: один об'єкт на рядок (тип x1 y1 x2 y2)
          <br />
          File → Save / Open
        </p>
        <h4>Позначка поточного типу об'єкта</h4>
        <p>в меню та на панелі інструментів</p>
      </>,
    );

  onCloseModal = () => this.setState({ modal: null });

  private tableRows(): TableRow[] {
    return myEditor.getRecords().map((r) => ({
      name: TOOL_LABELS[r.type],
      x1: r.x1,
      y1: r.y1,
      x2: r.x2,
      y2: r.y2,
    }));
  }

  private position(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // Passes a canvas event to the editor and redraws.
  private forward(action: "onLBDown" | "onLBUp" | "onMouseMove") {
    return (e: PointerEvent<HTMLCanvasElement>) => {
      const { x, y } = this.position(e);
      myEditor[action](x, y);
      this.onPaint();
    };
  }

  onLBDown = this.forward("onLBDown");
  onLBUp = this.forward("onLBUp");
  onMouseMove = this.forward("onMouseMove");

  onPaint = () => {
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) myEditor.onPaint(ctx);
  };

  render() {
    const { tool, modal, tableOpen } = this.state;

    return (
      <div className="editor-container">
        <MenuBar
          tableOpen={tableOpen}
          onSelectTool={this.onSelectTool}
          onOpen={this.onOpen}
          onSave={this.onSave}
          onToggleTable={this.onToggleTable}
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

        <input
          ref={this.fileInputRef}
          type="file"
          accept=".txt,text/plain"
          hidden
          onChange={this.onFileChosen}
        />

        {tableOpen && (
          <MyTable
            rows={this.tableRows()}
            selectedIndex={myEditor.getSelected()}
            capacity={myEditor.maxShapes}
            onSelect={this.onTableSelect}
            onDelete={this.onTableDelete}
            onClose={this.onCloseTable}
          />
        )}

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
