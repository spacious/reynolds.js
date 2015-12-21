
function log(t){

  if(!t || typeof t !== "object" || !t.type){ return console.log(JSON.stringify(t));}

  var v = t.__value;
  var out = t.type + "(";
  if(v && v.type){
    while(v && v.type){ out += v.type + "(" +  JSON.stringify(v.__value) + ")"; v = v.__value;}
  }else{
    out += JSON.stringify(v);
  }
  out += ")";
  console.log(out);
}

var R = require("ramda");
var moment = require('moment');
var match = R.match;
var curry = R.curry;
var compose = R.compose;
var concat = R.concat;
var prop = R.prop;
var add = R.add;
var map = R.map;
var id = R.identity;


var Task = require('data.task')
var Compose = require("./Compose");
var Container = require("./Container");
var Maybe = require("./Maybe");
var Either = require("./Either");
var Left = Either.Left;
var Right = Either.Right;
var IO = require("./IO");


//  maybe :: b -> (a -> b) -> Maybe a -> b
var maybe = curry(function(x, f, m) {
  return m.isNothing() ? x : f(m.__value);
});

//  either :: (a -> c) -> (b -> c) -> Either a b -> c
var either = curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
});

//  chain :: Monad m => (a -> m b) -> m a -> m b
var chain = curry(function(f, m){
  return m.map(f).join(); // or compose(join, map(f))(m)
});

//  join :: Monad m => m (m a) -> m a
var join = function(mma){ return mma.join(); }

// Container
log(Container.of(3)); //=> Container(3)
log(Container.of("hotdogs")) //=> Container("hotdogs")
log(Container.of(Container.of({name: "yoda"}))) //=> Container(Container({name: "yoda" }))
log(Container.of(2).map(function(two){ return two + 2 }))//=> Container(4)
log(Container.of("flamethrowers").map(function(s){ return s.toUpperCase() }))//=> Container("FLAMETHROWERS")
// Maybe
log(Maybe.of("Malkovich Malkovich").map(match(/a/ig)));//=> Maybe(['a', 'a'])
log(Maybe.of(null).map(match(/a/ig)));//=> Maybe(null)
log(Maybe.of({name: "Boris"}).map(prop("age")).map(add(10))); //=> Maybe(null)
log(Maybe.of({name: "Dinah", age: 14}).map(prop("age")).map(add(10)));//=> Maybe(24)
log(Right.of("rain").map(function(str){ return "b"+str; }));// Right("brain")
log(Left.of("rain").map(function(str){ return "b"+str; }));// Left("rain")
log(Right.of({host: 'localhost', port: 80}).map(prop('host')));// Right('localhost')
log(Left.of("rolls eyes...").map(prop("host")));// Left('rolls eyes...')

//  getAge :: Date -> User -> Either(String, Number)
var getAge = curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
  if (!birthdate.isValid()) return Left.of("Birth date could not be parsed");
  return Right.of(now.diff(birthdate, 'years'));
});
log(getAge(moment(), {birthdate: '2005-12-12'}));// Right(9)
log(getAge(moment(), {birthdate: '200x10704'}));// Left("Birth date could not be parsed")

//  fortune :: Number -> String
var fortune  = compose(concat("If you survive, you will be "), add(1));
//  zoltar :: User -> Either(String, _)
var zoltar = compose(map(log), map(fortune), getAge(moment()));
zoltar({birthdate: '2005-12-12'});// "If you survive, you will be 10"// Right(undefined)
log(zoltar({birthdate: 'balloons!'}));// Left("Birth date could not be parsed")

// identity
// map(id) === id;

var idLaw1 = map(id);
var idLaw2 = id;

log(idLaw1(Container.of(2)));//=> Container(2)
log(idLaw2(Container.of(2))); //=> Container(2)

var compLaw1 = compose(map(concat(" world")), map(concat(" cruel")));
var compLaw2 = map(compose(concat(" world"), concat(" cruel")));

log(compLaw1(Container.of("Goodbye")));//=> Container(' world cruelGoodbye')
log(compLaw2(Container.of("Goodbye")));//=> Container(' world cruelGoodbye')

//  safeProp :: Key -> {Key: a} -> Maybe a
var safeProp = curry(function(x, obj) {
  return new Maybe(obj[x]);
});

//  safeHead :: [a] -> Maybe a
var safeHead = safeProp(0);

var mmo = Maybe.of(Maybe.of("nunchucks"));
log(mmo.join());

//  firstAddressStreet :: User -> Maybe Street
var firstAddressStreet = compose(join, map(safeProp('street')), join, map(safeHead), safeProp('addresses'));

log(
  firstAddressStreet(
  {addresses: [{street: {name: 'Mulburry', number: 8402}, postcode: "WC2N" }]}
));

log(
  Maybe.of(3).chain(function(three) {
  return Maybe.of(2).map(add(three));
}));

log(
  Maybe.of(null).chain(safeProp('address')).chain(safeProp('street')));

log(
  Container.of(2).chain(function(two) {
  return Container.of(3).map(add(two));
}));
log(
  Container.of(add(2)).ap(Container.of(3))
);
log(
  Container.of(2).map(add).ap(Container.of(3))
);

log(
  Maybe.of(add).ap(Maybe.of(2)).ap(Maybe.of(3))
);
