import {MarkupEntity} from '@tada-team/tdproto-ts'

let isDebug = false
const log = (...args: any[]) => {
  isDebug && console.log(...args)
}

const createChild = (me: MarkupEntity): HTMLElement => {
  switch (me.typ) {
    case 'bold':
      return document.createElement('b')
    case 'code':
      return document.createElement('code')
    case 'codeblock':
      return document.createElement('pre')
    case 'italic':
      return document.createElement('i')
    case 'link': {
      const linkEl = document.createElement('a')
      if (me.url) linkEl.setAttribute('href', me.url)
      return linkEl
    }
    case 'quote':
      return document.createElement('blockquote')
    case 'strike':
      return document.createElement('s')
    case 'time': {
      const timeEl = document.createElement('time')
      if (me.time) timeEl.setAttribute('datetime', me.time)
      return timeEl
    }
    case 'underscore':
      return document.createElement('u')
    case 'unsafe':
      return document.createElement('span')
  }

  return document.createElement('span')
}

const createPlain = (source: string[]) => {
  const el = document.createElement('span')
  el.textContent = source.join('')
  return el
}

const convert = (source: string[], markup: MarkupEntity[], el: HTMLElement): void => {
  let prev = 0

  if (markup.length === 0) {
    log(`no markup, appending plain ${source}`)
    el.appendChild(createPlain(source))
    return
  }

  markup.forEach(me => {
    log('looking at markup', me)

    const child = createChild(me)
    log('created child of type', me.typ)

    const context = source.slice(me.op + (me.oplen ?? 0), me.cl)

    if (me.childs && me.childs.length > 0) {
      log('found children, processing...')
      convert(context, me.childs, child)
    } else {
      log('no children, inserting:', context)
      if (me.repl) child.textContent = me.repl
      else if (me.time) child.textContent = new Date(me.time).toLocaleString()
      else child.textContent = context.join('')
    }

    if (prev < me.op) {
      log('text before start of markup, appending:', source, prev, me.op)
      el.appendChild(createPlain(source.slice(prev, me.op)))
    }

    el.appendChild(child)

    prev = me.cl + (me?.cllen ?? 0)
    log('new prev:', prev)
  })

  if (prev < source.length) {
    log('text after end of markup, appending:', source, prev)
    el.appendChild(createPlain(source.slice(prev)))
  }
}

export const debug = (enable = true) => {
  isDebug = enable
}

export const toHTMLElement = (tag: string, source: string, markup: MarkupEntity[] = []): HTMLElement => {
  const el = document.createElement(tag)
  convert(Array.from(source), markup, el)
  return el
}

export const toHTML = (source: string, markup: MarkupEntity[] = []): string => {
  const el = toHTMLElement('div', source, markup)
  return el.innerHTML
}

export default {
  debug,
  toHTML,
  toHTMLElement
}
