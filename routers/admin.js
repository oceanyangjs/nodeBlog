var express = require('express')
var router = express.Router()
var User = require("../models/User")
var Category = require("../models/Category")
var Content = require("../models/Content")
var mongoose = require('mongoose')
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

// 分类首页
router.get('/category',function(req,res,next){

	var page =  Number(req.query.page || 1);
	var limit = 1;

	Category.count(function(err,count){
		console.log('总条数为' + count)
		var pages = Math.ceil(count/limit);//总页数

		page = Math.min(page,pages);
		page = Math.max(page,1);

		var skip = page - 1;

		//排序 1代表升序 -1代表降序
		Category.find({}).sort({_id:-1}).limit(limit).skip(skip).exec(function(err,categories){
		//console.log(users)
		res.render('admin/category_index',{
			categories:categories,
			userInfo:req.userInfo,
			page:page,
			count:count,
			limit:limit,
			pages:pages
		})
	})
	})

})

// 添加分类
router.get('/category/add',function(req,res,next){
	res.render('admin/category_add',{
		userInfo:req.userInfo
	})
	//res.send('后台管理首页')
})

// 分类修改
router.get('/category/edit',function(req,res,next){
	//获取要修改的信息，并且用表单形式展示出来
	//var fileId = mongoose.Types.ObjectId();
	var id = req.query.id || '';
	//fileId = new ObjectId(id)
	console.log('分类id' + id)

	Category.findOne({
		_id:id
	},function(err,category){
		if (!category) {
			res.render('admin/error',{
				message:'分类信息不存在'
			})
		}else{
			res.render('admin/category_edit',{
				category:category
			})
		}
	})
	// Category.findOne({
	// 	id:ObjectId(id)
	// }).then(function(category){
	// 	console.log(category);
	// 	res.end()
	// })
	//res.send('后台管理首页')
})

// 分类修改保存
router.post('/category/edit',function(req,res,next){
	//获取要修改的信息，并且用表单形式展示出来
	//var fileId = mongoose.Types.ObjectId();
	var id = req.query.id || '';
	var name = req.body.name;
	//fileId = new ObjectId(id)
	console.log('分类id' + id)

	Category.findOne({
		_id:id
	},function(err,category){
		if (!category) {
			res.render('admin/error',{
				message:'分类信息不存在'
			})
		}else{
			//当用户没有进行修改时
			if (name == category.name) {
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'修改成功',
					url:'/admin/category'
				})
			}else{
				//要修改的名称是否已经在数据库中存在
				Category.findOne({
					_id:{$ne:id},//$ne表示不相等 --- mongodb
					name:name
				},function(err,result){
					if (!result) {
						Category.update({
							_id:id
						},{name:name},function(err,updateRs){
							res.render('admin/success',{
								userInfo:req.userInfo,
								message:'修改成功',
								url:'admin/category'
							})
						})
					}else{
						res.render('admin/error',{
							userInfo:req.userInfo,
							message:'数据库中存在同名的分类'
						})
						return Promise.reject(); //返回
					}
				})
			}
		}
	})
	// Category.findOne({
	// 	id:ObjectId(id)
	// }).then(function(category){
	// 	console.log(category);
	// 	res.end()
	// })
	//res.send('后台管理首页')
})

// 分类删除
router.get('/category/delete',function(req,res,next){
	//获取要删除的id
	var id = req.query.id || '';
	Category.remove({
		_id:id
	},function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'删除成功',
			url:'/admin/category'
		})
	})
	//res.send('后台管理首页')
})

// 添加分类的保存
router.post('/category/add',function(req,res,next){
	console.log(req.body)
	var name = req.body.name || '';
	if(name == ''){
		res.render('admin/error',{
			message:'名称不能为空'
		})
	}

	//查询数据库中是否已经存在名称
	Category.findOne({
		name:name
	},function(err,result){
		if(result){
			res.render('admin/error',{
				message:'分类已经存在'
			})
			return;
		}else{
			//可以保存
			var category = new Category({name:name});
			category.save(function(err,newCategory){
				res.render('admin/success',{
					message:'分类保存成功',
					url:'/admin/category'
				})
			});
		}
	})
})

// 内容管理首页
router.get('/content',function(req,res,next){
	var page =  Number(req.query.page || 1);
	var limit = 2;

	Content.count(function(err,count){
		console.log('总条数为' + count)
		var pages = Math.ceil(count/limit);//总页数

		page = Math.min(page,pages);
		page = Math.max(page,1);

		var skip = page - 1;

		//排序 1代表升序 -1代表降序
		Content.find({}).sort({_id:-1}).limit(limit).skip(skip).exec(function(err,contents){
		//console.log(users)
		res.render('admin/content_index',{
			contents:contents,
			userInfo:req.userInfo,
			page:page,
			count:count,
			limit:limit,
			pages:pages
		})
	})
	})

})

// 添加内容
router.get('/content/add',function(req,res,next){
	Category.find({}).exec(function(err,categories){
		//console.log(users)
		res.render('admin/content_add',{
			categories:categories
		})
	})
})

// 添加内容保存
router.post('/content/add',function(req,res,next){
	console.log(req.body)
	// Category.find({}).exec(function(err,categories){
	// 	//console.log(users)
	// 	res.render('admin/content_add',{
	// 		categories:categories
	// 	})
	// })
	if(req.body.category == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'分类不能为空'
		})
		return;
	}
	if(req.body.title == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'标题不能为空'
		})
		return;
	}
	if(req.body.description == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'简介不能为空'
		})
		return;
	}
	if(req.body.content == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'内容不能为空'
		})
		return;
	}


	//保存数据到数据库
	var contentNew = new Content({
		title:req.body.title,
		category:req.body.category,
		description:req.body.description,
		content:req.body.content
	});
	contentNew.save(function(err,newContent){
		res.render('admin/success',{
			message:'内容保存成功',
			url:'/admin/content'
		})
	});
})

module.exports = router;