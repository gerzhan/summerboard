/*
 * GET cards listing.
 */
exports.list = function(req, res){
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
