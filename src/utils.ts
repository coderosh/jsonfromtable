type Format = "array" | "json" | "object" | "raw";

type Result<T extends Format = "object"> = T extends "json"
  ? string
  : T extends "object"
  ? { [key: string]: string[] }
  : T extends "array"
  ? [string, string[]][]
  : { headers: string[]; body: string[][] };

/**
 * Convert headers and body to different format
 *
 * @param headers array of headers
 * @param body array of body
 * @param format format of output
 */
function output(
  headers: string[],
  body: string[][],
  format: Format = "object"
) {
  const fn =
    format === "json"
      ? toJSON
      : format === "object"
      ? toObject
      : format === "array"
      ? toArray
      : (headers: string[], body: string[][]) => ({ headers, body });

  return fn(headers, body);
}

function camalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, m) => m.toUpperCase());
}

function toObject(headers: string[], body: string[][]) {
  const obj: { [key: string]: string[] } = {};

  for (let i = 0; i < headers.length; i++) {
    obj[camalize(`${headers[i] || i}`)] = body.map((v) => v[i]);
  }

  return obj;
}

function toJSON(headers: string[], body: string[][]) {
  return JSON.stringify(toObject(headers, body));
}

function toArray(headers: string[], body: string[][]) {
  const arr: [string, string[]][] = [];

  for (let i = 0; i < headers.length; i++) {
    arr[i] = [`${headers[i] || i}`, body.map((v) => v[i])];
  }

  return arr;
}

export { output, Format, Result, camalize, toJSON, toObject, toArray };
