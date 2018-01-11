var express = require('express');
var path = require('path');
var fs = require('fs');

// helper functions
// reference: https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle (array) {
	var i = 0, j = 0, t = null;
	for (i = array.length - 1; i > 0; i -= 1) {
	  j = Math.floor(Math.random() * (i + 1));
	  t = array[i];
	  array[i] = array[j];
	  array[j] = t;
	}
}

var imagelist = fs.readFileSync('./imagelist.txt', 'utf8');
imagelist = imagelist.split('\n');
console.log('image list size: ' + imagelist.length)
sample_size = 100;

var app = express();
app.use('/jspsych-6.0', express.static(__dirname + '/jspsych-6.0'));
app.use('/ours', express.static(__dirname + '/data/ours'));
app.use('/ce', express.static(__dirname + '/data/ce'));
app.use('/gl', express.static(__dirname + '/data/gl'));

app.get('/imagelist', function(req, res) {
	shuffle(imagelist);
	res.send(imagelist.slice(0, sample_size));
})

app.get('/rank', function(req, res) {
    res.sendFile(path.join(__dirname + '/rank.html'));
});

app.listen(8080, function() {
	console.log("server running at port 8080");
});