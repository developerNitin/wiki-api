//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// ------> mongodb
mongoose.connect("mongodb://localhost:27017/wikidb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const aritcleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", aritcleSchema);
// ------>

// ------> request targetting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticles = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticles.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully saved data to the server!");
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully delete the articles");
      } else {
        res.send(err);
      }
    });
  });
// ------>

// ------> request targetting spacific articles
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content,
      }, {
        overwrite: true,
      },
      function(err, foundArticle) {
        if (!err) {
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      });
  })
  .delete(function(req, res) {
    Article.deleteOne({
        title: req.params.articleTitle
      },
      function(err) {
        if (!err) {
          res.send("successfully deleted article");
        } else {
          res.send("err");
        }
      }
    );
  });
// ------>





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
