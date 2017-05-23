var cheerio = require("cheerio");
var request = require("request");
var odm = require("../models/odm.js");

module.exports = function(app){

	//when a user lands on our site we'll render our index
	app.get("/", function(req, res) {
  		res.render("index");
	});

	app.get("/scrape", function(req, res) {
		request("http://www.ign.com/", function(error, res, html){
			var $ = cheerio.load(html);
			$("div .listElmnt").each(function(i, element){
				var result = {};
				result
			})
		})
	})
};
