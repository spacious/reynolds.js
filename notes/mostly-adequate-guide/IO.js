
var compose = require("ramda").compose;

var IO = function(f) {
  this.unsafePerformIO = f;
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}

IO.prototype.map = function(f) {
  return new IO(compose(f, this.unsafePerformIO));
}

IO.prototype.join = function() {
  return this.unsafePerformIO;
}

IO.prototype.chain = function(f) { return this.map(f).join(); }

IO.prototype.type = "IO";

module.exports = IO;
