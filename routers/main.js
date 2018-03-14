var express = require('express')
var router = express.Router()
var Category = require("../models/Category")
var Content = require("../models/Content")

// router.get('/user',function(req,res,next){
// 	res.send('main - User');
// })

var data = {
	
}

//使用中间件处理通用的方法，获取导航栏
router.use(function(req,res,next){
	data = {
		userInfo:req.userInfo,
		categories:[]
	}

	Category.find(function(err,categories){
		data.categories = categories;
		next();
	})
})

//首页
router.get('/',function(req,res,next){

	data.page = Number(req.query.page || 1);
	data.category = req.query.category || '';
	data.limit=10;
	data.pages=0;
	data.count=0;

	
	var where = {};
	if(data.category != ''){
		where.category = data.category;
	}

	console.log('访问主页')
	console.log(req.userInfo)
	//读取所有的内容信息
	Content.where(where).count(function(err,count){
		console.log('总条数为' + count)
		data.pages = Math.ceil(count/data.limit);//总页数
		data.count = count;

		data.page = Math.min(data.page,data.pages);
		data.page = Math.max(data.page,1);

		var skip = data.page - 1;

		//排序 1代表升序 -1代表降序
		Content.where(where).find({}).sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']).sort({
			addTime:-1
		}).exec(function(err,contents){
			console.log(contents)
			data.contents = contents;
			// res.render('admin/content_index',{
			// 	contents:contents,
			// 	userInfo:req.userInfo,
			// 	page:page,
			// 	count:count,
			// 	limit:limit,
			// 	pages:pages
			// })
			console.dir(data);
			res.render('main/index',data);
		})
	})

	// var page =  Number(req.query.page || 1);
	// var limit = 2;

	// Content.count(function(err,count){
	// 	console.log('总条数为' + count)
	// 	var pages = Math.ceil(count/limit);//总页数

	// 	page = Math.min(page,pages);
	// 	page = Math.max(page,1);

	// 	var skip = page - 1;

	// 	//排序 1代表升序 -1代表降序
	// 	Content.find({}).sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).exec(function(err,contents){
	// 	console.log(contents)
	// 	res.render('admin/content_index',{
	// 		contents:contents,
	// 		userInfo:req.userInfo,
	// 		page:page,
	// 		count:count,
	// 		limit:limit,
	// 		pages:pages
	// 	})
	// })
	// })

})

//阅读查看全文
router.get('/view',function(req,res,next){
	var contentId = req.query.contentid || '';

	Content.findOne({
		_id:contentId
	},function(err,content){
		console.log("查看内容页")
		console.log(content)
		data.content = content;

		content.views++;
		content.save();
		res.render('main/view',data);
	})
})

module.exports = router;