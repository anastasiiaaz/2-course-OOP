export type Tool =
  | "Point"
  | "Line"
  | "Rectangle"
  | "Ellipse"
  | "LineOO"
  | "Cube";

export const TOOLS: Tool[] = [
  "Point",
  "Line",
  "Rectangle",
  "Ellipse",
  "LineOO",
  "Cube",
];

export const TOOL_LABELS: Record<Tool, string> = {
  Point: "Point",
  Line: "Line",
  Rectangle: "Rectangle",
  Ellipse: "Ellipse",
  LineOO: "Line with circles",
  Cube: "Cube",
};
