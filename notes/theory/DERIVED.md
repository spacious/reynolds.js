### Derived Functions

```javascript

// map derived from of/ap
X.prototype.map = function(f) {
return this.constructor.of(f).ap(this);
}

// map derived from chain

function map(f){ return this.chain(a => this.of(f(a))); }

X.prototype.map = function(f) {
  var m = this;
  return m.chain(function(a) {
    return m.constructor.of(f(a));
  });
}

// ap derived from chain/map

function ap(m) { return this.chain(f => m.map(f)); }

X.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
};

```
