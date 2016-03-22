/**
 * Created by laixiangran on 2016/3/18
 * homepage：http://www.cnblogs.com/laixiangran/
 */

var express = require("express"),
    path = require("path"),
    http = require("http"),
    favicon = require("serve-favicon"), // 网站图标
    logger = require("morgan"),// 记录HTTP请求并输出到命令行
    cookieParser = require("cookie-parser"), // 解析请求Cookie
    bodyParser = require("body-parser"), // 解析请求body
    routes = require("./routes/index");

var app = express();

/**
 * 获取程序运行的端口号
 */
var port = (function (val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}(process.env.PORT || "3000"));
app.set("port", port);

// 设置视图目录
app.set("views", path.join(__dirname, "views"));

// 设置视图引擎
app.set("view engine", "ejs");

// 设置当前程序运行的环境，默认是process.env.NODE_ENV (NODE_ENV environment variable) or "development"。
app.set("env", "development");

app.use(favicon(path.join(__dirname, "public", "images/favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "bower_components")));

// 将路由挂载到应用上
app.use("/", routes);

// 捕捉404并转向错误的操作
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// 错误操作

// 开发环境错误，显示具体错误信息
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// 生产环境错误，不显示具体错误信息
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

/**
 * 创建http服务
 */
var server = http.createServer(app);

var io = require("socket.io")(server);

io.on("connection", routes.vote);

server.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});