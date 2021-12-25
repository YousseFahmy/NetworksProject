var express = require("express");
var path = require("path");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.render("login");
});

app.get("/registration", (req, res) => {
	res.render("registration");
});

app.get("/home", (req, res) => {
	res.render("registration");
});

app.get("/books", (req, res) => {
	res.render("books");
});

app.get("/boxing", (req, res) => {
	res.render("boxing");
});

app.get("/cart", (req, res) => {
	res.render("cart");
});

app.get("/galaxy", (req, res) => {
	res.render("galaxy");
});

app.get("/iphone", (req, res) => {
	res.render("iphone");
});

app.get("/leaves", (req, res) => {
	res.render("leaves");
});

app.get("/phones", (req, res) => {
	res.render("phones");
});

app.get("/searchresults", (req, res) => {
	res.render("searchresults");
});

app.get("/sports", (req, res) => {
	res.render("sports");
});

app.get("/sun", (req, res) => {
	res.render("sun");
});

app.get("/tennis", (req, res) => {
	res.render("tennis");
});

app.post("/", (req, res) => {
	res.render("home");
});

app.listen(6969);
