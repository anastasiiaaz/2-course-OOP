import { Component } from "react";
import type { CSSProperties, PointerEvent } from "react";

export interface TableRow {
  name: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface MyTableProps {
  title?: string;
  rows: TableRow[];
  selectedIndex: number | null;
  capacity?: number;
  onSelect: (index: number | null) => void;
  onDelete: (index: number) => void;
  onClose: () => void;
}

interface MyTableState {
  x: number;
  y: number;
}

const WIDTH = 440;
const HEIGHT = 400;

const fmt = (n: number) => String(Math.round(n * 100) / 100);

const styles: Record<string, CSSProperties> = {
  panel: {
    position: "fixed",
    zIndex: 50,
    width: WIDTH,
    height: HEIGHT,
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    border: "1px solid #ffc9d9",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(214, 71, 122, 0.28)",
    color: "#4a2a36",
    fontSize: 13,
    overflow: "hidden",
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 8px 6px 12px",
    background: "#ffe4ec",
    borderBottom: "1px solid #ffc9d9",
    cursor: "move",
    userSelect: "none",
    touchAction: "none",
  },
  title: { fontWeight: 600, color: "#d6477a" },
  close: {
    width: 26,
    height: 26,
    fontSize: 20,
    lineHeight: 1,
    color: "#d6477a",
    background: "transparent",
    border: 0,
    borderRadius: 6,
    cursor: "pointer",
  },
  scroll: { flex: 1, overflow: "auto", outline: "none" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    position: "sticky",
    top: 0,
    padding: "5px 8px",
    textAlign: "right",
    background: "#fff5f8",
    borderBottom: "1px solid #ffc9d9",
    fontWeight: 600,
  },
  td: { padding: "4px 8px", textAlign: "right" },
  empty: { padding: 16, textAlign: "center", color: "#a07a88" },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 10px",
    background: "#fff5f8",
    borderTop: "1px solid #ffc9d9",
  },
  button: {
    padding: "4px 12px",
    font: "inherit",
    color: "#4a2a36",
    background: "#ffe4ec",
    border: "1px solid #f58aa8",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export class MyTable extends Component<MyTableProps, MyTableState> {
  private dragDx = 0;
  private dragDy = 0;
  private dragging = false;
  private selectedRow: HTMLTableRowElement | null = null;

  state: MyTableState = {
    x: Math.max(16, window.innerWidth - WIDTH - 32),
    y: 90,
  };

  componentDidUpdate(prev: MyTableProps) {
    if (prev.selectedIndex !== this.props.selectedIndex) {
      this.selectedRow?.scrollIntoView({ block: "nearest" });
    }
  }

  onTitleDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    this.dragging = true;
    this.dragDx = e.clientX - this.state.x;
    this.dragDy = e.clientY - this.state.y;
  };

  onTitleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!this.dragging) return;
    const x = e.clientX - this.dragDx;
    const y = e.clientY - this.dragDy;
    this.setState({
      x: Math.min(Math.max(0, x), window.innerWidth - WIDTH),
      y: Math.min(Math.max(0, y), window.innerHeight - 40),
    });
  };

  onTitleUp = () => {
    this.dragging = false;
  };

  render() {
    const {
      title = "Table of objects",
      rows,
      selectedIndex,
      capacity,
      onSelect,
      onDelete,
      onClose,
    } = this.props;
    const { x, y } = this.state;

    return (
      <div
        style={{ ...styles.panel, left: x, top: y }}
        role="dialog"
        aria-label={title}
      >
        <div
          style={styles.titleBar}
          onPointerDown={this.onTitleDown}
          onPointerMove={this.onTitleMove}
          onPointerUp={this.onTitleUp}
        >
          <span style={styles.title}>{title}</span>
          <button
            type="button"
            style={styles.close}
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Close table"
          >
            &times;
          </button>
        </div>

        <div style={styles.scroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, textAlign: "right", width: 36 }}>
                  #
                </th>
                <th style={{ ...styles.th, textAlign: "left" }}>Object</th>
                <th style={styles.th}>x1</th>
                <th style={styles.th}>y1</th>
                <th style={styles.th}>x2</th>
                <th style={styles.th}>y2</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <tr
                    key={i}
                    ref={
                      isSelected
                        ? (el) => {
                            this.selectedRow = el;
                          }
                        : undefined
                    }
                    onClick={() => onSelect(i)}
                    style={{
                      cursor: "pointer",
                      background: isSelected
                        ? "#ffc9d9"
                        : i % 2
                          ? "#fff5f8"
                          : "#fff",
                    }}
                  >
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, textAlign: "left" }}>
                      {row.name}
                    </td>
                    <td style={styles.td}>{fmt(row.x1)}</td>
                    <td style={styles.td}>{fmt(row.y1)}</td>
                    <td style={styles.td}>{fmt(row.x2)}</td>
                    <td style={styles.td}>{fmt(row.y2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div style={styles.empty}>No objects yet</div>}
        </div>

        <div style={styles.footer}>
          <span>
            {rows.length}
            {capacity !== undefined ? ` / ${capacity}` : ""} objects
          </span>
          <button
            type="button"
            style={{
              ...styles.button,
              opacity: selectedIndex === null ? 0.5 : 1,
              cursor: selectedIndex === null ? "default" : "pointer",
            }}
            disabled={selectedIndex === null}
            onClick={() => selectedIndex !== null && onDelete(selectedIndex)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}
