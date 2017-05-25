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
	//this request will populate our table with the scraped articles
	app.get("/articles", function(req, res){

		Article.find({}, function(error, doc){
			if(error){
				console.log(error);
			}else{
				var scrapedArticles = {
					eachArticle: doc
				};

				res.render("index", scrapedArticles);
			};
		});
	});
	//route that populates each article with comments if there are any in our database
	app.get("/comment/:id", function(req, res){
		var articleId = req.params.id;

		Article.findOne({"_id": articleId}).populate("comment")

		.exec(function(error, doc){
			if(error){
				console.log(error)
			}else{
				var allComments = {
					eachComment: doc
				};

				res.render("index", allComments);
			};
		});
	});
	//route to save a comment on an article
	app.post("/comment/:id", function(req, res){

		var newComment = new Comment(req.body);

		newComment.save(function(error, doc){
			if(error){
				console.log(error)
			}else{
				Article.update({"_id": req.params.id})
				.exec(function(error, doc){
					if(error){
						console.log(error);
					}else{
						res.redirect("index");
					};
				});
			};
		});
	});
	//route to delete comments on specific articles
	app.post("/delete/:id", function(req, res){
		Article.remove({"comment": req.params._id})
		.exec(function(error, doc){
			if(error){
				console.log(error);
			}else{
				res.redirect("index");
			};
		});
	});
};
