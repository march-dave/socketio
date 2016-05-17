var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var stormpath = require('express-stormpath');

router.get('/', stormpath.getUser, function(req, res, next) {

  console.log('req.user', req.user);

  res.render('index', { title: 'Express' });
});


router.get('/modify', stormpath.loginRequired, (req, res) => {

  // req.user.customData.cupcakes = 'frosted';

  req.user.customData.save((err, customData) => {
    res.send(customData);
  });

  req.user.save((err, savedUser) => {
    if(err) return res.status(400).send(err);
    res.send(savedUser);
  });

});

module.exports = router;
