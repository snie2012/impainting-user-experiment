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
var sample_size = 4, training_size = 1;

var app = express();
app.use(bodyParser.json());
app.use('/jspsych-6.0', express.static(__dirname + '/jspsych-6.0'));
app.use('/images', express.static(__dirname + '/images'));

app.get('/training_images', function(req, res) {
	console.log('Get training images');
	shuffle(imagelist);
	res.send(imagelist.slice(0, training_size));
})

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

let dir = './data_in_progress/';

function saveFile(directory, filename, data) {
	fs.writeFile(directory + filename, data, (error) => {
  		if (error == null) console.log('File saved');
  	});
}

app.post('/user_age', function(request, response) {
	console.log('Save user age');
	const user_name = request.body['user_name'] + '_';
	saveFile(dir, user_name + 'age.json', JSON.stringify(request.body));
});

app.post('/user_gender', function(request, response) {
	console.log('Save user gender');
	const user_name = request.body['user_name'] + '_';
	saveFile(dir, user_name + 'gender.json', JSON.stringify(request.body));
});

app.post('/session_1', function(request, response){
  	console.log('Save user data for session 1');
  	const user_name = request.body[0]['user_name'] + '_';
  	saveFile(dir, user_name + 'session_1.json', JSON.stringify(request.body));
});

app.post('/session_2', function(request, response){
  	console.log('Save user data for session 2');
  	const user_name = request.body[0]['user_name'] + '_';
  	saveFile(dir, user_name + 'session_2.json', JSON.stringify(request.body));
});

app.post('/session_3', function(request, response){
  	console.log('Save user data for session 3');
  	const user_name = request.body[0]['user_name'] + '_';
  	saveFile(dir, user_name + 'session_3.json', JSON.stringify(request.body));
});

app.post('/session_4', function(request, response){
  	console.log('Save user data for session 4');
  	const user_name = request.body[0]['user_name'] + '_';
  	saveFile(dir, user_name + 'session_4.json', JSON.stringify(request.body));
});

app.listen(8080, function() {
	console.log("server running at port 8080");
});