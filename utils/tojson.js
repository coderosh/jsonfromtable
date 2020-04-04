const map = require('./map')
const toJson = ($, tableSelector, _header) => {
  const body = []
  let header = []

  if ($(tableSelector).html() === null) {
    throw new Error(`${tableSelector} is not a valid selector for table`)
  }

  $(`${tableSelector} th`).each((_, el) => {
    header.push(
      $(el)
        .text()
        .trim()
    )
  })

  if (_header) {
    header = map(header, _header)
  }

  if (header.length === 0) {
    throw new Error(
      "The table don't have any headers (th), please provide headers as a second arguement"
    )
  }

  let d = {},
    j = 0

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
