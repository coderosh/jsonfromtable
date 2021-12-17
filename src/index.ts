import fetch from 'node-fetch'
import { toArray, toJson, parseTable, ParseTableOptions } from './utils'

interface Options extends ParseTableOptions {
  titles?: string[]
  firstRowIsHeading?: boolean
  includeFirstRowInBody?: boolean
}

class JSONFromTable {
  static arrayFromString(
    html: string,
    options: Options = {}
  ): { titles: string[]; body: string[][] } {
    let {
      titles = [],
      firstRowIsHeading = true,
      includeFirstRowInBody = false,
      ...parseTableOptions
    } = options

    const table = parseTable(html, parseTableOptions)

    let body = toArray(table)

    if (firstRowIsHeading && titles.length === 0) titles = body[0]
    if (!includeFirstRowInBody) body = body.slice(1)

    return { titles, body }
  }

  static async arrayFromUrl(
    url: string,
    options: Options = {}
  ): Promise<{ titles: string[]; body: string[][] }> {
    const html = await fetch(url).then((res) => res.text())
    return JSONFromTable.arrayFromString(html, options)
  }

  static fromString(
    html: string,
    options: Options = {}
  ): { [key: string]: string }[] {
    const { titles, body } = JSONFromTable.arrayFromString(html, options)
    return toJson(titles, body)
  }

  static async fromUrl(
    url: string,
    options: Options = {}
  ): Promise<{ [key: string]: string }[]> {
    const html = await fetch(url).then((res) => res.text())
    return JSONFromTable.fromString(html, options)
  }
}

export { JSONFromTable, Options }
