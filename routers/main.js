var express = require('express')
var router = express.Router()
var Category = require("../models/Category")

router.get('/user',function(req,res,next){
	res.send('main - User');
})

router.get('/',function(req,res,next){
	console.log('访问主页')
	console.log(req.userInfo)
	//读取所有的分类信息
	Category.find(function(err,categories){
		console.log(categories)
		console.log(req.userInfo)
		res.render('main/index',{
			userInfo:req.userInfo,
			categories:categories
		});
	})
	return
})


module.exports = router;