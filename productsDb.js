var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	server = new Server(
		'localhost', 
		27017, 
		{auto_reconnect: true}
	),
	db = new Db(
		'productsdb',
		server,
		{w:1}
	);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'productsdb' database");
		db.collection('products', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'products' collection doesn't exist. Creating it with sample data...");
			}
		});
	}
});

exports.getProductsDb = function () {
	return db;
}
