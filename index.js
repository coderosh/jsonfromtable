const cheerio = require('cheerio')
const fetch = require('node-fetch')

const toJson = require('./utils/tojson')

const defaultOptions = {
  url: undefined,
  html: undefined,
  selector: 'table',
  format: 'jsobject'
}

const htmlTableToJson = async (options = defaultOptions, headers) => {
  const { url, html, selector, format } = { ...defaultOptions, ...options }

  let data

  if (url) {
    const response = await fetch(url)
    data = await response.text()
  } else if (html) {
    data = html
  } else {
    return []
  }

  const $ = cheerio.load(data)

  if ($('table').html() === null) {
    throw new Error(
      `Please provide ${url ? 'url' : 'html'} which contains table`
    )
  }

  let body = toJson($, selector, headers)

  if (format === 'json') {
    return JSON.stringify(body)
  } else {
    return body
  }
}

module.exports = htmlTableToJson
