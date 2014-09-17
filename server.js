var express = require('express'),
	commands = require('./commands'),
	app = express();

app.get('/good/list', commands.findAll);
app.get('/good/:id', commands.findById);

app.listen(3000);
console.log('Listening on port 3000...');