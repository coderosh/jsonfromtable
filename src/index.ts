import fetch from 'node-fetch'
import cheerio, { Cheerio, CheerioAPI, Node } from 'cheerio'
import { Format, output, Result } from './utils'

interface Options {
  url?: string
  html?: string
  selector?: string
  hSelector?: string
  bSelector?: [string, string]
  format?: Format
  headers?: string[]
}

/**
 * Get JSON, Object, Array from html tables
 *
 * @param options Options
 */
function jsonFromTable<T extends Format = 'object'>(
  options: { url: string; format?: T } & Options
): Promise<Result<T>>

function jsonFromTable<T extends Format = 'object'>(
  options: { html: string; format?: T } & Options
): Result<T>

function jsonFromTable<T extends Format>(options: Options = {}) {
  const {
    html,
    url,
    selector = 'table',
    hSelector = 'tr:first-child th',
    bSelector = ['tr:not(:first-child)', 'td'],
    format = 'object',
    headers: customHeaders = [],
  } = options
  // prettier-ignore
  const hSelectors = [hSelector, "thead tr:first-child th", "tr:first-child th", "tr:first-child td"];
  // prettier-ignore
  const bSelectors = [bSelector, ["tbody tr", "td"], ["tr:not(:first-child)", "td"], ["tr", "td"]];

  if (html) {
    return htmlTableToJson(html)
  } else if (url) {
    return fetch(url).then(async (res) => {
      const html = await res.text()
      return htmlTableToJson(html)
    })
  } else {
    throw new Error(`You need to provide at least a url or html`)
  }

  function htmlTableToJson(html: string) {
    const $ = cheerio.load(html)

    const table = $(selector)

    if (table.html() === null)
      throw new Error(`Couldn't find table with selector "${selector}"`)

    const headers =
      customHeaders.length > 0
        ? customHeaders
        : getHeaders($, table, hSelectors)

    const body = getBody($, table, bSelectors)

    return output(headers, body, format) as Result<T>
  }
}

function getHeaders($: CheerioAPI, table: Cheerio<Node>, selectors: string[]) {
  for (const selector of selectors) {
    const list = $(selector, table.html())

    if (list.html() !== null) {
      const values = list.toArray().map((v) => $(v).text().trim())
      return values
    }
  }

  return []
}

function getBody($: CheerioAPI, table: Cheerio<Node>, selectors: string[][]) {
  for (const selector of selectors) {
    const rows = $(selector[0], table.html()).toArray()

    if (rows.length > 0) {
      const values: string[][] = []

      for (const row of rows) {
        const tds = $(selector[1], $(row).html())
          .toArray()
          .map((v) => $(v).text())

        values.push(tds)
      }

      return values
    }
  }

  return []
}

export { jsonFromTable, Format, Result, Options, output }
