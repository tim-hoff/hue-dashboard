var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hue Dashboard', ls1: 'Light Strip 1', ls2: 'Light Strip 2', lamp: 'Lamp' });
});

module.exports = router;
