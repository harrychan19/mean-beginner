/**
 * Created by laixiangran on 2016/3/18
 * homepage��http://www.cnblogs.com/laixiangran/
 */

var mongoose = require('mongoose');

// ��Ʊmodel
var voteSchema = new mongoose.Schema({ ip: 'String' });

// ͶƱѡ��model
var choiceSchema = new mongoose.Schema({
    text: String,
    votes: [voteSchema]
});

// ͶƱmodel
exports.PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    choices: [choiceSchema]
});