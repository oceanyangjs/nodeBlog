// 分类的表结构
var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
	//标题
	title:String,
	//关联字段,关联其他表 --内容分类的ID
	category:{
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'Category'
	},
	//简介
	description:{
		type:String,
		default:''
	},
	//内容
	content:{
		type:String,
		default:''
	},
	//用户ID
	user:{
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'User'
	},
	//添加时间
	addTime:{
		type:Date,
		default:new Date()
	},
	//阅读量
	views:{
		type:Number,
		default:0
	},
	//评论
	comments:{
		type:Array,
		default:[]
	}
})