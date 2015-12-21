
// https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch8.md

var Left = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function(f) {
  return this;
}
Left.prototype.type = "Left";

var Right = function(x) {
  this.__value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}

Right.prototype.type = "Right";


exports.Left = Left;
exports.Right = Right;
