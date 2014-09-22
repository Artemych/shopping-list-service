var express = require('express'),
	commands = require('./commands'),
	app = express();

app.use(function(req, res, next){
	res.header("Content-Type", "application/json");
	next();
});

app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());

app.get('/product/list', commands.findAll);
app.get('/product/:id', commands.findById);
//app.post('/product', commands.addNew);

app.listen(3000);
console.log('Listening on port 3000...');