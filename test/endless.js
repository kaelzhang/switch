'use strict';

var s = require('../index.js');

s().plugin('carousel','endless', 'autoplay').init({
  CSPre       : cspre,
  triggerType : 'click',
  itemCS      : 'ul',
  containerCS : '.pic-txt',
  prevCS      : '.turn-left',
  nextCS      : '.turn-right',
  interval    : 10000,
  stage       : 1,
  move        : 1,
  itemSpace   : 240
}).on({
  beforeInit: function() {
    $(cspre).find('ul').css({
      'position': 'absolute'
    }).each(function(j, item) {
      $(item).css('left', 240 * j);
      if(j == 0) {
        $(item).addClass('ul-show');
      }
    });
    showRecType($(cspre).find('ul').eq(0).attr('id'));
  },
  beforeSwitch: function() {
    var ulShow = $(cspre).one('.ul-show');
    ulShow.removeClass('ul-show');
    if(ulShow.next().count() > 0){
      var ulShowNext = ulShow.next();
    } else {
      var ulShowNext = $(cspre).one('ul');
    }
    ulShowNext.addClass('ul-show');
    showRecType(ulShowNext.attr('id'));
  }
});