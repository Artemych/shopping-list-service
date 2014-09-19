var express = require('express'),
	commands = require('./commands'),
	app = express();

app.get('/product/list', commands.findAll);
app.get('/product/:id', commands.findById);

app.listen(3000);
console.log('Listening on port 3000...');