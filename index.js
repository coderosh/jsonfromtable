const cheerio = require('cheerio')
const fetch = require('node-fetch')

const toJson = require('./utils/tojson')

const defaultOptions = {
  url: undefined,
  html: undefined,
  selector: 'table'
}

const html = async (options, headers) => {
  const { url, html, selector } = { ...defaultOptions, ...options }

  let data

  if (url) {
    const response = await fetch(url)
    data = await response.text()
  } else if (html) {
    data = html
  }

  const $ = cheerio.load(data)

  let body = toJson($, 'table', headers)

  console.log(body)
}

html(
  {
    html: `
<table style="width:100%">
  <tr>
    <td>Jill</td>
    <td>Smith</td>
    <td>50</td>
  </tr>
  <tr>
    <td>Eve</td>
    <td>Jackson</td>
    <td>94</td>
  </tr>
</table>
`
  },
  ['Name', 'LastName', 'Age']
)
