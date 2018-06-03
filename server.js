var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var PORT = 7000;

var Comment = require("./commentModel.js");

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/nwsscrpr");

app.post("/sumbit", function(req, res) {
  var comment = new Comment(req.body);

  Comment.create(req.body)
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/scrape", function(req, res) {
  request("https://www.ksl.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $(".headline").each(function(i, element) {
      var a = $(this);

      var title = a.children("h2").text().trim();
      var link = a.children("h2").children("a").attr("href");
      var summary = a.children("h5").text();

      if (title && link) {
        db.scrprData.insert({
          title: title,
          link: link,
          summary: summary
        },
        function(err, inserted) {
          if(err) {
            console.log(err);
          }
          else {
            console.log(inserted);
          }
        });
      }
    });
  });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});