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
      'click .card-control .btn-add': 'addCardComposer',
      'click .card-control .btn-cancel': 'cancelCardComposer',
      'keydown .card-composer-title': 'keydownCardComposer'
      //'focusout .card-composer-title': 'hideCardComposer',
    },
    initialize: function() {
      var $el = $(this.el);
      this.composer = $el.find('.list-card-composer');
      this.composer.append($(this.cardComposerTemplate));
      this.composerInput = this.composer.find('.card-composer-title');
      this.addCardBtn = $el.find('.list-add-card');

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
    /* cardComposer */
    showCardComposer: function() {
      this.composer.removeClass('hide');
      this.composer.find('textarea').focus();
      this.addCardBtn.addClass('hide');
    },
    hideCardComposer: function() {
      this.composer.addClass('hide');
      this.addCardBtn.removeClass('hide');
    },
    addCardComposer: function(e) {
      if (this.composerInput.val()) {
        cardList.create({title: this.composerInput.val()});
        this.composerInput.val('').focus();
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
      this.composerInput.val('');
      this.hideCardComposer();
      e.preventDefault();
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
