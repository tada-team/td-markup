import tdmarkup from '../src/index'
import specs from '../src/data'

describe('Returns valid HTML element', () => {
  specs.forEach(spec => {
    it(spec.name, () => {
      const r = tdmarkup.toHTML(spec.s, spec.mu)
  
      expect(r.outerHTML).toEqual(spec.expected)
    })
  })
  // it('hello', () => {

  //   const spec = specs[0]
  
  //   const r = tdmarkup.toHTML(spec.s, spec.mu)
  
  //   expect(r.outerHTML).toEqual(spec.expected)
  // })
})

// describe()
