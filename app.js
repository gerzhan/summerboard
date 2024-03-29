/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var board = require('./routes/board');
var http = require('http');
var path = require('path');
var auth = require('./middlewares/auth');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: "Super simple Task board"}));
app.use(flash());
app.use(auth.initialize());
app.use(auth.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=alan&password=1234" http://127.0.0.1:3000/login
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res) {
  res.redirect('/boards');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// pages
app.get('/', routes.index);
app.get('/boards', auth.ensureAuthenticated, board.index);
app.get('/boards/:id', board.board);

// boards
app.get('/cards', board.listCard);
app.post('/cards', board.addCard);
app.put('/cards/:id', board.updateCard);

app.get('/cardlists', board.listCardlist);
app.post('/cardlists', board.addCardlist);
app.get('/cardlists/:id', board.updateCardlist);


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
