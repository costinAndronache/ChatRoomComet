var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/HardWareRoom', function(req,res, next) {
  var user_name = req.body.nickname;
  console.log(user_name);
  res.render('HardwareRoom', {title: 'HardWareRoom', username: user_name});
})

router.post('/SoftWareRoom', function(req,res, next) {
  var user_name = req.body.nickname;
  console.log(user_name);
  res.render('chatPage', {title: 'SoftWareRoom', username: user_name, roomAdress: '/SoftWareRoom'});
})

module.exports = router;
