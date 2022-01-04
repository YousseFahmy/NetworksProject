async function addToCart(itemPage) {
	var productID = await findProductID(itemPage);
}

async function findProductID(itemPage) {
	var itemDoc = await productsDB.findOne({ productPage: itemPage });
	console.log(itemDoc);
	console.log("5ara");
}
