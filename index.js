'use strict';

module.exports = s;

function s() {
  return new Switch();
}

s.Switch = require('./lib/switch');

// TODO:
// use plugins as entries ?
s.Plugins = require('./lib/plugins');
