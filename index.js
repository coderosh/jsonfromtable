const cheerio = require('cheerio')
const fetch = require('node-fetch')
const toJson = require('./utils/tojson')

const defaultOptions = {
  url: undefined,
  html: undefined,
  selector: 'table',
  format: 'jsobject'
}

const jsonfromtable = async (options = defaultOptions, headers) => {
  try {
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
      return []
    }

    let body = toJson($, selector, headers)
    if (format === 'json') {
      return JSON.stringify(body)
    } else {
      return body
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = jsonfromtable
