'use strict';

module.exports = function(fn, delay, isInterval) {
  var ret = {
    start: function() {
      ret.cancel();
      return ret.id = isInterval ? setInterval(fn, delay) : setTimeout(fn, delay);
    },
    cancel: function() {
      var timer = ret.id;

      ret.id = isInterval ? clearInterval(timer) : clearTimeout(timer);
      return ret;
    }
  };
  return ret;
};