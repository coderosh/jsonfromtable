const map = require('./map')
const toJson = ($, tableSelector, _header) => {
  const body = []
  let header = []

  // Add headers from table to header array
  $(`${tableSelector} th`).each((_, el) => {
    header.push(
      $(el)
        .text()
        .trim()
    )
  })

  //  Compare table header to header given
  if (_header) {
    header = map(header, _header)
  }

  if (header.length === 0) {
    throw new Error(
      'The table do not have any headers (<th></th>), please provide header tag as a second arguement'
    )
  }

  let d = {},
    j = 0

  // For tds in table
  $(`${tableSelector} td`).each((_, el) => {
    let val = $(el)
      .text()
      .trim()

    if (!isNaN(parseFloat(val))) {
      val = parseFloat(val)
    }

    if (val == '') {
      val = 0
    }
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
