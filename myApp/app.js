var express = require("express");
var path = require("path");
var alert = require("alert");
var session = require("express-session");
const morgan = require("morgan");

var app = express();
var usersDB;
var productsDB;

app.use(morgan("tiny"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "thisprojectisannoying", resave: false, saveUninitialized: false }));

app.use((req, res, next) => {
	const allowedPages = [ "/", "/login", "/registration" ];
	if (req.method === "GET") {
		if (allowedPages.includes(req.path) || req.session.username) {
			return next();
		}
		res.redirect("/");
	}
	return next();
});

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
	console.log(res.param);
	console.log("bedan");
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
		req.session.username = usernameIn;
		res.redirect("home");
	} else {
		throwThisError("Invalid Credentials");
	}
});

app.post("/register", async (req, res) => {
	var usernameIn = req.body.username;
	var passwordIn = req.body.password;

	var successfulRegistration = await registerUser(usernameIn, passwordIn);

	if (successfulRegistration) {
		req.session.username = usernameIn;
		res.redirect("/home");
	} else {
		res.render("registration");
	}
});

app.post("/search", async (req, res) => {
	var searchParam = req.body.Search;
	var searchResults = await searchProducts(searchParam);
	console.log(searchResults);
	res.render("searchresults", { searchResults });
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
	alert(`ERROR: ${message}`, "cscript");
}

async function searchProducts(searchParam) {
	var allProds = await productsDB.find().toArray();
	var validProds = [];

	allProds.forEach((product) => {
		var prodName = product["productName"].toLowerCase();
		if (prodName.includes(searchParam)) {
			validProds.push(product);
		}
	});

	return validProds;
}

async function addToCart(itemPage) {
	var productID = await findProductID(itemPage);
}

async function findProductID(itemPage) {
	var itemDoc = await productsDB.findOne({ productPage: itemPage });
	console.log(itemDoc);
	console.log("5ara");
	// TODO
}

main();
if (process.env.PORT) {
	app.listen(process.env.PORT, () => console.log("Server started on Heroku"));
} else {
	app.listen(6969, () => console.log("Server started on Port 6969"));
}
