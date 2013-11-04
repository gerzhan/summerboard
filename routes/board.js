/*
 * GET list of cardList.
 */
exports.listCardList = function(req, res) {
  var boardId = req.boardId;
  console.log('listCardList:' + boardId);
  res.json([{
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
  }]);
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
