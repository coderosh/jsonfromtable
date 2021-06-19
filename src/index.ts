import cheerio, { Cheerio, CheerioAPI, Node } from "cheerio";
import { Format, output, Result } from "./utils";

interface Options {
  url?: string;
  html?: string;
  selector?: string;
  hSelector?: string;
  bSelector?: string[];
  format?: Format;
}

/**
 * Get JSON, Object, Array from html tables
 *
 * @param options Options
 */
function jsonFromTable<T extends Format = "object">(
  options: { url: string; format?: T } & Options
): Promise<Result<T>>;

function jsonFromTable<T extends Format = "object">(
  options: { html: string; format?: T } & Options
): Result<T>;

function jsonFromTable<T extends Format>(options: Options = {}) {
  const {
    html,
    url,
    selector = "table",
    hSelector = "tr:first-child th",
    bSelector = ["tr:not(:first-child)", "td"],
    format = "object",
  } = options;
  // prettier-ignore
  const hSelectors = [hSelector, "thead tr:first-child th", "tr:first-child th", "tr:first-child td"];
  // prettier-ignore
  const bSelectors = [bSelector, ["tbody tr", "td"], ["tr:not(:first-child)", "td"], ["tr", "td"]];

  if (html) {
    return htmlTableToJson(html);
  } else if (url) {
    return fetch(url).then(async (res) => {
      const html = await res.text();
      return htmlTableToJson(html);
    });
  } else {
    throw new Error(`You need to provide at least a url or html`);
  }

  function htmlTableToJson(html: string) {
    const $ = cheerio.load(html);

    const table = $(selector);

    if (table.html() === null)
      throw new Error(`Couldn't find table with selector "${selector}"`);

    let headers = getHeaders($, table, hSelectors);
    let body = getBody($, table, bSelectors);

    if (headers.values.length !== body.values.length) {
      console.warn(
        `Length of body and head is not same:\nHeader: ${headers.values.length}\nBody: ${body.values.length}`
      );
    }

    return output(headers, body, format) as Result<T>;
  }
}

function getHeaders($: CheerioAPI, table: Cheerio<Node>, selectors: string[]) {
  for (const selector of selectors) {
    const list = $(selector, table);

    if (list.html() !== null) {
      const values = list.toArray().map((v) => $(v).text().trim());
      return values;
    }
  }

  return [];
}

function getBody($: CheerioAPI, table: Cheerio<Node>, selectors: string[][]) {
  for (const selector of selectors) {
    const rows = $(selector[0], table).toArray();

    if (rows.length > 0) {
      let values: any[] = [];

      for (const row of rows) {
        const tds = $(selector[1], row).toArray();
        values.push(tds.map((v) => $(v).text()));
      }

      return values;
    }
  }

  return [];
}

export { jsonFromTable, Format, Result, Options, output };
