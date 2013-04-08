(function() {

  var changeFlipDirection = function(elem, dir) {
    var current = elem.className.match(/x-flip-direction-\w+/);
    if (current) xtag.removeClass(elem, current[0]);
    xtag.addClass(elem, 'x-flip-direction-' + dir);
  };

  xtag.register('x-flipbox', {
    lifecycle: {
      created: function() {
        xtag.addClass(this, 'x-flip-direction-right');
      }
    },
    events:{
      'transitionend': function(e) {
        if (e.target == this) xtag.fireEvent(this, 'flipend');
      }
    },
    accessors: {
      flipDirection: {
        get: function() {
          var current = this.className.match(/x-flip-direction-(\w+)/);
          return current[1];

        },
        set: function(value) {
          if (xtag.hasClass(this ,'x-card-flipped')){
            xtag.skipTransition(this.firstElementChild, function() {
              changeFlipDirection(this, value);
            }, this);
          }
          else {
            changeFlipDirection(this, value);
          }
        }
      },
      flipped: {
        get: function() {
          return xtag.hasClass(this, 'x-card-flipped');
        }
      }
    },
    methods: {
      toggle: function() {
        xtag.toggleClass(this, 'x-card-flipped');
      }
    }
  });

})();
