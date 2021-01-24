export type MarkupType =
  | 'bold'
  | 'italic'
  | 'underscore'
  | 'strike'
  | 'code'
  | 'codeblock'
  | 'quote'
  | 'link'
  | 'time'
  | 'unsafe'

export interface MarkupEntity {
  // Open marker offset
  op: number

  // Open marker length
  oplen?: number

  // Close marker offset
  cl: number

  // Close marker length
  cllen?: number

  // Marker type
  typ: MarkupType

  // Url, for Link type
  url?: string

  // Text replacement.
  repl?: string

  // Time, for Time type
  time?: string

  // List of internal markup entities
  childs?: MarkupEntity[]
}

const tests: {name: string, s: string, mu: MarkupEntity[] }[] = [
  {
    name: 'noop',
    s: '123',
    mu: [
    ]
  },
  {
    name: 'empty bold',
    s: '**',
    mu: [
    ]
  },
  {
    name: 'one bold',
    s: '*1*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 2,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'bold is inline only',
    s: '123 *45\n6* 789',
    mu: [
    ]
  },
  {
    name: 'bold ru',
    s: 'привет, *ромашки!*',
    mu: [
      {
        op: 8,
        oplen: 1,
        cl: 17,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'bold only',
    s: '*123*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'bold and punctuation',
    s: '*123*!',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'not a bold',
    s: '*123\n456*',
    mu: []
  },
  {
    name: 'bold eof',
    s: '123 *456*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'bold eol',
    s: '123 *456*\n*789*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 10,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'double bold',
    s: '123 *456* 789 *10*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 14,
        oplen: 1,
        cl: 17,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'code only',
    s: '`123`',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'code'
      }
    ]
  },
  {
    name: 'no markup inside code',
    s: '`*123*`',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'code'
      }
    ]
  },
  {
    name: 'no markup inside code 2',
    s: '`123 ~456~ `',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 11,
        cllen: 1,
        typ: 'code'
      }
    ]
  },
  {
    name: 'no markup inside code 3',
    s: 'example: ` 123 ~456~ `',
    mu: [
      {
        op: 9,
        oplen: 1,
        cl: 21,
        cllen: 1,
        typ: 'code'
      }
    ]
  },
  {
    name: 'italic',
    s: '123 /456/ 789',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'italic'
      }
    ]
  },
  {
    name: 'not italic',
    s: '123 / 456/ 789',
    mu: []
  },
  {
    name: 'not italic 2',
    s: '123 / 456 / 789',
    mu: []
  },
  {
    name: 'not italic 3',
    s: '123/ 456 /789',
    mu: []
  },
  {
    name: 'not italic 4 with link',
    s: 'https://ya.ru/',
    mu: [
      {
        op: 0,
        cl: 14,
        typ: 'link',
        url: 'https://ya.ru/',
        repl: 'ya.ru'
      }
    ]
  },
  {
    name: 'bold italic',
    s: '*/123/*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 0,
            oplen: 1,
            cl: 4,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ]
  },
  {
    name: 'code block',
    s: '```code```',
    mu: [
      {
        op: 0,
        oplen: 3,
        cl: 7,
        cllen: 3,
        typ: 'codeblock'
      }
    ]
  },
  {
    name: 'code block multiline',
    s: '```code\nnl```',
    mu: [
      {
        op: 0,
        oplen: 3,
        cl: 10,
        cllen: 3,
        typ: 'codeblock'
      }
    ]
  },
  {
    name: 'code block with newlines',
    s: '```\ncode\nline\n```',
    mu: [
      {
        op: 0,
        oplen: 4,
        cl: 13,
        cllen: 4,
        typ: 'codeblock'
      }
    ]
  },
  {
    name: 'code block with newlines with spaces',
    s: '``` \ncode\nline\n```',
    mu: [
      {
        op: 0,
        oplen: 5,
        cl: 14,
        cllen: 4,
        typ: 'codeblock'
      }
    ]
  },
  {
    name: 'code incomplete',
    s: '```code\nnl``',
    mu: []
  },
  {
    name: 'bold italic with spaces',
    s: '123 /4 *5* 6/ 789',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 12,
        cllen: 1,
        typ: 'italic',
        childs: [
          {
            op: 2,
            oplen: 1,
            cl: 4,
            cllen: 1,
            typ: 'bold'
          }
        ]
      }
    ]
  },
  {
    name: 'quote',
    s: '> 123\n456',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 5,
        cllen: 1,
        typ: 'quote'
      }
    ]
  },
  {
    name: 'quote only',
    s: '> 123',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 5,
        typ: 'quote'
      }
    ]
  },
  {
    name: 'bold in quote',
    s: '> 12 *3*\n456',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 8,
        cllen: 1,
        typ: 'quote',
        childs: [
          {
            op: 3,
            oplen: 1,
            cl: 5,
            cllen: 1,
            typ: 'bold'
          }
        ]
      }
    ]
  },
  {
    name: 'quote in quote',
    s: '> 3 > 4',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 7,
        typ: 'quote',
        childs: [
          {
            op: 2,
            cl: 3,
            typ: 'unsafe'
          }
        ]
      }
    ]
  },
  {
    name: 'not a quote',
    s: '3 > 4',
    mu: [
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'quote from new line',
    s: '\n> b',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 3,
        typ: 'quote'
      }
    ]
  },
  {
    name: 'link only',
    s: '123 https://ya.ru 456',
    mu: [
      {
        op: 4,
        cl: 17,
        typ: 'link',
        url: 'https://ya.ru',
        repl: 'ya.ru'
      }
    ]
  },
  {
    name: 'mailto',
    s: '123 xxx@gmail.com 456',
    mu: [
      {
        op: 4,
        cl: 17,
        typ: 'link',
        url: 'mailto:xxx@gmail.com',
        repl: 'xxx@gmail.com'
      }
    ]
  },
  {
    name: 'link only with trailing slash',
    s: '123 https://ya.ru/? 456',
    mu: [
      {
        op: 4,
        cl: 19,
        typ: 'link',
        url: 'https://ya.ru/?',
        repl: 'ya.ru/?'
      }
    ]
  },
  {
    name: 'manage.py',
    s: '123 manage.py 456',
    mu: [
      {
        op: 4,
        cl: 13,
        typ: 'link',
        url: 'http://manage.py',
        repl: 'manage.py'
      }
    ]
  },
  {
    name: 'tag',
    s: '<br>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 3,
        cl: 4,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'lt',
    s: '<<<<<<',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 1,
        cl: 2,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 3,
        cl: 4,
        typ: 'unsafe'
      },
      {
        op: 4,
        cl: 5,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'bolditalic tag',
    s: '<b><i>123</i></b>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 3,
        cl: 4,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      },
      {
        op: 9,
        cl: 10,
        typ: 'unsafe'
      },
      {
        op: 12,
        cl: 13,
        typ: 'unsafe'
      },
      {
        op: 13,
        cl: 14,
        typ: 'unsafe'
      },
      {
        op: 16,
        cl: 17,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'bold italic without markup',
    s: '<b>1 <i>2</i> 3</b>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      },
      {
        op: 7,
        cl: 8,
        typ: 'unsafe'
      },
      {
        op: 9,
        cl: 10,
        typ: 'unsafe'
      },
      {
        op: 12,
        cl: 13,
        typ: 'unsafe'
      },
      {
        op: 15,
        cl: 16,
        typ: 'unsafe'
      },
      {
        op: 18,
        cl: 19,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'tag after markup',
    s: '/*6688*/ 3<br>',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 7,
        cllen: 1,
        typ: 'italic',
        childs: [
          {
            op: 0,
            oplen: 1,
            cl: 5,
            cllen: 1,
            typ: 'bold'
          }
        ]
      },
      {
        op: 10,
        cl: 11,
        typ: 'unsafe'
      },
      {
        op: 13,
        cl: 14,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'bold italic with markup',
    s: '<b>1 <i>2</i> /*6688*/ 3</b>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      },
      {
        op: 7,
        cl: 8,
        typ: 'unsafe'
      },
      {
        op: 9,
        cl: 10,
        typ: 'unsafe'
      },
      {
        op: 12,
        cl: 13,
        typ: 'unsafe'
      },
      {
        op: 14,
        oplen: 1,
        cl: 21,
        cllen: 1,
        typ: 'italic',
        childs: [
          {
            op: 0,
            oplen: 1,
            cl: 5,
            cllen: 1,
            typ: 'bold'
          }
        ]
      },
      {
        op: 24,
        cl: 25,
        typ: 'unsafe'
      },
      {
        op: 27,
        cl: 28,
        typ: 'unsafe'
      }
    ]
  },
  {
    name: 'nested markup no spaces',
    s: '_1-*2-~34~-6*-7_',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 15,
        cllen: 1,
        typ: 'underscore'
      }
    ]
  },
  {
    name: 'date',
    s: '<2000-01-02T10:15:00.000000-0700>',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 32,
        cllen: 1,
        typ: 'time',
        time: '2000-01-02T10:15:00.000000-0700'
      }
    ]
  },
  {
    name: 'date in text',
    s: 'Тестовая задача с крайним сроком <2020-11-12T13:00:45.795000Z>',
    mu: [
      {
        op: 33,
        oplen: 1,
        cl: 61,
        cllen: 1,
        typ: 'time',
        time: '2020-11-12T13:00:45.795000Z'
      }
    ]
  },
  {
    name: 'clear-all',
    s: '_x_ ~y~ *z* /a/ `b` ```c```',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 2,
        cllen: 1,
        typ: 'underscore'
      },
      {
        op: 4,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'strike'
      },
      {
        op: 8,
        oplen: 1,
        cl: 10,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 12,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'italic'
      },
      {
        op: 16,
        oplen: 1,
        cl: 18,
        cllen: 1,
        typ: 'code'
      },
      {
        op: 20,
        oplen: 3,
        cl: 24,
        cllen: 3,
        typ: 'codeblock'
      }
    ]
  },
  {
    name: 'username',
    s: 'aaa @user1_name1 @user2_name2',
    mu: []
  },
  {
    name: 'bold-username',
    s: 'aaa *@user1_name1 @user2_name2*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 30,
        cllen: 1,
        typ: 'bold'
      }
    ]
  },
  {
    name: 'punctuation',
    s: '_123_?',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'underscore'
      }
    ]
  },
  {
    name: 'double',
    s: '_123__ f',
    mu: []
  },
  {
    name: 'double-double',
    s: '_123 _ f',
    mu: []
  },
  {
    name: 'emoji',
    s: '_hey_ *hop😂* _лалалей_',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'underscore'
      },
      {
        op: 6,
        oplen: 1,
        cl: 11,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 13,
        oplen: 1,
        cl: 21,
        cllen: 1,
        typ: 'underscore'
      }
    ]
  },
  {
    name: 'code in the middle',
    s: 'привет `cod` рыба',
    mu: [
      {
        op: 7,
        oplen: 1,
        cl: 11,
        cllen: 1,
        typ: 'code'
      }
    ]
  },
  {
    name: 'bold and bold italic',
    s: '*bold /italic/*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 5,
            oplen: 1,
            cl: 12,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ]
  },
  {
    name: 'mix of plain and nested',
    s: 'plain *simple bold* plain again *bold with nested /italic/* /just italic/',
    mu: [
      {
        op: 6,
        oplen: 1,
        cl: 18,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 32,
        oplen: 1,
        cl: 58,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 17,
            oplen: 1,
            cl: 24,
            cllen: 1,
            typ: 'italic'
          }
        ]
      },
      {
        op: 60,
        oplen: 1,
        cl: 72,
        cllen: 1,
        typ: 'italic'
      }
    ]
  },
  {
    name: 'double italic between plain',
    s: '12 /34/ 56 /89/ 90',
    mu: [
      {
        op: 3,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'italic'
      },
      {
        op: 11,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'italic'
      }
    ]
  },
  {
    name: 'bold with nested italic',
    s: '*bold with nested /italic/*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 26,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 17,
            oplen: 1,
            cl: 24,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ]
  },
  {
    name: 'plain and bold with nested italic',
    s: 'plain and *bold with nested /italic/*',
    mu: [
      {
        op: 10,
        oplen: 1,
        cl: 36,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 17,
            oplen: 1,
            cl: 24,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ]
  }
]

const getWrapper = (me: MarkupEntity): HTMLElement => {
  let tag: keyof HTMLElementTagNameMap
  const attrs: Map<string, string> = new Map()

  switch (me.typ) {
    case 'bold':
      tag = 'b'
      break
    case 'code':
      tag = 'code'
      break
    case 'codeblock':
      tag = 'pre'
      break
    case 'italic':
      tag = 'i'
      break
    case 'link':
      tag = 'a'
      console.log('url', me.url)
      me.url && attrs.set('href', me.url)
      break
    case 'quote':
      tag = 'blockquote'
      break
    case 'strike':
      tag = 's'
      break
    case 'time':
      tag = 'time'
      me.time && attrs.set('datetime', me.time)
      break
    case 'underscore':
      tag = 'u'
      break
    case 'unsafe':
    default:
      tag = 'span'
  }

  const el = document.createElement(tag)
  attrs.forEach((val, attr) => el.setAttribute(attr, val))

  return el
}

const createPlain = (
  runes: string[],
  from?: number,
  to?: number
): HTMLSpanElement => {
  const text = runes.slice(from ?? 0, to ?? runes.length).join('')
  console.log(`text between |${text}|`)
  const el = document.createElement('span')
  el.innerText = text
  return el
}

const toHTML = (s: string, markup: MarkupEntity[] = []): HTMLElement => {
  const el = document.createElement('div')
  const runes = Array.from(s)

  convert(runes, markup, el)

  return el
}

const convert = (
  runes: string[],
  markup: MarkupEntity[],
  el: HTMLElement
): void => {
  let prev = 0

  if (markup.length === 0) {
    console.log('no markup, appending plain', runes.join(''))
    el.appendChild(createPlain(runes))
    return
  }

  markup.forEach(me => {
    console.log('looking at markup', me)

    if (prev < me.op) {
      console.log('text before start of markup, appending:', runes.join(''), prev, me.op)
      el.appendChild(createPlain(runes, prev, me.op))
    }

    const markupEl = getWrapper(me)
    console.log('created markupEl of type', me.typ)

    const start = me.op + (me.oplen ?? 0)
    const end = me.cl
    const middleRunes = runes.slice(start, end)
    console.log('middle runes:', middleRunes.join(''))

    if (me.childs && me.childs.length > 0) {
      console.log('found children, processing...')
      convert(middleRunes, me.childs, markupEl)
    } else {
      console.log('no children, inserting:', middleRunes.join(''))
      if (me.repl) markupEl.innerText = me.repl
      else if (me.time) markupEl.innerText = new Date(me.time).toLocaleString()
      else markupEl.innerText = middleRunes.join('')
    }

    el.appendChild(markupEl)

    prev = me.cl + (me?.cllen ?? 0)
    console.log('new prev:', prev)
  })

  if (prev < runes.length) {
    console.log('text after end of markup, appending:', runes.join(''), prev, runes.length)
    el.appendChild(createPlain(runes, prev, runes.length))
  }
}

const runTest = (t: any) => {
  console.log('test is', t)
  const container = document.createElement('div')

  const name = document.createElement('div')
  name.innerText = t.name
  container.appendChild(name)

  const test = document.createElement('div')
  test.innerText = t.s
  container.appendChild(test)

  const r = toHTML(t.s, t.mu)
  container.appendChild(r)

  const separator = document.createElement('div')
  separator.innerText = '----------'
  container.appendChild(separator)

  document.querySelector('body')?.appendChild(container)
  console.log('----------')
}

const runAll = () => {
  tests.forEach(runTest)
}

const runSingle = (s: string) => {
  runTest(tests.find(t => t.name === s))
}

runAll()

export default {
  toHTML
}
