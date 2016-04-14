/**
 * Created by laixiangran on 2016/3/18
 * homepage：http://www.cnblogs.com/laixiangran/
 */

var express = require("express");
var Markdown = require("markdown-it");

/**
 * 导入mongoose模块
 * API：http://mongoosejs.com/docs/api.html
 */
var mongoose = require("mongoose");

/**
 * 连接数据库
 * createConnection的用法：http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection
 */
var db = mongoose.createConnection("localhost", "pollsapp");

/**
 * 新建模式（Schema）
 * Schema的用法：http://mongoosejs.com/docs/api.html#index_Mongoose-Schema
 */
var PollSchema = require("../models/Poll.js").PollSchema;

/**
 * 新建模型（model）
 * model的用法：http://mongoosejs.com/docs/api.html#index_Mongoose-model
 */
var Poll = db.model("polls", PollSchema);

// markdown转html
function markdown2html(markdownString) {
    var md = new Markdown();
    return md.render(markdownString);
}

// 定义路由
var router = express.Router();

// 主页
router.get("/", function(req, res) {
    res.render("index", {title: "投票系统"});
});

// 获取投票列表
router.get("/polls/polls", function(req, res) {
    // 查询模型 Model.find用法：http://mongoosejs.com/docs/api.html#model_Model.find
    Poll.find({}, "question", function(error, polls) {
        res.json(polls);
    });
});

// 获取单个投票（带有投票的id）
router.get("/polls/:id", function(req, res) {
    var pollId = req.params.id;

    // 根据查询模型 IdModel.findById用法：http://mongoosejs.com/docs/api.html#model_Model.findById
    // {lean: true} 返回精简的javascript对象，不是MongooseDocuments对象
    Poll.findById(pollId, "", {lean: true}, function(err, poll) {
        if(poll) {
            var userVoted = false,
                userChoice,
                totalVotes = 0,
                choices = poll.choices;
            for(c in choices) {
                if (choices.hasOwnProperty(c)) {
                    var choice = choices[c],
                        votes = choice.votes;
                    for(v in votes) {
                        if (votes.hasOwnProperty(v)) {
                            var vote = votes[v];
                            totalVotes++;
                            if(vote.ip === (req.header("x-forwarded-for") || req.ip)) {
                                userVoted = true;
                                userChoice = { _id: choice._id, text: choice.text };
                            }
                        }
                    }
                }
            }
            poll.userVoted = userVoted;
            poll.userChoice = userChoice;
            poll.totalVotes = totalVotes;
            res.json(poll);
        } else {
            res.json({error:true});
        }
    });
});

// 新增投票
router.post("/polls", function(req, res) {
    var reqBody = req.body,
        choices = reqBody.choices.filter(function(choice) {
            return choice.text != "";
        }),
        pollObj = {
            question: reqBody.question,
            choices: choices
        };
    var poll = new Poll(pollObj);

    // 保存模型 Model.save用法：http://mongoosejs.com/docs/api.html#model_Model-save
    poll.save(function(err, poll) {
        if(err || !poll) {
            res.json({error: "add error"});
            throw err;
        } else {
            res.json(poll);
        }
    });
});

// 修改投票
router.post("/updatePoll", function(req, res) {
    var reqBody = req.body,
        choices = reqBody.choices.filter(function(v) {
            return v.text != "";
        }),
        pollObj = {question: reqBody.question, choices: choices};

    // 修改模型 Model.findByIdAndUpdate用法：http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Poll.findByIdAndUpdate(reqBody._id, pollObj, function(err, poll) {
        if(err || !poll) {
            res.json({error: "add error"});
            throw err;
        } else {
            pollObj._id = reqBody._id;
            res.json(pollObj);
        }
    });
});

// 删除投票
router.get("/delPoll/:id", function(req, res) {
    var pollId = req.params.id;
    Poll.findByIdAndRemove(pollId, function(err, poll) {
        if (err) {
            res.json({});
        } else {
            res.json({state: "success"});
        }
    });
});

// 保存投票结果（使用Socket）
router.vote = function(socket) {
    socket.on("send:vote", function(data) {
        var ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address.address;
        Poll.findById(data.poll_id, function(err, poll) {
            var choice = poll.choices.id(data.choice);
            choice.votes.push({ip: ip});
            poll.save(function(err, doc) {
                var theDoc = {
                    question: doc.question, _id: doc._id, choices: doc.choices,
                    userVoted: false, totalVotes: 0
                };
                for(var i = 0, ln = doc.choices.length; i < ln; i++) {
                    var choice = doc.choices[i];
                    for(var j = 0, jLn = choice.votes.length; j < jLn; j++) {
                        var vote = choice.votes[j];
                        theDoc.totalVotes++;
                        theDoc.ip = ip;
                        if(vote.ip === ip) {
                            theDoc.userVoted = true;
                            theDoc.userChoice = {
                                _id: choice._id,
                                text: choice.text
                            };
                        }
                    }
                }
                socket.emit("myvote", theDoc);
                socket.broadcast.emit("vote", theDoc);
            });
        });
    });
};

module.exports = router;
