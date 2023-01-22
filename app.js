//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hey there! This is a blog website where you can share your thoughts or share your views on anything and everything. It can be a scientific discovery or any random things. You could also write about your day in general. Happy blogging!";
const aboutContent = "A blog website where people can write about their life experiences or anything as such. We provide a platform to freely express your thoughts with other people. We hope sharing your thoughts made you feel better! Thanks for choosing us!";
const contactContent = "You can reach out to us by email. You can mail us on jagrutib87@gmail.com. Feel free to reach out in case of any queries.";

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});
mongoose.set('strictQuery', false);
const connectDB = async ()=> {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
//let posts = [];

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });



});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId}, function(err,post){
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
      title: post.title,
      content: post.content
    });
  }
  });


});

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });

connectDB().then(()=> {
  app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
  })
});
