var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var app = express();
var baseUrl = 'http://localhost:3000';

// erp routers
var venueRouter = require('cloud/routers/erp/venue.js');

// admin routers
var clubEventRouter = require('cloud/routers/admin/clubevent.js');

ejs.filters.formatDate = function (date) {
	return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() +' ' +
		(date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':' +
		(date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
};
ejs.filters.formatString = function (str, limit) {
	return str.length > limit ? str.substr(0, limit) + '...' : str;
};
// application configuration
app.engine('html', ejs.renderFile);
app.set('views','cloud/views');
app.set('view engine', 'html');

// middleware
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'ledong'}));
app.use(express.csrf({cookie: true}));
app.use(function (req, res, next) {req.baseUrl = baseUrl; next();});

app.get('/test', function (req, res) {
	AV.Cloud.run('getNearClubEvent', {latitude: '40.0273628', longitude: '116.3810654'}, {
		success: function (result) {
			// var date = result[0].get('starttime');
			// var str = '';
			// for (var p in date) {
			// 	str = str + '--' + p;
			// }

			res.send(result);
		},
		error: function () {
			res.send(500);
		}
	});
});

app.get('/', function (req, res) {
	res.render('index', {title: '信息总览'});
});

// erp
app.get('/venue/add', venueRouter.get_addVenue);
app.post('/venue/add', venueRouter.post_addVenue);

// admin
app.get('/admin/clubevent', clubEventRouter.get_clubEvent);
app.get('/admin/deleteclubevent', clubEventRouter.get_deleteClubEvent);

app.post('/upload', function (req, res) {var upfile = req.files.upfile; if (upfile) {fs.readFile(upfile.path, function (err, data) {if (err) {return res.send('error'); } var base64Data = data.toString('base64'); var file = new AV.File(upfile.name, {base64: base64Data}); file.save().then(function (file) {res.send('successful'); }); }); } else {res.send('select one file'); } });
app.listen();
app.use(function(req, res, next){res.status(404).render('404'); });
