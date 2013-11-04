$(function() {
  // Card
  var Card = Backbone.Model.extend({
    defaults: function() {
      return {
        title: 'empty',
        order: cardList.nextOrder(),
        done: false
      }
    }
  });

  // CardList (List of Cards)
  var CardList = Backbone.Collection.extend({
    model: Card,
    url: '/cards',
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },
    comparator: 'order'
  });

  var cardList = new CardList();

  var CardView = Backbone.View.extend({
    tagName: 'div',
    template: $('#cardTemplate').html(),
    events: { },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change', this.remove);
    },
    render: function() {
      this.$el.html(Mustache.to_html(this.template, this.model.toJSON()));
      return this;
    },
    clear: function() {
      this.model.destory();
    }
  });

  var BoardView = Backbone.View.extend({
    el: $('#board'),
    events: {},
    initialize: function() {
      this.listenTo(cardList, 'reset', this.addAllCard);
      this.listenTo(cardList, 'all', this.render);
      cardList.fetch({reset: true});
    },
    addAllCard: function() {
      cardList.each(this.addCard, this);
    },
    addCard: function(card) {
      var cardView = new CardView({model: card});
      this.$('#todoList .list-card-area').append(cardView.render().el);
    },
    render: function() {

    }
  });

  var board = new BoardView;
});

/* list-card: sortable + draggable */
$(document).ready(function() {
  $('.list .list-card-area').sortable({
    connectWith: '.list-card-area',
    placeholder: 'list-card list-card-placeholder',
    cursor: 'move',
    scroll: true,
    start: function(e, ui) {
      $(ui.item).addClass('list-card-ondrag');
    },
    stop: function(e, ui) {
      $(ui.item).removeClass('list-card-ondrag');
    }
  }).disableSelection();
});
