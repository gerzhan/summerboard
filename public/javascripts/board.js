$(document).ready(function() {
  /* list-card: sortable + draggable */
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
