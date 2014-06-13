'use strict';

/**
 * module  asqueue
 * author  Kael Zhang

 Asynchronous and Synchronous Queue: 
 - Converter: put all specified methods into an executing queue before initialization methods completed
 - Runner: execute a specified list of methods
 
 which could:
 - keep the executing ORDER even if the queue is mixed with both asynchronous and synchronous methods
 - make sure method A will be executed before method B if assigned to
 - make sure a method will be executed only once if specified 
 
 <code>
    // .plugin method is an asynchronous method, but .init method relies on the effect which the .plugin method caused
    new Switch().plugin('carousel').init({...});
 </code>
 
 example:
 <code>
 
 var ASQ = require('until/asqueue'),
     asq_r,
     module = {
        a: function(){
            log('a');
        },
        
        b: function(){
            log('b');
            asyncMethod(function(){
                log('b callback');
                asq_r.resume();
            });
        }
     }
 
 asq_r = new ASQ.Runner([
    {
        method: 'b',
        auto: false
    },
    
    'a'
 ], module);
 
 asq_r.run();

 </code>
 
 result:
 b
 b callback
 a
 
 */


exports.Runner = Runner;
exports.Converter = Converter;

var util = require('util');

function NOOP() {}


// @param {Array.<function(),string,Object>} items
//     {function()}
//     {string}
//     {Object} detail configuration for each method
//         {
//             auto: {boolean}, default to true
//             once: {boolean}, default to false
//             method: {function()|string}
//             args: {Array} arguments
//         }
// @param {Object} host
function Base(items, host) {
  this._stack = [];

  this._presetItems = lang.makeArray(items);
  this.host = host || null;
}


// resume the paused executing queue
Base.prototype.resume = function() {
  var self = this;
  self.processing = false;

  return self._next();
};


// apply default settings
// 'method' -> {name: 'method'}
Base.prototype._santitize = function(obj, undef) {
  var self = this,
    host = self.host,
    mix = K.mix;

  if (K.isFunction(obj)) {
    obj = {
      method: obj
    };

  } else if (K.isPlainObject(obj)) {
    obj = mix(obj, self._santitize(obj.method), true, ['method', 'bind', 'id']);

    host && !('bind' in obj) && (obj.bind = host);

  } else if (K.isString(obj) && host) {
    obj = {
      method: host[obj],
      bind: host,
      id: obj
    };

  } else {
    obj = {};
  }

  return mix({
    auto: true,
    once: false
  }, obj);
};


Base.prototype._next = function() {
  var self = this,
    current, fn;

  if (!self.processing && (current = self._stack.shift()) && (fn = current.method)) {
    self.processing = true;
    fn.apply(current.bind || null, current.args || []);

    return current.auto && self.resume();
  }
};


function Runner() {
  Base.apply(this, arguments);
}


util.inherits(Runner, Base);

/**
 * run the list of configured methods
 */
Runner.prototype.run = function(queue) {
  var self = this;

  self._stack = self._sd(queue ? K.makeArray(queue) : self._presetItems);

  self.resume();
};


Runner.prototype.stop = function() {
  this._stack.length = 0;
};


// santitize data
Runner.prototype._sd = function(queue) {
  var self = this,
    ret = [];

  queue.forEach(function(q) {
    ret.push(self._santitize(q));
  });

  return ret;
};


function Converter() {
  Base.apply(this, arguments);
}

util.inherits(Converter, Base);

// make all specified method queue-supported
Converter.prototype.on = function() {
  var self = this,
    host = self.host;

  self._items = {};
  self._history = [];

  if (host) {
    self._presetItems.forEach(function(i) {
      i && self._add(i);
    });
  }

  self._converted = true;

  return self;
};


// recover the converted methods
Converter.prototype.off = function() {
  var identifier,
    self = this,
    host = self.host,
    name;

  for (name in self._items) {
    delete host[name];
    host[name] = self._items[name];
  }

  self._clean();
  self._converted = false;

  return self;
};


Converter.prototype._clean = function() {
  var self = this;
  self._items = {};
  self._stack.length = self._history.length = 0;
};


Converter.prototype._add = function(obj) {
  var self = this,
    host = self.host,
    identifier;

  if (self._converted || !host) return self;

  obj = self._santitize(obj);
  identifier = obj.id;

  delete obj.id;

  if (identifier) {
    self._items[identifier] = obj.method;

    host[identifier] = function() {
      var id = identifier,
        clone, mix;

      if (
        self._history.indexOf(obj.before) === -1 &&
        (!obj.once ||
          self._history.indexOf(id) === -1
        )
      ) {
        mix = K.mix;
        clone = mix({}, obj);
        clone.args = arguments;

        self._stack.push(clone);
        self._history.push(id);
      }

      if (obj.once) {
        self._items[id] = NOOP;
      }

      // avoid recursive invocation
      setTimeout(function() {
        self._next();
      }, 0);

      return host; // chain
    }
  }
};


/**
 change log:
 
 TODO:
 A. add judger instead of property 'once', and also improve it. 
 B. refractor, splitting basic functionalities of queue
 
 */