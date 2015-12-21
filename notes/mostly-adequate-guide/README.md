
[Mostly adequate guide to FP (in javascript)](https://github.com/MostlyAdequate/mostly-adequate-guide)

```javascript

// identity
map(id) === id;

// composition
compose(map(f), map(g)) === map(compose(f, g));

```

### Functors

Functors take the objects and morphisms of a category and map them to a different category

```

    a   ?   f  ?  b
    ?             ?
   F.of          F.of
    ?             ?
    Fa ? map(f) ? Fb


```

commutes - if you follow the arrows each route produces the same result


```javascript

//  topRoute :: String -> Maybe String
var topRoute = compose(Maybe.of, reverse);

//  bottomRoute :: String -> Maybe String
var bottomRoute = compose(map(reverse), Maybe.of);


topRoute("hi");
// Maybe("ih")

bottomRoute("hi");
// Maybe("ih")

```
```

    "hi"    ?    reverse   ?    "ih"
     ?                            ?
  Maybe.of                     Maybe.of
     ?                            ?
  Maybe("hi") ? map(reverse) ? Maybe("ih")


```

### Pointed

A pointed functor is a functor with an `of` method

`of` also know as `pure`, `point`, `unit`, and `return`.

*default minimal context*

we'd like to lift any value in our type and map away per usual with the expected behaviour of whichever functor.

### Monads

Monads are pointed functors that can flatten

Any functor which defines a `join` method, has an `of` method, and obeys a few laws is a monad.

#### Chain

map + join = chain

also called `>>=` (pronounced bind) or `flatMap`

```javascript

// associativity
compose(join, map(join)) == compose(join, join)

``

These laws get at the nested nature of monads so associativity focuses on joining the inner or outer types first to achieve the same result.

```

 M(M(M(a))) ? map(join) ? M(M(A))
     ?                      ?
    join                   join
     ?                      ?
  M(M(a)   ?   join   ?    M(a)

```

```javascript

// identity for all (M a)
compose(join, of) == compose(join, map(of)) == id

```

It states that, for any monad M, of and join amounts to id.

We can also map(of) and attack it from the inside out.

We call this "triangle identity" because it makes such a shape when visualized:

```
 M(a) ? M(M(a) ? M(a)
    \     |      /
     id  join  id
       \  |   /
         M(a)
```

```javascript

var mcompose = function(f, g) {
return compose(chain(f), chain(g));
}

// left identity
mcompose(M, f) == f

// right identity
mcompose(f, M) == f

// associativity
mcompose(mcompose(f, g), h) == mcompose(f, mcompose(g, h))

```

Monads form a category called the "Kleisli category" where all objects are monads and morphisms are chained functions

### Applicative Functors

Applicative Functors give us the ability to apply functors to each other

`ap` is a function that can apply the function contents of one functor to the value contents of another.

*An applicative functor is a pointed functor with an ap method*

```javascript

F.of(x).map(f) == F.of(f).ap(F.of(x))

```

`map`ping f is equivalent to `ap`ing a functor of f

Since we know map is equal to of/ap, we can write generic functions that will ap as many times as we specify:

```javascript

var liftA2 = curry(function(f, functor1, functor2) {
  return functor1.map(f).ap(functor2);
});

var liftA3 = curry(function(f, functor1, functor2, functor3) {
  return functor1.map(f).ap(functor2).ap(functor3);
});

```

```haskell
-- haskell
add <$> Right 2 <*> Right 3
```

 <$> is map (aka fmap) and <*> is just ap.


### Derived Functions

```javascript

// map derived from of/ap
X.prototype.map = function(f) {
return this.constructor.of(f).ap(this);
}

// map derived from chain
X.prototype.map = function(f) {
  var m = this;
  return m.chain(function(a) {
    return m.constructor.of(f(a));
  });
}

// ap derived from chain/map
X.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
};

```

#### Identity


```javascript

// identity
A.of(id).ap(v) == v


```

applying `id` all from within a functor shouldn't alter the value in v


```javascript

var v = Identity.of("Pillow Pets");
Identity.of(id).ap(v) == v


```

#### Homomorphism

```javascript

// homomorphism
A.of(f).ap(A.of(x)) == A.of(f(x))

```

A homomorphism is just a structure preserving map. In fact, a functor is just a homomorphism between categories as it preserves the original category's structure under the mapping.

```javascript

Either.of(_.toUpper).ap(Either.of("oreos")) == Either.of(_.toUpper("oreos"))

```

#### Interchange

The interchange states that it doesn't matter if we choose to lift our function into the left or right side of ap.

```javascript

// interchange
v.ap(A.of(x)) == A.of(function(f) { return f(x) }).ap(v)

```

Here is an example:

```javascript

var v = Task.of(_.reverse);
var x = 'Sparklehorse';

v.ap(Task.of(x)) == Task.of(function(f) { return f(x) }).ap(v)

```

#### Composition

And finally composition which is just a way to check that our standard function composition holds when applying inside of containers.

```javascript

// composition
A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w));



var u = IO.of(_.toUpper);
var v = IO.of(_.concat("& beyond"));
var w = IO.of("blood bath ");

IO.of(_.compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w))
```