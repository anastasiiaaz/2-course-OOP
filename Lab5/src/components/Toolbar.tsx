import { Component } from "react";
import Button from "./Button";
import { TOOLS } from "../tools";
import type { Tool } from "../tools";

const ICONS: Record<Tool, string> = {
  Point: "/icons/dot.png",
  Line: "/icons/line.png",
  Rectangle: "/icons/rectangle.png",
  Ellipse: "/icons/oval.png",
  LineOO: "/icons/line-circles.png",
  Cube: "/icons/cube.png",
};

interface ToolbarProps {
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
  onNotify: (tool: Tool) => string;
}

export default class Toolbar extends Component<ToolbarProps> {
  render() {
    const { activeTool, onSelectTool, onNotify } = this.props;

    return (
      <div className="toolbar" role="toolbar" aria-label="Objects">
        {TOOLS.map((tool) => (
          <Button
            key={tool}
            className={`tool-button ${tool === activeTool ? "active" : ""}`}
            title={onNotify(tool)}
            onClick={() => onSelectTool(tool)}
          >
            <img src={ICONS[tool]} alt="" width={22} height={22} />
          </Button>
        ))}
      </div>
    );
  }
}
