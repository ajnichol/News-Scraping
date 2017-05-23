var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	title:{
		type: String
	},

	body:{
		type: String
	}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;