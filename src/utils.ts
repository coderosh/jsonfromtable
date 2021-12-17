import render from 'dom-serializer'
import { selectAll, selectOne } from 'css-select'
import { DomUtils, parseDocument } from 'htmlparser2'

const { getAttributeValue, textContent } = DomUtils

function getRowWithColumns(
  tableDoc: ReturnType<typeof parseDocument>,
  selectors: [string, string],
  shouldBeText: boolean,
  trim: boolean
) {
  const rowSelector = selectors[0] || 'tr'
  const colSelector = selectors[1] || 'td,th'

  return selectAll(rowSelector, tableDoc).map((tr) =>
    selectAll(colSelector, tr).map((td) => {
      const rowspan = (td && +getAttributeValue(td as any, 'rowspan')!) || 1
      const colspan = (td && +getAttributeValue(td as any, 'colspan')!) || 1
      const value =
        (td && (shouldBeText ? textContent(td) : render(td.children))) || ''
      return { value: trim ? value.trim() : value, colspan, rowspan }
    })
  )
}

interface ParseTableOptions {
  tableSelector?: string
  rowColSelector?: [string, string]
  shouldBeText?: boolean
  trim?: boolean
}

function parseTable(html: string, options: ParseTableOptions) {
  const {
    tableSelector = 'table',
    rowColSelector = ['tr', 'td,th'],
    shouldBeText = true,
    trim = true,
  } = options

  const document = parseDocument(html)
  const table = selectOne(tableSelector, document)

  if (!table) throw new Error(`${tableSelector} not found in document.`)

  return getRowWithColumns(table, rowColSelector, shouldBeText, trim)
}

function toArray(table: ReturnType<typeof parseTable>) {
  const data: ReturnType<typeof parseTable> = []

  for (let i = 0; i < table.length; i++) {
    const tr = table[i]

    for (let j = 0; j < tr.length; j++) {
      const td = tr[j]

      for (let c = 0; c < td.colspan; c++) {
        if (!data[i]) data[i] = []

        data[i].push({ ...td, colspan: 1 })
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const tr = data[i]
    for (let j = 0; j < tr.length; j++) {
      const td = tr[j]
      for (let r = 1; r < td.rowspan; r++) {
        if (!data[i + r]) data[i + r] = []
        data[i + r].splice(j, 0, { ...td, rowspan: 1 })
      }
    }
  }

  return data.map((a) => a.map((a) => a.value))
}

function toJson(titles: string[], array: ReturnType<typeof toArray>) {
  titles = validTitles(titles)

  const data = []
  for (let i = 0; i < array.length; i++) {
    const tr = array[i]
    const obj: { [key: string]: string } = {}
    for (let j = 0; j < tr.length; j++) {
      const td = tr[j]
      const title = titles[j] || `noTitle${j}`
      obj[title] = td
    }
    data.push(obj)
  }
  return data
}

function validTitles(titles: string[]) {
  titles = titles.map((a) => a.trim())

  const newTitles: string[] = []
  const dups: string[] = []

  for (const title of titles) {
    if (dups.includes(title)) {
      newTitles.push(`${title}${dups.filter((a) => a === title).length + 1}`)
    } else {
      newTitles.push(title)
    }

    dups.push(title)
  }

  return newTitles
}

export { parseTable, toArray, toJson, ParseTableOptions }
