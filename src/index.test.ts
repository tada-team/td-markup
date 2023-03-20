import tdmarkup from './index'
import dataset from './dataset'
import {MarkupEntity} from '@tada-team/tdproto-ts'

dataset.forEach(spec => {
  test(spec.name, () => {
    expect.hasAssertions()
    const markup = spec.mu.map(d => MarkupEntity.fromJSON(d))
    expect(tdmarkup.toHTML(spec.s, markup)).toEqual(spec.expected)
  })
})
