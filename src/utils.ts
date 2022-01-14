import Docpa from 'docpa'

function getRowWithColumns(
  tableDoc: Docpa,
  selectors: [string, string],
  shouldBeText: boolean,
  trim: boolean
) {
  const rowSelector = selectors[0] || 'tr'
  const colSelector = selectors[1] || 'td,th'

  return tableDoc.querySelectorAll(rowSelector).map((tr) => {
    if (!tr) return []
    return tr.querySelectorAll(colSelector).map((td) => {
      if (!td) return { value: '', colspan: 1, rowspan: 1 }

      const rowspan = +(td.getAttribute('rowspan') || 1) || 1
      const colspan = +(td.getAttribute('colspan') || 1) || 1

      const value = (shouldBeText ? td.textContent : td.innerHTML) || ''

      return { value: trim ? value.trim() : value, colspan, rowspan }
    })
  })
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

  const document = new Docpa(html)
  const table = document.querySelector(tableSelector)

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
