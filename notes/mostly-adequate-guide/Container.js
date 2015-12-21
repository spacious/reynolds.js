
// https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch8.md

var Container = function(x){
    this.__value = x;
}

Container.of = function(x) { return new Container(x); }

// (a -> b) -> Container a -> Container b
Container.prototype.map = function(f){
  return Container.of(f(this.__value))
}

Container.prototype.join = function() {
  return this.__value;
}

Container.prototype.chain = function(f) { return this.map(f).join(); }

Container.prototype.ap = function(other_container) {
  return other_container.map(this.__value);
}

Container.prototype.type = "Container";

module.exports = Container;