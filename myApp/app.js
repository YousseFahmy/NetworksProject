const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");

const app = express();
var usersDB;
var productsDB;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "thisprojectisannoying", resave: false, saveUninitialized: false }));

app.use((req, res, next) => {
	res.locals.messages = req.flash("Error");
	next();
});

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

app.get("/cart", async (req, res) => {
	var userDoc = await usersDB.findOne({ username: req.session.username });
	var userCart = userDoc.cart;
	res.render("cart", { userCart });
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
		req.flash("Error", "Invalid username or password");
		res.redirect("/");
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
		req.flash("Error", "Registration unsuccessful");
		res.redirect("/registration");
	}
});

app.post("/search", async (req, res) => {
	var searchParam = req.body.Search;
	var searchResults = await searchProducts(searchParam);
	console.log(searchResults);
	res.render("searchresults", { searchResults });
});

app.post("/addToCart", async (req, res) => {
	var success = await addToCart(req.body.itemPage, req.session.username);
	if (success) {
		res.redirect("/home");
	} else {
		req.flash("Error", "Item Already in Cart.");
		res.redirect(req.body.itemPage);
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
	}
	return false;
}

async function createUser(usernameIn, passwordIn) {
	var newUser = {
		username: usernameIn,
		password: passwordIn,
		cart: []
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

async function addToCart(itemPage, username) {
	var productName = await findProductName(itemPage);
	var userDoc = await usersDB.findOne({ username: username });
	var oldCart = userDoc.cart;

	if (oldCart.includes(productName)) {
		return false;
	} else {
		if (oldCart) {
			var newCart = [ ...oldCart, productName ];
		} else {
			var newCart = [ productName ];
		}

		await usersDB.updateOne({ username: username }, { $set: { cart: newCart } });
	}
	return true;
}

async function findProductName(itemPage) {
	var itemDoc = await productsDB.findOne({ productPage: itemPage });
	return itemDoc.productName;
}

main();
if (process.env.PORT) {
	app.listen(process.env.PORT, () => console.log("Server started on Heroku"));
} else {
	app.listen(6969, () => console.log("Server started on Port 6969"));
}
