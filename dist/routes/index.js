'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (request, response) {
  response.render('index');
});

router.get('/signup', function (request, response) {
  response.render('users/signup');
});

router.get('/login', function (request, response) {
  response.render('users/login');
});

router.get('/logout', function (request, response) {
  response.redirect('/');
});

module.exports = router;