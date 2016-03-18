/**
 * Created by laixiangran on 2016/3/18
 * homepage：http://www.cnblogs.com/laixiangran/
 */

var mongoose = require('mongoose');

// 得票model
var voteSchema = new mongoose.Schema({ ip: 'String' });

// 投票选项model
var choiceSchema = new mongoose.Schema({
    text: String,
    votes: [voteSchema]
});

// 投票model
exports.PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    choices: [choiceSchema]
});