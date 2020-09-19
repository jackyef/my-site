/**
 * Taken from https://github.com/lodash/lodash/blob/master/flow.js 
 */
const flow = (...funcs) => {
  const length = funcs.length
  let index = length

  while (index--) {
    if (typeof funcs[index] !== 'function') {
      throw new TypeError('Expected a function')
    }
  }
  return function(...args) {
    let index = 0
    let result = length ? funcs[index].apply(this, args) : args[0]
    while (++index < length) {
      result = funcs[index].call(this, result)
    }
    return result
  }
}

const flowRight = (...funcs) => {
  return flow(...funcs.reverse());
}

module.exports = {
  flow,
  flowRight,
};
