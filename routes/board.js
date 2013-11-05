var cards = [{
  title: 'Support Bootstrap v3.0.1',
  members: [],
  comments: [],
  checklist: [],
  attachments: []
}, {
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

exports.addCard = function(req, res) {
  var card = req.body;
  console.log('addCard:' + JSON.stringify(card));
  cards.push(card);
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
