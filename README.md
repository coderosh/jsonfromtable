# JSON FROM TABLE

Converts html tables to JSON and JS objects

[![NPM](https://nodei.co/npm/jsonfromtable.png)](https://nodei.co/npm/jsonfromtable/)

## Installation

Install via npm

```batch
npm install jsonfromtable
```

## Usage

```js
const jsonfromtable = require('jsonfromtable')

jsonfromtable(options, headers).then((data) => {
  console.log(data)
})
```

`jsonfromtable` function takes two arguments `options` and `headers` and returns promise.

Check this [example](https://codesandbox.io/s/jsonfromtable-example-140hz) in codesandbox.

## Options

### url

If you want the output from a url then you need to pass `url` option. The url should be of a webpage which has a table.

```js
options = {
  url: 'https://www.example.com',
}
```

### html

If you want the output from a html then you need to pass `html` option. The html should contain `table` tag.

```js
options = {
  html: '<table>....</table>',
}
```

### format

If you want the json output then you can pass `format` option.

```js
options = {
  url: 'https://www.example.com',
  format: 'json', // default => jsobject
}
```

### selector

If the page has more than one table, then you can pass id of the table as `selector`.

```js
options = {
  url: 'https://www.example.com',
  selector: '#table_example', // default => table
}
```

<br />

## Headers

The first row from table is taken a key. You can also pass your own headers

```js
options = {
  url: 'https://www.example.com',
  selector: '#table_example', // default => table
  headers: ['header1', 'header2', 'header3'],
}
```

## License

MIT
