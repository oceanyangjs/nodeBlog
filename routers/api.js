var express = require('express')
var router = express.Router()
var User = require('../models/User')

//统一返回格式
var responseData;
router.use(function(req,res,next){
	//console.log(3333)
	responseData={
		code:0,
		message:''
	}
	next();
})
/*router.get('/user',function(req,res,next){
	res.send('api - User');
})*/

/*
	用户注册逻辑
	1.用户名不能为空
	2.密码不能为空
	3.两次输入密码必须一致
	4.用户名是否已经被注册
		数据库查询
*/
router.post('/user/register',function(req,res,next){
	console.log(req.body)
	// console.log(111)
	var username = req.body.username;
	var pwd = req.body.pwd;
	var repwd = req.body.repwd;
	//res.send('api - Userregister');
	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空'
		res.json(responseData)
		console.log('用户名不能为空')
		return;
	}

	if(pwd == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空'
		res.json(responseData)
		console.log('密码不能为空')
		return;
	}

	if(pwd != repwd){
		responseData.code = 3;
		responseData.message = '两次输入的密码不一致'
		res.json(responseData)
		console.log('两次输入的密码不一致')
		return;
	}

	//数据库用户名是否存在验证
	User.findOne({ username: username }, function(err,userInfo){
		console.log(userInfo)
		if(userInfo){
			responseData.code = 4;
			responseData.message = '用户名已经被注册'
			res.json(responseData)
			return
		}
		var user = new User({
			username:username,
			password:pwd
		})
		user.save(function(newUserInfo){
			responseData.message = '注册成功'
			console.log('注册成功')
			res.json(responseData)
			return
		});
	});
/*	User.findOne({username:username}).then(function(userInfo){
		console.log(userInfo)
		if(userInfo){
			responseData.code = 4;
			responseData.message = '用户名已经被注册'
			res.json(responseData)
			return
		}
		// var user = new User({
		// 	username:username,
		// 	password:pwd
		// })
		// user.save(function(newUserInfo){
		// 	responseData.message = '注册成功'
		// 	console.log('注册成功')
		// 	res.json(responseData)
		// 	return
		// });
	})*/
})



/*
	用户登录逻辑
*/
router.post('/user/login',function(req,res,next){
	console.log(req.body)
	var username = req.body.username;
	var pwd = req.body.pwd;
	if(username == '' || pwd == ''){
		responseData.code = 1;
		responseData.message = '用户名或密码不能为空'
		res.json(responseData)
		return
	}
	//数据库查询用户名密码的匹配
	User.findOne({username:username,password:pwd},function(err,userInfo){
		console.log(userInfo)
		if(!userInfo){
			responseData.code = 2;
			responseData.message = '用户名或密码错误'
			res.json(responseData)
			return
		}else{
			responseData.message = '登录成功'
			responseData.userInfo = {
				username:userInfo.username,
				_id:userInfo._id,
				isAdmin:userInfo.isAdmin
			}
			console.log('登陆成功')
			console.log(responseData)
			req.cookies.set('userInfo',JSON.stringify({
				username:userInfo.username,
				_id:userInfo._id,
				isAdmin:userInfo.isAdmin
			}));
			res.json(responseData)
			return
		}
	})
})

router.get('/user/logout',function(req,res,next){
	req.cookies.set('userInfo',null);
	res.json(responseData);
})

router.get('/comment',function(req,res,next){
	res.send('api - User');
})

module.exports = router;