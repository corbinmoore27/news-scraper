var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});