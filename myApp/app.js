var express = require("express");
var path = require("path");

var app = express();
var usersDB;
var productsDB;

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
	res.render("home");
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

app.post("/", async (req, res) => {
	var usernameIn = req.body.username;
	var passwordIn = req.body.password;

	var userExists = await findUser(usernameIn, passwordIn);

	if (userExists) {
		res.render("home");
	} else {
		throwThisError("Invalid Credentials");
	}
});

app.post("/search", (req, res) => {
	res.render("searchresults");
});

app.post("/register", async (req, res) => {
	var usernameIn = req.body.username;
	var passwordIn = req.body.password;

	var successfulRegistration = await registerUser(usernameIn, passwordIn);

	if (successfulRegistration) {
		res.render("login");
	} else {
		res.render("registration");
	}
});

async function main() {
	var { MongoClient } = require("mongodb");
	var uri =
		"mongodb+srv://MongoUser:MongoUser@cluster0.erqn8.mongodb.net/BackdropNetworksProject?retryWrites=true&w=majority";
	client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	usersDB = client.db("BackdropNetworksProject").collection("Users");
	productsDB = client.db("BackdropNetworksProject").collection("Products");

	await client.connect();
}

async function registerUser(usernameIn, passwordIn) {
	var theUser = await findUsername(usernameIn);

	if (!theUser && usernameIn != "" && passwordIn != "") {
		createUser(usernameIn, passwordIn);
		return true;
	} else if (theUser) {
		throwThisError("Username already exists.");
	} else {
		throwThisError("Invalid Credentials.");
	}
	return false;
}

async function createUser(usernameIn, passwordIn) {
	var newUser = {
		username: usernameIn,
		password: passwordIn
	};

	await usersDB.insertOne(newUser);
}

async function findUsername(usernameIn) {
	var user = await usersDB.findOne({ username: usernameIn });

	if (user) {
		return true;
	} else {
		return false;
	}
}

async function findUser(usernameIn, passwordIn) {
	var user = await usersDB.findOne({ username: usernameIn, password: passwordIn });

	if (user) {
		return true;
	} else {
		return false;
	}
}

function throwThisError(message) {
	console.log(`ERROR: ${message}`);
}

main();
app.listen(6969);
