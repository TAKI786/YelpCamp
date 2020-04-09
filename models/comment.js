var mongoose = require("mongoose");

 var CommentSchema = mongoose.Schema({
 	text: String,
 	author: String,
 	date: {type: Date, default: Date.now}
 });

module.exports = mongoose.model("Comment", CommentSchema); 