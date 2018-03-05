const R = require('ramda')
const { log } = console
const { map, compose, equals } = R

class Either {
  
  // of :: (Either m) => a -> m a
  static of (value) {
    return new Right(value)
  }
  
  // toEither :: (Either m) => a -> m a
  static toEither (value) {
    return value == null ? new Left(value) : new Right(value)
  }
  
  // encase :: (a, () -> b) -> Either a b
  static encase (leftValue, rightFn) {
    try {
      return Right.of(rightFn())
    }
    catch(e) {
      return Left.of(leftValue)
    }
  }

  constructor (value) {
    if (this.constructor === Either) {
      throw new Error('Either should not be used as constructor.')
    }
      this.value = value
  }
  
  // bimap :: (Either e) => e a b ~> (a -> c, b -> d) -> e c d
  bimap (leftFn, rightFn) {
    return this.isRight ? 
      Right.fmap(rightFn) : Left.of(leftFn(this.value))
  }

  // alt :: (Either e) => e a b ~> (e a b) -> e a b
  alt (alternative) {
    if (Either.isEither(alternative)) {
      return this.isRight ? this : alternative
    }
    throw new Error('Either#alt expects an Either as an argument')
  }
}


class Right extends Either {
  
  get isRight() { return true }
  get isLeft() { return false }

  // fmap :: (Either e) => e a b ~> (b -> c) -> e a c
  fmap (fn) {
    return new Right(fn(this.value))
  }
  
  // ap :: (Either e) => e a b ~> e a (b -> c) -> e a c
  ap (aFn) { 
    //return this.fmap(aFn.value)
    return aFn.chain(fn => Right.of(fn(this.value)))
  }

  // chain :: (Either e) => e a b ~> (b -> e a c) -> e a c
  chain (fnA) {
    return fnA(this.value)
  }

}


class Left extends Either  {
  
  get isRight() { return false }
  get isLeft() { return true }
  
  static of (value) {
    return new Left(value)
  }

  // fmap :: (Either e) => e a b ~> (b -> c) -> e a c
  fmap (_) {
    return this
  }
  
  // ap :: (Either e) => e a b ~> e a (b -> c) -> e a c
  ap (_) { 
    return this
  }

  // chain :: (Either e) => e a b ~> (b -> e a c) -> e a c
  chain (_) {
    return this 
  }

}

module.exports = {
  Either,
  Right,
  Left,
  // Export static functions as to treat the exported object
  // as if it was actually Either.
  of: Either.of,
  toEither: Either.toEither,
  encaseEither(leftVal, rightFn) {
    return (...args) => {
      return Either.encase(leftVal, rightFn.bind(null, ...args))
    }
  }
}
