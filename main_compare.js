var express = require('express');
var bodyParser = require('body-parser')
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
console.log('image list size: ' + imagelist.length);
sample_size = 3;

var app = express();
app.use(bodyParser.json());
app.use('/jspsych-6.0', express.static(__dirname + '/jspsych-6.0'));
app.use('/images', express.static(__dirname + '/images'));

app.get('/imagelist1', function(req, res) {
	console.log('Get image list 1');
	shuffle(imagelist);
	res.send(imagelist.slice(0, sample_size));
})

app.get('/imagelist2', function(req, res) {
	console.log('Get image list 2');
	shuffle(imagelist);
	res.send(imagelist.slice(0, sample_size));
})

app.get('/compare', function(req, res) {
	console.log('Get compare_pairwise.html');
    res.sendFile(path.join(__dirname + '/compare.html'));
});

let user_name, dir;

function saveFile(directory, filename, data) {
	fs.writeFile(directory + filename, data, (error) => {
  		if (error == null) console.log('File saved');
  	});
}

app.post('/user_name', function(request, response) {
	user_name = JSON.parse(request.body['responses'])['Q0'];
  	console.log('Create directory for ' + user_name);
  	dir = './user_data_compare/' + user_name + '/';
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

app.post('/user_age', function(request, response) {
	saveFile(dir, 'age.json', JSON.stringify(request.body));
});

app.post('/session_1', function(request, response){
  	console.log('Save user data for session 1');
  	saveFile(dir, 'session_1.json', JSON.stringify(request.body));
});

app.post('/session_2', function(request, response){
  	console.log('Save user data for session 2');
  	saveFile(dir, 'session_2.json', JSON.stringify(request.body));
});

app.post('/session_3', function(request, response){
  	console.log('Save user data for session 3');
  	saveFile(dir, 'session_3.json', JSON.stringify(request.body));
});

app.post('/session_4', function(request, response){
  	console.log('Save user data for session 4');
  	saveFile(dir, 'session_4.json', JSON.stringify(request.body));
});

app.listen(8080, function() {
	console.log("server running at port 8080");
});