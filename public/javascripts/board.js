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

  var CardListView = Backbone.View.extend({
    el: $('#todoList'),
    cardComposerTemplate: $('#cardComposerTemplate').html(),
    events: {
      'click .list-add-card': 'showCardComposer',
      'blur .card-composer-title': 'hideCardComposer',
      'keypress .card-composer-title': 'enterCardComposer'
    },
    initialize: function() {
      this.addCardBtn = $(this.el).find('.list-add-card');

      this.listenTo(cardList, 'add', this.addCard);
      this.listenTo(cardList, 'reset', this.addAllCard);

      cardList.fetch({reset: true});
    },
    addAllCard: function() {
      cardList.each(this.addCard, this);
    },
    addCard: function(card) {
      var cardView = new CardView({model: card});
      this.$('.list-card-area').append(cardView.render().el);
    },
    showCardComposer: function() {
      if (!this.composer) {
        this.composer = $(this.cardComposerTemplate);
        this.$('.list-card-area').append(this.composer);
      } else {
        this.composer.removeClass('hide');
      }
      this.composer.find('textarea').focus();
      this.addCardBtn.addClass('hide');
    },
    hideCardComposer: function() {
      this.composer.addClass('hide');
      this.addCardBtn.removeClass('hide');
    },
    enterCardComposer: function(e) {
      if(e.keyCode == 13) { //enterkey press
        var cardComposer = this.$('.card-composer-title');
        cardList.create({title: cardComposer.val()});
        cardComposer.val('');
        cardComposer.focus();
        e.preventDefault();
      }
    }
  });

  var board = new CardListView;
});

/* list-card: sortable + draggable */
$(document).ready(function() {
  $('.list .list-card-area').sortable({
    connectWith: '.list-card-area',
    placeholder: 'card card-placeholder',
    cursor: 'move',
    scroll: true,
    start: function(e, ui) {
      $(ui.item).addClass('ondrag');
    },
    stop: function(e, ui) {
      $(ui.item).removeClass('ondrag');
    }
  }).disableSelection();
});
