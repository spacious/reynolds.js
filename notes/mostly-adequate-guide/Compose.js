
var map = require("ramda").map;

var Compose = function(f_g_x){
  this.getCompose = f_g_x;
}

Compose.prototype.map = function(f){

  return new Compose(map(map(f), this.getCompose));
}

module.exports = Compose;