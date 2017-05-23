var cheerio = require("cheerio");
var request = require("request");
var Article = require("../models/articles.js");
var Comment = require("../models/comment.js");

module.exports = function(app){

	app.get("/", function(req, res) {

		request("http://www.ign.com/", function(error, res, html){

			var $ = cheerio.load(html);

			$("div .listElmnt").each(function(i, element){

				var result = {};

				result.title = $(element).children("a .listElmnt-storyHeadline").text();
				result.link = $(element).children("a .listElmnt-storyHeadline").attr("href");
				result.description = $(element).children("p").text();

				var entry = new Article(result);

				entry.save(function(error, doc){
					if(error){
						console.log(error);
					}else{
						console.log(doc);
					};
				});
			});

			$("div .listElmnt promo-content").each(function(i, element){

				var promoResult = {};

				promoResult.title = $(element).children("a .listElmnt-storyHeadline").text();
				promoResult.link = $(element).children("a .listElmnt-storyHeadline").attr("href");
				promoResult.description = $(element).children("p").text();	

				var secondEntry = new Article(promoResult);

				secondEntry.save(function(error, doc){
					if(error){
						console.log(error);
					}else{
						console.log(doc);
					};
				});			
			});
		});
		//when a user lands on our site we'll render our index
		res.render("index");
	});
};
