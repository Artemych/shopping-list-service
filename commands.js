var request = require('request'),
	cheerio = require('cheerio'),
	Buffer = require('buffer').Buffer,
	iconv  = require('iconv').Iconv,
	mongoDbGoods = require('./goodsDb').getGoodsDb(),
	baseUrl = 'http://www.goodsmatrix.ru/',
	$body,
	options = {
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:32.0) Gecko/20100101 Firefox/32.0'
	    },
	    encoding: 'binary'
	};

exports.findAll = function(req, res) {
	mongoDbGoods.collection('goods', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};
 
exports.findById = function (req, res) {
	barCode = req.params.id;
	mongoDbGoods.collection('goods', function(err, collection) {
		collection.findOne({barCode: barCode}, function(err, doc) {
			if(doc != null) {
       			res.send(doc);
			} else {
				options.url = baseUrl + 'goods/' + barCode + '.html';

				sendExternalRequest(function (goodObject) {
					res.send(goodObject);		
				}, function() {
					res.status(404).send({error: 'requested product not found'});
				});	
			}
    	});
	});
};

function sendExternalRequest (suceessCallback, errorCallback) {
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			$body = cheerio.load(encode(body));
			
			var goodObject = {
				img: baseUrl + $body('#ctl00_ContentPH_LSGoodPicture_GoodImg').attr('src'),
				title: $body('#ctl00_ContentPH_GoodsName').text().trim(),
				barCode: $body('#ctl00_ContentPH_BarCodeL').html(),
				content: $body('#ctl00_ContentPH_Composition').text().trim(),
				bgu: ($body('#ctl00_ContentPH_ESL')) ? $body('#ctl00_ContentPH_ESL').text().trim() : null
			};

			if (goodObject.barCode != void 0 || goodObject.barCode != null) {
				insert(goodObject);
				suceessCallback.apply(this, [goodObject]);
			} else {
				console.log('Invalid barcode');
				errorCallback.apply(this, arguments);
			}
					
			
		} else {
			console.log(error + ': ' + response.statusCode);
			errorCallback.apply(this, arguments);
		}
	});
}

function encode(body) {
	body = new Buffer(body, 'binary');
    conv = new iconv('windows-1251', 'utf8');

    return conv.convert(body).toString();
}

function insert(goodObject) {
	mongoDbGoods.collection('goods', function(err, collection) {
		collection.insert(goodObject, function(err, records) {
			console.log("Record added as "+records[0].barCode);
    	});
	});
}