# jsonFromTable

Convert html tables to javascript objects, array or json.

<a href="https://www.npmjs.com/package/sjsonfromtable"><img alt="NPM" src="https://img.shields.io/npm/v/jsonfromtable" /></a>
<a href="https://github.com/coderosh/jsonfromtable"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
<a href="#"><img alt="CI" src="https://img.shields.io/github/workflow/status/coderosh/jsonfromtable/CI"></a>
<a href="https://github.com/coderosh/jsonfromtalbe"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
<a href="https://github.com/coderosh/jsonfromtalbe"><img src="https://img.shields.io/badge/types-typescript-blue.svg" alt="Typescript" /></a>

## Installation

Install via npm

```sh
npm install jsonfromtable
```

Or via yarn

```sh
yarn add jsonfromtable
```

## Usage

```js
const { jsonFromtable } = require('jsonfromtable')
// OR import { jsonFromTable } from "jsonfromtable"

const obj = jsonFromTable({
  html: `<table>...</table>`,
})

const json = jsonFromTable({
  html: `<table>...</table>`,
  format: 'json',
})

const arr = jsonFromTable({
  html: `<table>...</table>`,
  format: 'array',
})

const [headers, body] = jsonFromTable({
  html: `<table>...</table>`,
  format: 'raw',
})
```

`jsonFromTable` function accepts only one argument `options`;

```ts
interface Options {
  url?: string // utl to page which contains table
  html?: string // html which contains table
  selector?: string // table selector
  hSelector?: string // head selector
  bSelector?: [string, string] // body selector [row, td]
  format?: 'json' | 'array' | 'raw' | 'object' // output format
}
```

## Options

### url

If you want the output from a url then you need to pass `url` option. The url should be of a webpage which has a table. If url parameter is passed then the function will return a promise.

```js
;(async () => {
  const obj = await jsonFromTable({ url: 'https://example.com' })

  console.log(obj)
})()
```

### html

If you want the output from a html then you need to pass `html` option. The html should contain `table` tag.

```js
const obj = jsonFromTable({
  html: `<table>...</table>`,
})

console.log(obj)
```

### format

If you want the json or array or raw output then you can pass `format` option. Default value is `object`.

```js
const json = jsonFromTable({
  html: `<table>...</table>`,
  format: 'json',
})
console.log(json)

jsonFromTable({
  url: `https://example.com`,
  format: 'array',
}).then((arr) => console.log(arr))

const [headers, body] = jsonFromTable({
  html: `<table>...</table>`,
  format: 'raw',
})
console.log({ headers, body })
```

### selector

If the page has more than one table, then you can pass css selector of the table as `selector`.

```js
const html = `
<html>
  <table>...</table>
  <table class="table">...</table>
</html>
`

const obj = jsonFromTable({
  html: html,
  selector: '.table',
})

console.log(obj)
```

### hSelector

By default `tr:first-child th` is used to get the headings from table. Sometimes that selecter may not give you the best result. In such case you can provide css selector which will select all headings.

```js
const obj = jsonFromTable({
  html: `<table>...</table>`,
  hSelector: `thead tr:first-child th`,
})

console.log(obj)
```

### bSelector

By default `['tr:not(:first-child)', 'td']` is used to get body from table. Sometimes that selecter may not give you the best result. In such case you can provide css selector.

```js
const obj = jsonFromTable({
  html: `<table>...</table>`,
  bSelector: ['tbody tr:not(:first-child)', 'td'],
})

console.log(obj)
```

> Note that if provided `hSelector` and `bSelector` failes to select headers/body than following selectors will be used to select and get headers and body.

```js
const hSelectors = [
  'thead tr:first-child th',
  'tr:first-child th',
  'tr:first-child td',
]
const bSelectors = [
  ['tbody tr', 'td'],
  ['tr:not(:first-child)', 'td'],
  ['tr', 'td'],
]
```

## License

MIT
