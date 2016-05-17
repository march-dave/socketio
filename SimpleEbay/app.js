'use strict';
require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var stormpath = require('express-stormpath');

var routes = require('./routes/index');
var users = require('./routes/users');
var items = require('./routes/items');
var bids = require('./routes/bids');

var app = express();

var mongoose = require('mongoose');
const MONGOURL = process.env.MONGODB_URI || 'mongodb://localhost:/simpleebay-app'
mongoose.connect(MONGOURL, err => {
    console.log(err || `Connected to MongoDB at ${MONGOURL}`);
});

app.use(stormpath.init(app, {
  web: {
    me: {
      expand: {
        customData: true
      }
    }
  },
    register: {
      form: {
        fields: {
          favoriteColor: {
            enabled: true,
            label: 'Favorite Color',
            name: 'favoriteColor',
            placeholder: 'E.g. Red, Blue',
            required: true,
            type: 'text'
          }
        }
      }
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/items', items);
app.use('/bids', bids);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
