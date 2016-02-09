var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (request, response) {
	fs.readFile('public/users.json', function (error, data) {
		if (error) {
			console.log(error);
		}

		var parsedData = JSON.parse(data);
		response.render('index', {users: parsedData});
	});
});

app.get('/search', function (request, response) {
		response.render('search');
});

app.get('/create_user', function (request, response) {
		response.render('create_user');
});

app.post('/create_user', bodyParser.urlencoded({
	extended: true
}), function(request, response) {
	fs.readFile('public/users.json', "utf-8", function(err, data) {
		if (err) {
			throw err;
		}
		users = JSON.parse(data);
		console.log (users);
		firstname = request.body.firstname;
		lastname = request.body.lastname;
		email = request.body.email;

		newUser = {
			firstname: request.body.firstname,
			lastname: request.body.lastname,
			email: request.body.email
		};
		users.push(newUser);
		fs.writeFile('public/users.json', JSON.stringify(users));
		response.redirect('/')
	});
});

app.post('/search', bodyParser.urlencoded({
	extended: true
}), function(request, response) {
		console.log("meow meow woef")

	fs.readFile('public/users.json', 'utf-8', function(err, data) {
		if (err) {
			throw err;
		}
		users = JSON.parse(data);
		var results = [];
		for (i = 0; i < users.length; i++) {
			if (request.query.inputs != " " && users[i].firstname.indexOf(request.query.inputs) === 0){results.push(users[i].firstname)
			}
		}
		response.send(results)
	});
});

app.get('/searchresult', function (request, response){
	fs.readFile('public/users.json', function (error, data) {
		if (error) {
			console.log(error);
		}

		var users = JSON.parse(data);
		var results = [];
		console.log ("Hallo" + users)
		for (i = 0; i < users.length; i++) {
			if (request.query.firstname === users[i].firstname){results = (users[i].firstname +" "+ users[i].lastname +" "+ users[i].email)
			}
			else {
				result = alert("Please enter a name")
				response.render('search', {results: results});
			}
		}
		response.render('searchresult', {results: results});
	});
})

var server = app.listen(3001, function () {
	console.log('Example app listening on port: ' + server.address().port);
});