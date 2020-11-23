var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require('method-override'),
  app = express();

const PORT = 3000;

mongoose.connect("mongodb://localhost/restful_blog_app", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Yay !");
});

blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: new Date() },
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.post("/blogs", function (req, res) {
  Blog.create(req.body, function (err, blog) {
    if (err) {
      console.log(err);
      res.render("new");
    }
    else {
      res.redirect("/blogs");
    }
  });
  console.log(req.body);
});

app.get("/blogs/new", function (req, res) {
  res.render("new");

});

app.get("/blogs/:id", function (req, res) {
  Blog.find({ _id: req.params.id }, function (err, blog) {
    if (err) {
      console.log(err);
      res.redirect("/blogs")
    }
    else {
      res.render("show", { blog: blog });
      console.log(blog);
    }
  })
});


app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundblog) {
    if (err) {
      res.send("/blogs");
    }
    else {
      res.render("edit", { blog: foundblog });
    }

  })
});


app.put("/blogs/:id", function (req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body, function (err, updatedblog) {
    if (err) {
      res.redirect("/blogs");
      console.log("error!!");
    }
    else {
      res.redirect("/blogs/" + req.params.id);
    }
  })
});


app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
      console.log("error!!");
    }
    else {
      res.redirect("/blogs/");
    }
  })
});

app.listen(PORT, function () {
  console.log("server is running ! ");
});
