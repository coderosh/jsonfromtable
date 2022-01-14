# jsonFromTable

Convert html tables to object (or array). Supports complex rowspan and colspan.

<a href="https://www.npmjs.com/package/jsonfromtable"><img alt="NPM" src="https://img.shields.io/npm/v/jsonfromtable" /></a>
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
const { JSONFromTable } = require('jsonfromtable')

const obj = JSONFromTable.fromString(`<table>...</table>`)
// [ { title1: value1, title2: value2, ... }, ... ]

const { headers, body } = JSONFromTable.arrayFromString(`<table>...</table>`)
// { headers: [title1, titel2, ...], body: [[val2, val2, ...],...] }

;(async () => {
  const obj = await JSONFromTable.fromUrl(`https://...`)
  const { headers, body } = await JSONFromTable.arrayFromUrl(`https://...`)
})()
```

Each function in `JSONFromTable` accepts two arguments. First is source (string or url) and second is `options`.

```ts
interface Options {
  titles?: string[] // custom titles (eg: ["sn", "name", "title"])
  firstRowIsHeading?: boolean // use first row for titles ?
  includeFirstRowInBody?: boolean // add first row in body ?
  tableSelector?: string // css selector for table (eg: table.wikitable)
  rowColSelector?: [string, string] // css selectors for row and col (eg: ["tr", "th,td"])
  shouldBeText?: boolean // if false value is html else true
  trim?: boolean // should trim the value ?
}
```

## Example

```js
const str = `<table>
  <tr>
    <th>name</th>
    <th>alias</th>
    <th>class</th>
    <th>info</th>
  </tr>
  <tr>
    <td colspan="2">Roshan</td>
    <td>Eng</td>
    <td rowspan="2">na</td>
  </tr>
  <tr>
    <td rowspan="2">John</td>
    <td colspan="2">Cook</td>
  </tr>
  <tr>
    <td rowspan="2">Danger</td>
    <td colspan="2">Ninja</td>
  </tr>
  <tr>
    <td>AGuy</td>
    <td>Eng</td>
    <td rowspan="2">Eats a lot</td>
  </tr>
  <tr>
    <td colspan="2">Dante</td>
    <td rowspan="2">Art</td>
  </tr>
  <tr>
    <td>Jake</td>
    <td>ake</td>
    <td>Actor</td>
  </tr>
</table>`

const obj = JSONFromTable.fromString(str)
console.log(obj)
```

<img src="./example.png" height="350" />

## License

MIT
