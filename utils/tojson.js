const map = require('./map')
const toJson = ($, tableSelector, _header) => {
  const body = []
  let header = []

  if ($(tableSelector).html() === null) {
    throw new Error(`${tableSelector} is not a valid selector for table`)
  }

  const firstRow = $($(`${tableSelector} tr`)[0]).children()
  $(firstRow).each((_, el) => {
    header.push($(el).text().trim())
  })

  if (_header) {
    header = map(header, _header)
  }

  let d = {},
    j = 0

  $(`${tableSelector} td`).each((_, el) => {
    let val = $(el).text().trim()

    d[`${header[j]}`] = val

    if (j == header.length - 1) {
      body.push(d)
      j = 0
      d = {}
    } else {
      j++
    }
  })

  return body
}

module.exports = toJson
