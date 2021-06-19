import { jsonFromTable } from "../src/index";

const html = `<table><tr><th>SN</th><th>Name</th></tr><tr><td>1</td><td>Roshan</td></tr><tr><td>2</td><td>John</td></tr></table>`;

describe("jsonFromTable - errors", () => {
  it("should throw error if both html and url are not provided", () => {
    // @ts-ignore
    expect(() => jsonFromTable()).toThrowError();
  });

  it("should throw error if table selector is no found in html", () => {
    expect(() => jsonFromTable({ html, selector: ".random" })).toThrowError();
  });

  it("should not throw error if both select and html/url is valid", () => {
    expect(() => jsonFromTable({ html, selector: "table" })).not.toThrowError();
  });
});

describe("jsonFromTable - html", () => {
  it("should return object from html table", () => {
    const obj = jsonFromTable({ html });
    expect(obj).toEqual({ name: ["Roshan", "John"], sn: ["1", "2"] });
  });

  it("should return array from html table", () => {
    const arr = jsonFromTable({ html, format: "array" });
    expect(arr).toEqual([
      ["SN", ["1", "2"]],
      ["Name", ["Roshan", "John"]],
    ]);
  });

  it("should return json string from html table", () => {
    const json = jsonFromTable({ html, format: "json" });
    expect(json).toEqual(`{"sn":["1","2"],"name":["Roshan","John"]}`);
  });

  it("should return raw headers and body from html table", () => {
    const raw = jsonFromTable({ html, format: "raw" });
    expect(raw).toEqual({
      body: [
        ["1", "Roshan"],
        ["2", "John"],
      ],
      headers: ["SN", "Name"],
    });
  });
});
