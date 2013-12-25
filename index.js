'use strict';

var Switch = module.exports = require('./lib/switch');

// TODO:
// use plugins as entries ?
Switch.Plugins = {
    accordion   : require('./plugins/accordion'),
    autoplay    : require('./plugins/autoplay'),
    carousel    : require('./plugins/carousel'),
    cleaner     : require('./plugins/cleaner'),
    endless     : require('./plugins/endless'),
    fade        : require('./plugins/fade'),
    lazyload    : require('./plugins/lazyload'),
    step        : require('./plugins/step'),
    tabswitch   : require('./plugins/tabswitch')
};

