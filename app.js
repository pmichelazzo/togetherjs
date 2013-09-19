#!/usr/bin/env node

var express = require('express');
var connect = require('connect');
var app = express();

app.use(function (req, res, next) {
  console.log(
    req.method,
    req.url,
    'referer=' + (req.headers.referer || '-'),
    'ip=' + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '-'),
    'user-agent="' + (req.headers['user-agent'] || '-').replace(/\"/g, "") + '"');
  next();
});

app.use(function (req, res, next) {
  res.redirect(301, "https://togetherjs.com" + req.url);
});

// Gzip output
app.use(connect.compress());
app.use(express.staticCache());
app.use(function(req, resp, next) {
  // Expire all other resources in three hours
  resp.setHeader('Cache-Control', 'public, max-age=10800');
  return next();
});

app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());
app.disable('x-powered-by');


// 404 Routing
app.get('*', function(req, res){
  res.status(404).sendfile('public/errors/404.html');
});

app.listen(process.env.PORT || 3000);
