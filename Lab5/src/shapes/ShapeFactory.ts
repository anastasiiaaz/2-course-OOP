import type { Tool } from "../tools";
import { Shape } from "./Shape";
import { Point } from "./Point";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { LineOO } from "./LineOO";
import { Cube } from "./Cube";
import type { ShapeRecord } from "./ShapeRecord";

const SHAPES: Record<Tool, new () => Shape> = {
  Point,
  Line,
  Rectangle,
  Ellipse,
  LineOO,
  Cube,
};

/** Creates a shape of the given type from its record (used when a file is loaded). */
export function createShape(record: ShapeRecord): Shape {
  const shape = new SHAPES[record.type]();
  shape.set(record.x1, record.y1, record.x2, record.y2);
  return shape;
}
