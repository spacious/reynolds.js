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

// FantasyLand Functor (map)
u.map(x => x) == u

// FantasyLand Traversable (sequence)
u.map(x => Id(x)).sequence(Id.of) == Id.of

// FantasyLand Applicative (of)
a.of(x => x).ap(v) == v

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

```javascript

// FantasyLand Functor (map)
u.map(x => f(g(x))) == u.map(g).map(f)

// FantasyLand Apply (ap)
a.map(f => g => x => f(g(x))).ap(u).ap(v) == a.ap(u.ap(v))

// FantasyLand Traversable (sequence)
u.map(Compose).sequence(Compose) == Compose(u.sequence(f.of).map(x => x.sequence(g.of)))

```

### Homomorphism

```javascript

// FantasyLand Applicative (of)
a.of(f).ap(a.of(x)) == a.of(f(x))

```

### Interchange

```javascript

// FantasyLand Applicative (of)
u.ap(a.of(y)) == a.of(f => f(y)).ap(u)

```

### Naturality

```javascript

// FantasyLand Traversable (sequence)
t(u.sequeunce(f.of)) == u.map(t).sequence(g.of) // where t is natural transformation f to g

```
