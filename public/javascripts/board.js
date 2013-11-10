$(function() {
  /*************************
   * Card
   *************************/
  var Card = Backbone.Model.extend({
    defaults: function() {
      return {
        title: 'empty',
        order: this.collection.nextOrder(),
        done: false
      }
    }
  });

  var Cards = Backbone.Collection.extend({
    model: Card,
    url: '/cards',
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },
    comparator: 'order'
  });

  var CardView = Backbone.View.extend({
    tagName: 'div',
    template: $('#cardTemplate').html(),
    events: { 
      'drop': 'drop'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change', this.remove);
    },
    drop: function(e, index) {
      this.$el.trigger('updateOrder', [this.model, index]);
    },
    render: function() {
      this.$el.html(Mustache.to_html(this.template, this.model.toJSON()));
      return this;
    },
    clear: function() {
      this.model.destory();
    }
  });

  /*************************
   * Cardlist
   *************************/
  var Cardlist = Backbone.Model.extend({
    initialize: function() {
      this.cards = new Cards();
    }
  });

  var Cardlists = Backbone.Collection.extend({
    model: Cardlist,
    url: '/cardlists',
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },
    comparator: 'order'
  });


  var CardlistView = Backbone.View.extend({
    template: $('#cardlistTemplate').html(),
    events: {
      'updateOrder': 'updateOrder',
      'click .list-add-card': 'showCardComposer',
      'click .card-control .btn-add': 'addCardComposer',
      'click .card-control .btn-cancel': 'cancelCardComposer',
      'keydown .card-composer-title': 'keydownCardComposer'
      //'focusout .card-composer-title': 'hideCardComposer',
    },
    initialize: function() {
      this.listenTo(this.model.cards, 'add', this.addCard);
      this.listenTo(this.model.cards, 'reset sort', this.repaint);

      this.model.cards.fetch({reset: true});
    },
    /* list-card: sortable + draggable */
    makeSortable: function($cardArea) {
      $cardArea.sortable({
        connectWith: '.list-card-area',
        placeholder: 'card card-placeholder',
        cursor: 'move',
        scroll: true,
        start: function(e, ui) {
          $(ui.item).addClass('ondrag');
        },
        stop: function(e, ui) {
          ui.item.trigger('drop', ui.item.index());
          $(ui.item).removeClass('ondrag');
        }
      }).disableSelection();
    },
    render: function() {
      this.$el.html(Mustache.to_html(this.template, this.model.toJSON()));
      this.makeSortable(this.$el.find('.list-card-area'));
      return this;
    },
    repaint: function() {
      this.$('.list-card-area').empty();
      this.addAllCard();
    },
    addAllCard: function() {
      this.model.cards.each(this.addCard, this);
    },
    addCard: function(card) {
      var cardView = new CardView({model: card});
      this.$('.list-card-area').append(cardView.render().el);
    },
    updateOrder: function(e, model, position) {
      this.model.cards.remove(model);

      this.model.cards.each(function (model, index) {
        var order = index;
        if (index >= position)
          order += 1;
        model.set('order', order);
      });            

      model.set('order', position);
      this.model.cards.add(model, {at: position});
      this.model.cards.each(function(card) { card.save(); });

      // to update orders on server:
      this.repaint();
    },
    /* cardComposer */
    showCardComposer: function(e) {
      this.$el.find('.list-card-composer').removeClass('hide');
      this.$el.find('.card-composer textarea').focus();
      this.$el.find('.list-add-card').addClass('hide');
    },
    hideCardComposer: function(e) {
      this.$el.find('.list-card-composer').addClass('hide');
      this.$el.find('.list-add-card').removeClass('hide');
    },
    addCardComposer: function(e) {
      var composerInput = this.$el.find('.card-composer textarea');
      if (composerInput.val()) {
        this.model.cards.create({title: composerInput.val()});
        composerInput.val('').focus();
      }
      e.preventDefault();
    },
    keydownCardComposer: function(e) {
      if (e.keyCode == 13) {  // enter
        this.addCardComposer(e);
      } else if (e.keyCode == 27) { // esc
        this.cancelCardComposer(e);
      }
    },
    cancelCardComposer: function(e) {
      var composerInput = this.$el.find('.card-composer textarea');
      composerInput.val('');
      this.hideCardComposer();
      e.preventDefault();
    }
  });

  /*************************
   * Board
   *************************/
  var Board = Backbone.Model.extend({
    initialize: function() {
      this.cardlists = new Cardlists();
    }
  });

  var BoardView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model.cardlists, 'add', this.addCardlist);
      this.listenTo(this.model.cardlists, 'reset sort', this.repaint);

      this.model.cardlists.fetch({reset: true});
    },

    repaint: function() {
      this.$('.cardlist-area').empty();
      this.addAllCardlist();
    },

    addAllCardlist: function() {
      this.model.cardlists.each(this.addCardlist, this);
    },

    addCardlist: function(cardlist) {
      var cardlistView = new CardlistView({model: cardlist});
      this.$('.cardlist-area').append(cardlistView.render().el);
    }
  });

  var board = new BoardView({
    el: $('#board'),
    model: new Board()
  });
});
