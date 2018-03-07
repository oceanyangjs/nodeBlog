var express = require('express')
var router = express.Router()
var User = require("../models/User")
//判断管理员身份
router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send('只有管理员才可以进入后台管理')
		return
	}
	next();
})

// 用户管理
router.get('/user',function(req,res,next){

	/*
		从数据库读取所有用户数据
	*/
	/*
		限制获取的数据条数 limit(number)
		忽略数据的条数 skip(number)
		skip(2) 从第三条开始取
	*/

	var page =  Number(req.query.page || 1);
	var limit = 1;

	User.count(function(err,count){
		console.log('总条数为' + count)
		var pages = Math.ceil(count/limit);//总页数

		page = Math.min(page,pages);
		page = Math.max(page,1);

		var skip = page - 1;

		User.find({}).limit(limit).skip(skip).exec(function(err,users){
		//console.log(users)
		res.render('admin/user_index',{
			users:users,
			userInfo:req.userInfo,
			page:page,
			count:count,
			limit:limit,
			pages:pages
		})
	})
	})

	// User.find().limit(1).then(function(users){
	// 	res.render('admin/user_index',{
	// 		users:users
	// 	})
	// })

	//res.send('后台管理首页')
	return
})
// 首页
router.get('/',function(req,res,next){
	res.render('admin/index',{
		userInfo:req.userInfo
	})
	//res.send('后台管理首页')
	return
})

module.exports = router;