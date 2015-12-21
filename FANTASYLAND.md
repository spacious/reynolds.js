# FantasyLand Notes
## Specifications
### Setoid 
- implements `equals`
- equivalence operation
- `a.equals(b) = true/false`
- accepts one parameter of type Setoid and returns true/false

##### Reflexivity
```javascript
a.equals(a) == true
```
##### Symmetry
```javascript
a.equals(b) == b.equals(a)
```    
##### Transitivity
```javascript
if a.equals(b) and b.equals(c) then a.equals(c)
```  
#### Example
```javascript
// Setoid
Id.prototype.equals = function(b) {
  return typeof this.value.equals === "function" ? this.value.equals(b.value) : this.value === b.value;
};
```
### Semigroup 
- implements `concat`
- associative operation
- `a.concat(b) = c`
- takes one argument that must be a value of same Semigroup 
- returns value of same Semigroup

##### Associativity
```javascript
a.concat(b).concat(c) == a.concat(b.concat(c))
```
#### Example
```javascript
// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return new Id(this.value.concat(b.value));
};
```
### Monoid < Semigroup 
- implements `empty`
- identity element
- left and right identity
- `a.empty()`
- accepts no arguments
- returns value of same Monoid

##### Right Identity
```javascript
m.concat(m.empty()) == m
```
##### Left Identity
```javascript
m.empty().concat(m) == m
```
#### Example
```javascript
// Monoid (value must also be a Monoid)
Id.prototype.empty = function() {
  return new Id(this.value.empty ? this.value.empty() : this.value.constructor.empty());
};
```
### Functor
- implements `map`
- `fmap` in Haskell	
- mapping between types (Categories)
- provides parametric polymorphism
- `a.map(b)` == `a.constructor(b(a.value))`
- `b` is a function which accepts and returns a value
- returns new container of type `a` with it's value applied to `b`

##### Identity
```javascript
u.map(a => a) == u 
```
##### Composition
```javascript
u.map(x => f(g(x))) == u.map(g).map(f)
```
#### Example
```javascript
// Functor
Id.prototype.map = function(f) {
  return new Id(f(this.value));
};
```	
### Apply < Functor
- implements `ap`
- `a.ap(b)` == `a.value(b.value)`
- `a` must be a container of a function, `b` a container of any value
- `ap` applies the function in `a` to the value in `b`

##### Composition
```javascript
a.map(f => g => x => f(g(x))).ap(u).ap(v) == a.ap(u.ap(v))
```
#### Example	
```javascript
// Apply
Id.prototype.ap = function(b) {
	return new Id(this.value(b.value));
};
```	
### Applicative < Apply
- implements `of`
- `a.of(b)` == `new <Type>(b)`
- returns new container of type `a` with value `b`

##### Identity
Applicative of identity function applied to Value equals Value  
```javascript
a.of(x => x).ap(v) == v
```
##### Homomorphism
Applicative of Function applied to Applicative of Value equals Applicative of Value applied to Function
```javascript
a.of(f).ap(a.of(x)) == a.of(f(x))
```
##### Interchange
Apply applied to Applicative of Value is equivalent to Applicative of [Apply of Value] applied to Apply
```javascript
u.ap(a.of(y)) == a.of(f => f(y)).ap(u)
```
#### Example
```javascript
// Applicative
Id.of = function(a) {
    return new Id(a);
};
```
### Foldable
- implements `reduce`
- `u.reduce(f, x)`
- f must be binary function
- first argument to f is same type as x
- f must return same type as x
- x is the initial accumulator of the reduction

```javascript
u.reduce == u.toArray().reduce

u.toArray = function(){ return this.reduce((acc, x) => acc.concat(x), []); }
```
#### Example
```javascript
// Foldable
Id.prototype.reduce = function(f, acc) {
  return f(acc, this.value);
};
```
### Traversable < Functor
- implements `sequence`
- u.sequence(of)
- of must return the Applicative that u contains
```javascript
var traverse = function(f, of){ return this.map(f).sequence(of); }
```
##### Naturality 
where t is natural transformation from f to g
```javascript
t(u.sequence(f.of)) == u.map(t).sequence(g.of)
```
##### Identity
```javascript
u.map(x => Id(x)).sequence(Id.of) == Id.of
```
##### Composition
```javascript
u.map(Compose).sequence(Compose) == Compose(u.sequence(f.of).map(x => x.sequence(g.of))) 
```
#### Example
```javascript
// Traversable
Id.prototype.sequence = function(of) {
// the of argument is only provided for types where map might fail.
  return this.value.map(Id.of);
};
```
### Chain < Apply
- implements `chain`
- derives `ap` as:	`function ap(m) { return this.chain(f => m.map(f)); }`
- `m.chain(f)`
- `f` must be a function
- must return value of the same Chain

#### Associativity
```javascript
m.chain(f).chain(g) == m.chain(x => f(x).chain(g))
```
#### Example	
```javascript
// Chain
Id.prototype.chain = function(f) {
    return f(this.value);
};
```
### Monad < Chain, Applicative
- chain operation

##### Left Identity
```javascript
m.of(a).chain(f) == f(a)
```
##### Right Identity
```javascript
m.chain(m.of) == m
```

**Derives `ap` as:	`function ap(m) { return this.chain(f => m.map(f)); }`**

```javascript
function ap(m) { return this.chain(f => m.map(f)); }

// simplify f => m.map(f) to m.map
function ap(m) { return this.chain(m.map); }
    
// simplify this.chain(m.map) to m.map(this.value)
function ap(m) { return m.map(this.value); }
```

We can see it calls `this.chain` with the function: `f => m.map(f)`. `f => m.map(f)` really just calls `m.map` so it can be simplified to: `this.chain(m.map)`. And we can think of `chain` as: `fn => fn(this.value)`. So calling `this.chain(m.map)` is just `m.map(this.value)`. We know `map` as a method which accepts a function (like good ol' `Array.map`). We also know `map` will return the same type (like `Array.map` returns `Array`). From this we gather: `this.value` must be a function and calling `m.map` will return a the same type as `m`.

So let's say `m` is not an Array but another Monad `M`. Think of it's map method as the standard: 
	
```javascript
function map(fn){ return new M(fn(this.value)); }
```
	
This method returns a new instance with it's value after applying it to `fn`. Which in this case will be our value. So we get a new container of type `M` with it's value transformed by our value. Which is the definition of `ap`. *(But if `m` was an Array, it still would've worked a charm)*

**Derives `map` as 	`function map(f){ return this.chain(a => this.of(f(a))); }`**

The inverse of it's `ap` deriviation is it's `map`:
```javascript
function map(f){ return this.chain(a => this.of(f(a))); }
``` 
So map will return a new instance of the same type with it's value transformed by the passed function.
```javascript
// chain: function chain(fn){ return fn(this.value); }
function map(f){ return this.of(f(this.value))); }
    
// of: function of(a){ return new <Type>(a); }
function map(f){ return new <Type>(f(this.value))); }
```
### Extend
- implements `extend`
- `w.extend(f)`
- `f` must be a function
- `f` must return a valid type V for some variable "v" in w
- extend must return a value of the same Extend
```javascript
w.extend(g).extend(f) == w.extend(_w => f(_w.extend(g)))
```
#### Example	
```javascript
// Extend
Id.prototype.extend = function(f) {
  return new Id(f(this));
};
```
### Comonad < Functor, Extend
- implements `extract` method
- extract must return a value of type v, for some variable v contained in c
- v must have the same type that f returns in extend
```javascript
w.extend(_w => _w.extract()) == w
w.extend(f).extract() == f(w)
w.extend(f) = w.extend(x => x).map(f)
```
#### Example	
```javascript
// Comonad
Id.prototype.extract = function() {
  return this.value;
};
```
