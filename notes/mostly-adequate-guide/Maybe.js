
// https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch8.md

var Maybe = function(x) {
  this.__value = x;
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
}

Maybe.prototype.chain = function(f) { return this.map(f).join(); }

Maybe.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
};

Maybe.prototype.type = "Maybe";

module.exports = Maybe;