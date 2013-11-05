$(function() {
  // Card Model
  var Card = Backbone.Model.extend({
    defaults: function() {
      return {
        title: 'empty',
        order: cardList.nextOrder(),
        done: false
      }
    }
  });

  // Card View
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
      'updateOrder': 'updateOrder',
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
    repaint: function() {
      this.$('.list-card-area').html('');
      this.addAllCard();
    },
    addAllCard: function() {
      cardList.each(this.addCard, this);
    },
    addCard: function(card) {
      var cardView = new CardView({model: card});
      this.$('.list-card-area').append(cardView.render().el);
    },
    updateOrder: function(e, model, position) {
      cardList.remove(model);

      cardList.each(function (model, index) {
        var order = index;
        if (index >= position)
          order += 1;
        model.set('order', order);
      });            

      model.set('order', position);
      cardList.add(model, {at: position});
      console.log(cardList.pluck('id'));

      // to update orders on server:
      this.repaint();
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
      ui.item.trigger('drop', ui.item.index());
      $(ui.item).removeClass('ondrag');
    }
  }).disableSelection();
});
