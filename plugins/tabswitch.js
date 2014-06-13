/**
 * Switch Plugin: Tab Switching
 * author  Kael Zhang
 */

module.exports = {
  name: 'tabswitch',

  // no plugins will be added after this one
  final_: true,

  init: function(self) {
    var ITEM_ON_CLS = 'itemOnCls';

    self.on('beforeSwitch', function() {
      var t = this,
        activeItem = t._getItem(t.activeIndex);

      activeItem && activeItem.removeClass(t.get(ITEM_ON_CLS));
      t._dealTriggerCls(true);
    });

    self.on('onSwitch', function() {
      var t = this,
        active = t.activeIndex = t.expectIndex,
        activeItem = t._getItem(active);

      activeItem && activeItem.addClass(t.get(ITEM_ON_CLS));
      t._dealTriggerCls(false, active);

      t.emit('completeSwitch');
    });
  }
};


/**
 change log
 
 2012-04-22  Kael:
 - fix a runtime error if there's no items at the beginning
 
 2012-04-19  Kael:
 - turn back the missing COMPLETE_SWITCH event
 
 2011-10-31  Kael:
 - use _dealTriggerCls and _getItem instead of old methods
 
 */