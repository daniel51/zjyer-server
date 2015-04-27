exports.post_getArea = function (req, res) {
	if (!req.is('application/json')) {
	 	res.send(406);
	 	return;
	}

	var pid = req.body.pid;

	AV.Cloud.run('getArea', {'pid': pid}, {
		success: function (data) {
			res.send(data);
		},
		error: function () {}
	});
};