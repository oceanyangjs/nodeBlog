var express = require('express')
var router = express.Router()

router.get('/user',function(req,res,next){
	res.send('main - User');
})

router.get('/',function(req,res,next){
	res.render('main/index');
})


module.exports = router;