'use strict';


/**
 * Switch Plugin: Auto play
 * author  Kael Zhang
 */

var _ = require('underscore');
var delay = require('../lib/delay');

module.exports = {
  name: 'autoplay',
  final_: true,

  ATTRS: {
    interval: {
      value: 3000
    },

    hoverStop: {
      value: true
    },

    /**
     * @type {boolean} if true, it will switch to the first when the right end reached
     */
    circular: {
      value: true
    }
  },

  init: function(self) {
    function autoplay() {
      var t = self;
      if (!t.triggerOn && !t.paused) {
        t.next(t.get('circular'));
      }
    };

    var autoPlayTimer,
      paused = false,

      EVENTS = self.get('EVENTS');

    function pause() {
      paused = true;
      autoPlayTimer.cancel();
    };

    function resume() {
      paused = false;
      autoPlayTimer.start();
    };


    self.on(EVENTS.AFTER_INIT, function() {
      var t = self;

      autoPlayTimer = delay(autoplay, t.get('interval'));

      // TODO
      // add queue support
      _.extend(t, {
        pause: pause,
        resume: resume
      });

      t.get('hoverStop') && t.container.on({

        // when mouse hovers over the container, stop autoplaying
        mouseenter: function() {
          t.paused = true;
        },

        mouseleave: function() {
          t.paused = false;
          autoPlayTimer.start();
        }
      });

      autoPlayTimer.start();
    });

    self.on(EVENTS.BEFORE_SWITCH, function() {
      autoPlayTimer.cancel();
    });

    self.on(EVENTS.COMPLETE_SWITCH, function() {
      !paused && autoPlayTimer.start();
    });
  }
};

/**
 
 2011-10-31  Kael:
 - use .next() method

 2011-08-19  Kael:
 - fix a bug calculating activeIndex when auto playing

 TODO:
 A. add api: pause and resume

 */