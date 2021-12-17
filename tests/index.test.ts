import fs from 'fs'
import path from 'path'
import nock from 'nock'
import { JSONFromTable } from '../src'

let html: string
beforeAll(() => {
  html = fs.readFileSync(path.join(__dirname, 'tables.html'), 'utf-8')
  nock('https://en.wikipedia.org')
    .get('/wiki/List_of_file_signatures')
    .twice()
    .reply(
      200,
      fs.readFileSync(path.join(__dirname, 'wikipedia.html'), 'utf-8')
    )
})

afterAll(() => {
  nock.restore()
})

describe('JSONFromTable(basic)', () => {
  test('JSONFromTable.arrayFromString should return a object with keys titles and body', () => {
    const obj = JSONFromTable.arrayFromString(
      `<table><tr><td>Ok</td></tr><tr><td>Nice</td></tr></table>`
    )
    expect(obj).toEqual({ titles: ['Ok'], body: [['Nice']] })
  })

  test('JSONFromTable.fromString should return array with objects as values', () => {
    const data = JSONFromTable.fromString(
      `<table><tr><td>Ok</td></tr><tr><td>Nice</td></tr></table>`
    )
    expect(data).toEqual([{ Ok: 'Nice' }])
  })

  test('should accept custom titles', () => {
    const data = JSONFromTable.fromString(
      `<table><tr><td>Ok</td></tr><tr><td>Nice</td></tr></table>`,
      {
        titles: ['FirstTitle'],
        includeFirstRowInBody: true,
        // @ts-expect-error
        rowColSelector: [],
      }
    )
    expect(data).toEqual([{ FirstTitle: 'Ok' }, { FirstTitle: 'Nice' }])
  })

  test('JSONFromTable.arrayFromUrl  should return a object with keys titles and body', async () => {
    const arr = await JSONFromTable.arrayFromUrl(
      'https://en.wikipedia.org/wiki/List_of_file_signatures'
    )
    expect(arr.titles.map((a) => a.trim())).toEqual([
      'Hex signature',
      'ISO 8859-1',
      'Offset',
      'Extension',
      'Description',
    ])
    expect(arr.body[0]).toEqual([
      '23 21',
      '#!',
      '0',
      '',
      'Script or data to be passed to the program following the shebang (#!)',
    ])
  })

  test('JSONFromTable.fromUrl should return array with objects as values', async () => {
    const obj = await JSONFromTable.fromUrl(
      'https://en.wikipedia.org/wiki/List_of_file_signatures'
    )

    expect(obj[0]).toEqual({
      'Hex signature': '23 21',
      'ISO 8859-1': '#!',
      Offset: '0',
      Extension: '',
      Description:
        'Script or data to be passed to the program following the shebang (#!)',
    })
  })

  test('throws error if table not found', () => {
    expect(() => JSONFromTable.fromString('')).toThrowError()
  })
})

describe('JSONFromTable(advance)', () => {
  test('simple table', () => {
    const obj = JSONFromTable.fromString(html, {
      tableSelector: 'table#simple-table',
    })

    expect(obj).toEqual([
      { SN: '1', Name: 'Roshan Acharya' },
      { SN: '2', Name: 'John Doe' },
    ])
  })

  test('table with colspan', () => {
    const obj = JSONFromTable.fromString(html, {
      tableSelector: 'table#table-with-colspan',
    })

    expect(obj).toEqual([
      { SN: '1', Name: 'Roshan Acharya' },
      { SN: '2', Name: 'John Doe' },
      { SN: 'N/A', Name: 'N/A' },
    ])
  })

  test('table with rowspan', () => {
    const obj = JSONFromTable.fromString(html, {
      tableSelector: 'table#table-with-rowspan',
    })

    expect(obj).toEqual([
      { Name: 'name1', Nickname: 'nickname1' },
      { Name: 'name1', Nickname: 'nickname2' },
    ])
  })

  test('table with rowspan and colspan', () => {
    const obj = JSONFromTable.fromString(html, {
      tableSelector: 'table#table-with-rowspan-and-colspan',
    })

    expect(obj).toEqual([
      { Name: 'name1', Nickname: 'nickname1', Job: 'job1' },
      { Name: 'name1', Nickname: 'cook', Job: 'cook' },
    ])
  })

  test('table with duplicate headings', () => {
    const obj = JSONFromTable.fromString(html, {
      tableSelector: 'table#table-with-duplicate-headings',
    })

    expect(obj).toEqual([
      {
        Name: 'Roshan',
        Job: 'Engineer',
        Name2: 'John',
        Job2: 'Cook',
      },
    ])
  })

  test('allow html as value', () => {
    const obj = JSONFromTable.fromString(html, {
      tableSelector: 'table#allow-html-as-value',
      titles: [' '],
      includeFirstRowInBody: true,
      shouldBeText: false,
      trim: false,
    })

    expect(obj).toEqual([
      { noTitle0: '<span>Val1</span>' },
      { noTitle0: 'Val2' },
    ])
  })

  test('complex rowspan and colspan', () => {
    const obj = JSONFromTable.arrayFromString(html, {
      tableSelector: 'table#complex-rowspan-and-colspan',
    })

    expect(obj).toEqual({
      body: [
        ['Roshan', 'Roshan', 'Engineering', 'n/a'],
        ['John', 'Cook', 'Cook', 'n/a'],
        ['John', 'Danger', 'Ninja', 'Ninja'],
        ['That Guy', 'Danger', 'Engineering', 'Eats a lot'],
        ['Dante', 'Dante', 'Art', 'Eats a lot'],
        ['Jake', 'ake', 'Art', 'Actor'],
      ],
      titles: ['Name', 'Nickname', 'Class', 'Info'],
    })
  })

  test('Invalid rowspan should work', () => {
    const obj = JSONFromTable.arrayFromString(html, {
      tableSelector: 'table#invalid-rowspan',
    })
    expect(obj).toEqual({
      body: [['Roshan Acharya'], ['Roshan Acharya']],
      titles: ['Name'],
    })
  })
})
