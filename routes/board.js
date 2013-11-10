var _ = require('lodash');

/* pages */
exports.index = function(req, res){
  res.render('board', { title: 'summerboard' });
};

exports.board = function(req, res){
  res.render('board', { title: 'summerboard' });
};

var genUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

/* cards */
var cards = [{
  id: '9841680c-10e9-4db9-b16f-26ae3c9d8d43',
  title: 'Support Bootstrap v3.0.1',
  members: [],
  comments: [],
  checklist: [],
  attachments: []
}, {
  id: '6431a765-35c0-47d4-87ee-1304815f7138',
  title: 'Support IE8+',
  members: [],
  comments: [],
  checklist: [],
  attachments: []
}];

/*
 * GET list of card.
 */
exports.listCard = function(req, res) {
  var boardId = req.boardId;
  console.log('listCard:' + boardId);
  res.json(cards);
};

/*
 * POST card.
 */
exports.addCard = function(req, res) {
  var card = req.body;
  card.id = genUUID();
  console.log('addCard:' + JSON.stringify(card));
  cards.push(card);
};

/*
 * PUT card.
 */
exports.updateCard = function(req, res) {
  var updated = req.body;
  console.log('updateCard:', updated.id, JSON.stringify(updated));
  var idx = -1;
  for (var i=0; i < cards.length; i++) {
    if (cards[i].id == updated.id) { idx = i; break; }
  }
  if (idx != -1) cards[idx] = updated;
};

/* cardlists */
var cardlists = [{
  id: '03ee0ffa-1681-4d73-9a8a-61bce8097c50',
  title: 'To Do'
}, {
  id: 'a35fde81-408a-4e38-8f56-8a2dc05c5e02',
  title: 'Doing'
}, {
  id: 'aa04fbe9-c61d-4e54-8d9a-2235c549c241',
  title: 'Done'
}];

/*
 * GET list of cardlist.
 */
exports.listCardlist = function(req, res) {
  var boardId = req.boardId;
  console.log('listCardlist:' + boardId);
  res.json(cardlists);
};

/*
 * POST cardlist.
 */
exports.addCardlist = function(req, res) {
  var cardlist = req.body;
  cardlist.id = genUUID();
  console.log('addCardlist:' + JSON.stringify(card));
  cardlists.push(cardlist);
};

/*
 * PUT cardlist.
 */
exports.updateCardlist = function(req, res) {
  var updated = req.body;
  console.log('updateCardlist:', updated.id, JSON.stringify(updated));
  var idx = -1;
  for (var i=0; i < cardlists.length; i++) {
    if (cardlists[i].id == updated.id) { idx = i; break; }
  }
  if (idx != -1) cardlists[idx] = updated;
};

/*
 * GET list of board.
 */
exports.listBoard = function(req, res) {
  var username = req.username;
  console.log('listBoard:' + username);
  res.json([{
    title: 'summernote',
    members: []
  }]);
};
