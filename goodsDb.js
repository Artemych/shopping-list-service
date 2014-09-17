var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	server = new Server(
		'localhost', 
		27017, 
		{auto_reconnect: true}
	),
	db = new Db(
		'goodsdb',
		server,
		{w:1}
	);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'goodsdb' database");
		db.collection('goods', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'goods' collection doesn't exist. Creating it with sample data...");
			}
		});
	}
});

exports.getGoodsDb = function () {
	return db;
}