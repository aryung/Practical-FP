const R = require('ramda')
const { log } = console

export default class Functor {

  static of (value) {
    return new Functor(value)
  }

  constructor (value) {
    this.value = value
  }

  fmap (fn) {
    return new Functor(fn(this.value))
  }

}

