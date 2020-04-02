# JSON FROM TABLE

Converts html tables to JSON and JS objects

## Installation

Install via npm

```batch
npm install jsonfromtable
```

Install via yarn

```batch
yarn add jsonfromtable
```

## Usage

```js
const jsonfromtable = require('jsonfromtable')

jsonfromtable(options, headers).then(data => {
  console.log(data)
})
```

`jsonfromtable` function takes two arguments `options` and `headers.

## Options

### url

If you want the output from a url then you need to pass `url` option. The url should be of a webpage which has a table.

```js
options = {
  url: 'https://www.example.com'
}
```

### format

If you want the json output then you can pass `format` option.

```js
options = {
  url: 'https://www.example.com',
  format: 'json' // default => jsobject
}
```

### selector

If the page has more than one table, then you can pass id of the table as `selector`.

```js
options = {
  url: 'https:///www.example.com',
  selector: '#table_example' // default => table
}
```

<br />

## Headers

If the table already has `<th>` tag then you don't need to worry about headers.

If the table doesn't have `<th>` tag then you need to pass headers on your own. Make sure no of items in headers in equal to the no of columns of table.

```js
headers = ['header1', 'header2', 'header3']
```

If your table has `<th>` tags as headers but you want to pass your own header then also it will work and it is not necessary to pass all the headers equal to no of columns.

## License

MIT
