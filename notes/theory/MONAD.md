
# Monad

Formally, a monad consists of a type constructor M and two operations, bind and return (where return is often also called unit):

- The return operation takes a value from a plain type and puts it into a monadic container using the constructor, creating a monadic value.

- The bind operation takes as its arguments a monadic value and a function from a plain type to a monadic value, and returns a new monadic value.

or return, fmap and join:

- The fmap operation, with type ```(t?u) ? M t?M u```, takes a function between two types and produces a function that does the "same thing" to values in the monad.

- The join operation, with type ```M (M t)?M t```, "flattens" two layers of monadic information into one.




## Maybe

```
Maybe t = Just t | Nothing
```

``` >>= `` bind binary operator

`` liftM2 `` (haskell) take two monadic values and combine their contents using another function

## IO

We can think of a value of type IO as an action that takes as its argument the current state of the world, and will return a new world where the state has been changed according to the function's return value.

## State

A state monad allows a programmer to attach state information of any type to a calculation.

## Writer

## Comonads

They are defined by a type constructor W T and two operations:

- extract with type W T ? T for any T
- extend with type (W T ? T' ) ? W T ? W T'

```javascript

// FantasyLand Comonad
w.extend(_w => _w.extract()) == w
w.extend(f).extract() == f(w)
w.extend(f) = w.extend(x => x).map(f)


```