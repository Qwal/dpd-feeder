var Resource = require('deployd/lib/resource')
  , util = require('util')
  , path = require('path')

function Feeder() {
  Resource.apply(this, arguments);
}

module.exports = Feeder;

util.inherits(Feeder, Resource);

Feeder.dashboard = {
  path: path.join(__dirname, 'dashboard')
}