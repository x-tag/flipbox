(function() {

  xtag.register('x-flipbox', {
    lifecycle: {
      created: function() {
        if (this.flipped){
          xtag.skipTransition(this.firstElementChild,function(){});
        } else {
          xtag.skipTransition(this.lastElementChild,function(){});
        }
      }
    },
    events:{
      'transitionend': function(e) {
        if (e.target == this) xtag.fireEvent(this, 'flipend');
      }
    },
    accessors: {
      direction: {
        attribute: {},
        set: function(value) {
          if (this.flipped){
            xtag.skipTransition(this.firstElementChild, function() {
              this.setAttribute('direction', value);
            }, this);
          }
        }
      },
      flipped: {
        attribute: { boolean: true }
      }
    },
    methods: {
      toggle: function() {
        this.flipped = !this.flipped;
      }
    }
  });

})();
