import { TOOLS } from "../tools";
import type { Tool } from "../tools";
import type { ShapeRecord } from "../shapes/ShapeRecord";

const round = (n: number) => Math.round(n * 100) / 100;

export function serializeShapes(records: ShapeRecord[]): string {
  const lines = ["# type x1 y1 x2 y2"];
  for (const r of records) {
    lines.push(
      `${r.type} ${round(r.x1)} ${round(r.y1)} ${round(r.x2)} ${round(r.y2)}`,
    );
  }
  return lines.join("\n") + "\n";
}

export interface ParseResult {
  records: ShapeRecord[];
  errors: string[];
}

export function parseShapes(text: string): ParseResult {
  const records: ShapeRecord[] = [];
  const errors: string[] = [];

  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) return;

    const parts = line.split(/\s+/);
    const lineNo = i + 1;

    if (parts.length !== 5) {
      errors.push(`Line ${lineNo}: expected "type x1 y1 x2 y2"`);
      return;
    }

    const [type, ...rest] = parts;
    if (!(TOOLS as string[]).includes(type)) {
      errors.push(`Line ${lineNo}: unknown object type "${type}"`);
      return;
    }

    const [x1, y1, x2, y2] = rest.map(Number);
    if (![x1, y1, x2, y2].every(Number.isFinite)) {
      errors.push(`Line ${lineNo}: coordinates must be numbers`);
      return;
    }

    records.push({ type: type as Tool, x1, y1, x2, y2 });
  });

  return { records, errors };
}
