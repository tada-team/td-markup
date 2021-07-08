import tests from './data'

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

const logEnabled = false
const log = (...args: any[]) => {
  logEnabled && log.apply(null, args)
}

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
      log('url', me.url)
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
  log(`text between |${text}|`)
  const el = document.createElement('span')
  el.textContent = text
  return el
}

const toHTML = (s: string, markup: MarkupEntity[] = []): HTMLElement => {
  const el = document.createElement('div')
  const runes = Array.from(s)

  convert(runes, markup, el)

  log('returning', el)
  return el
}

const convert = (
  runes: string[],
  markup: MarkupEntity[],
  el: HTMLElement
): void => {
  let prev = 0

  if (markup.length === 0) {
    log('no markup, appending plain', runes.join(''))
    el.appendChild(createPlain(runes))
    return
  }

  markup.forEach(me => {
    log('looking at markup', me)

    if (prev < me.op) {
      log('text before start of markup, appending:', runes.join(''), prev, me.op)
      el.appendChild(createPlain(runes, prev, me.op))
    }

    const markupEl = getWrapper(me)
    log('created markupEl of type', me.typ)

    const start = me.op + (me.oplen ?? 0)
    const end = me.cl
    const middleRunes = runes.slice(start, end)
    log('middle runes:', middleRunes.join(''))

    if (me.childs && me.childs.length > 0) {
      log('found children, processing...')
      convert(middleRunes, me.childs, markupEl)
    } else {
      log('no children, inserting:', middleRunes.join(''))
      if (me.repl) markupEl.textContent = me.repl
      else if (me.time) markupEl.textContent = new Date(me.time).toLocaleString()
      else markupEl.textContent = middleRunes.join('')
    }

    el.appendChild(markupEl)

    prev = me.cl + (me?.cllen ?? 0)
    log('new prev:', prev)
  })

  if (prev < runes.length) {
    log('text after end of markup, appending:', runes.join(''), prev, runes.length)
    el.appendChild(createPlain(runes, prev, runes.length))
  }
}

const runTest = (t: any) => {
  log('test is', t)
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
  log('----------')
}

const runAll = () => {
  tests.forEach(runTest)
  const specs = tests.map(t => {
    const b = Object.assign(t, { expected: toHTML(t.s, t.mu).outerHTML })
    return b
  })
  console.warn('specs', specs)
}

const runSingle = (s: string) => {
  runTest(tests.find(t => t.name === s))
}

// runAll()

export default {
  toHTML
}
