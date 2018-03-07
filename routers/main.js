var express = require('express')
var router = express.Router()

router.get('/user',function(req,res,next){
	res.send('main - User');
})

router.get('/',function(req,res,next){
	console.log('访问主页')
	console.log(req.userInfo)
	res.render('main/index',{
		userInfo:req.userInfo
	});
})


module.exports = router;