/*
	应用程序的启动入口文件
*/

//加载express
var express = require('express')
//加载模板处理模块
var swig = require('swig')
//加载数据库模块
var mongoose = require('mongoose')
//加载bodyparser模块，用于处理post提交过来的数据
var bodyParser = require('body-parser')
//加载cookies模块
var Cookies = require('cookies')
//创建app应用 => http.createserver
var app = express();
//定义当前应用所使用的模板引擎
//第一个参数是模板文件的后缀，第二个参数表示用于解析处理模板内容def方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数是'views'，第二个参数是目录
app.set('views','./views');
//注册使用的模板引擎，第一个参数固定位'view engine'，第二个参数与app.engine第一个参数一致
app.set('view engine','html')
//在开发过程中可以取消模板缓存的限制
swig.setDefaults({cache:false})

//加载cookies设置
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res);

	req.userInfo = {}


	//解析用户的登录信息
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'))
		}catch(e){

		}
	}
	console.log(typeof req.cookies.get('userInfo'))

	next();
})


/*
	bodyparser设置
*/
app.use(bodyParser.urlencoded({extented:true}))

/*
*根据不同功能划分模块
*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'))

mongoose.connect('mongodb://localhost:27017/blog',function(err){
	if(err){
		console.log("数据库连接失败")
	}else{
		console.log("数据库连接成功")
		//监听请求
		app.listen(8083)
		console.log('服务启动成功：8083')
	}
});

/*
	首页
	request对象
	response对象
	函数
*/
/*app.get('/',function(req,res,next){
	//res.send('<h1>欢迎光临我的博客</h1>')
	//读取views目录下的指定文件，解析并返回给客户端
	//第一个参数表示模板的文件相对于views目录 views/index
	//第二个参数：传递给模板的数据
	res.render("index");
})*/

// app.get('/main.css',function(req,res,next){
// 	res.setHeader('content-type','text/css');
// 	res.send('body {background:red}');
// })
//设置静态文件托管
//当用户访问的url以public开始，直接返回对应public目录下的文件
app.use('/public',express.static(__dirname+'/public'))

// 用户发送http请求--url--解析路由--找到匹配规则--执行指定的绑定函数，返回对应内容至用户
// public--静态--直接读取指定目录下的文件返回给用户
// 动态--处理业务逻辑，加载模板，解析模板--返回数据给用户