## Properties

### Reflexivity

a is equal to itself

```javascript

// FantasyLand Setoid
a.equals(a) === true

```
### Symmetry

There are no a and b such that a < b and b < a

```javascript

// FantasyLand Setoid
a.equals(b) === b.equals(a)

```

### Transitivity

whenever a is related to b, and b is related to c, then a is also related to c

```javascript

// FantasyLand Setoid
if(a.equals(b) && b.equals(c)){ a.equals(c) == true }

```

### Associativity

the order of operations does not matter as long as the sequence is not changed


``` h ∘ (g ∘ f) = (h ∘ g) ∘ f ```


```javascript

// FantasyLand Semigroup (concat)
a.concat(b).concat(c) === a.concat(b.concat(c))
	
// FantasyLand Chain (chain)
m.chain(f).chain(g) == m.chain(x => f(x).chain(g))

```

### Identity

```e -> a = a -> e = a```

```javascript

// identity
A.of(id).ap(v) == v

// FantasyLand Functor (map)
u.map(x => x) == u

// FantasyLand Traversable (sequence)
u.map(x => Id(x)).sequence(Id.of) == Id.of

// FantasyLand Applicative (of)
a.of(x => x).ap(v) == v

```

applying `id` all from within a functor shouldn't alter the value in v


```javascript

var v = Identity.of("Pillow Pets");
Identity.of(id).ap(v) == v


```

#### Left Identity

```e -> a = a```

```javascript

// FantasyLand Monoid (empty)
m.empty().concat(m) === m

// FantasyLand Monad
m.of(a).chain(f) == f(a)

```

#### Right Identity

```a -> e = a```

```javascript

// FantasyLand Monoid (empty)
m.concat(m.empty()) === m

// FantasyLand Monad
m.chain(m.of) == m

```

### Composition

check that our standard function composition holds when applying inside of containers

```javascript

// composition
A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w));

// FantasyLand Functor (map)
u.map(x => f(g(x))) == u.map(g).map(f)

// FantasyLand Apply (ap)
a.map(f => g => x => f(g(x))).ap(u).ap(v) == a.ap(u.ap(v))

// FantasyLand Traversable (sequence)
u.map(Compose).sequence(Compose) == Compose(u.sequence(f.of).map(x => x.sequence(g.of)))

```


```javascript

var u = IO.of(_.toUpper);
var v = IO.of(_.concat("& beyond"));
var w = IO.of("blood bath ");

IO.of(_.compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w))

```

### Homomorphism

 homomorphism is just a structure preserving map.

 In fact, a functor is just a homomorphism between categories as it preserves the original category's structure under the mapping.

```javascript

// homomorphism
A.of(f).ap(A.of(x)) == A.of(f(x))

// FantasyLand Applicative (of)
a.of(f).ap(a.of(x)) == a.of(f(x))

Either.of(_.toUpper).ap(Either.of("oreos")) == Either.of(_.toUpper("oreos"))

```

### Interchange

The interchange states that it doesn't matter if we choose to lift our function into the left or right side of `ap`.

```javascript

// interchange
v.ap(A.of(x)) == A.of(function(f) { return f(x) }).ap(v)

// FantasyLand Applicative (of)
u.ap(a.of(y)) == a.of(f => f(y)).ap(u)

```


```javascript

var v = Task.of(_.reverse);
var x = 'Sparklehorse';

v.ap(Task.of(x)) == Task.of(function(f) { return f(x) }).ap(v)

```

### Naturality

```javascript

// FantasyLand Traversable (sequence)
t(u.sequeunce(f.of)) == u.map(t).sequence(g.of) // where t is natural transformation f to g

```
