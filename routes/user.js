
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
  res.render('login', { title:"login", user: req.user, message: req.flash('error') });
};
