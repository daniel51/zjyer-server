exports.get_addVenue = function (req, res) {
	res.render('venue/add', {
		csrfToken: req.csrfToken(),
		title: '添加场馆',
		script: ['http://api.map.baidu.com/api?v=1.4','/js/crop.js' , '/js/validate.js', '/js/dtp.js', '/js/addvenue.js'],
		css: ['/css/dtp.css', '/css/crop.css']
	});
};

exports.post_addVenue = function (req, res) {
    var Venue = AV.Object.extend("Venue");
	var venue = new Venue();
	var service = req.body.venueServiceData.split('×');
	var chara = req.body.venueCharaData.split('×');
	service.pop();
	chara.pop();

	venue.set('name', req.body.venueName);
	venue.set('opentime', req.body.venueOtime);
	venue.set('closetime', req.body.venueCtime);
	venue.set('city', req.body.venueCity);
	venue.set('address', req.body.venueAddress);
	venue.set('longitude', parseFloat(req.body.venueLng));
	venue.set('latitude', parseFloat(req.body.venueLat));
	venue.set('service', service);
	venue.set('character', chara);
	venue.set('phoneno', req.body.venuePhoneno);

	venue.save(null, {
		success: function () {
            console.log('-----success----');
			res.send({redirectUrl: req.baseUrl + '/'});
		},
		error: function (obj, err) {
            console.log(err);
			res.send(500);
		}
	});
};