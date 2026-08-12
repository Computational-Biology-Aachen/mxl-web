import Papa from "papaparse";

/** A parsed CSV/TSV file: header names in file order, plus each column's
 * values pre-coerced to numbers (non-numeric cells become NaN — the caller
 * decides whether that's acceptable for a given column). */
export interface ParsedCsv {
  headers: string[];
  columns: Record<string, number[]>;
  /** Row count (equal length for every column). */
  rowCount: number;
}

/** Parses a CSV/TSV file (delimiter auto-detected) with a header row.
 * Rejects on a fundamentally malformed file (e.g. no header row detected). */
export function parseCsvFile(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        if (headers.length === 0) {
          reject(new Error("No header row found in the uploaded file."));
          return;
        }
        const columns: Record<string, number[]> = {};
        for (const header of headers) {
          columns[header] = results.data.map((row) => Number(row[header]));
        }
        resolve({ headers, columns, rowCount: results.data.length });
      },
      error: (err: Error) => reject(err),
    });
  });
}
