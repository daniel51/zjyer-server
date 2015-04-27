require("cloud/app.js");
// Use AV.Cloud.define to define as many cloud functions as you want.

AV.Cloud.define('getArea', function (req, res) {
	var pid = parseInt(req.params.pid, 10);
	var areaQuery = new AV.Query('Area');

	areaQuery.equalTo('pid', pid);
	areaQuery.ascending('order');

	areaQuery.find({
		success: function (results) {
			res.success(JSON.stringify(results));
		},
		error: function (err) {
			res.error(JSON.stringify({error: err}));
		}
	});
});

// 设置密码
AV.Cloud.define('setPwd', function (req, res) {
	var query = new AV.Query(AV.User);
	query.get(req.params.id, {
		success: function (user) {
			var newPwd = req.params.newPwd;
			user.setPassword(newPwd);
			user.save(null, {
				success: function () {
					res.success(true);
				},
				error: function () {
					res.error(false);
				}
			});
		},
		error: function (obj, error) {
			res.error(false);
		}
	});
});

// 百度地图地址推荐
AV.Cloud.define('getBaiduMapSugg', function (req, res) {
	// 必须参数
	var query = encodeURIComponent(req.params.query);
	var region = req.params.region;

	// 可选参数
	var ak = req.params.ak || 'BQNurii6IhyOdMrYVHtWgzud';
	var output = req.params.output || 'json';
	var page_num = req.params.page_num || '0';
	var page_size = req.params.page_size || '10';
	var scope = req.params.scope || '1';
	AV.Cloud.httpRequest({
		url: 'http://api.map.baidu.com/place/v2/search?query=' + query +
			'&region=' + region + '&output=' + output + '&ak=' + ak + '&page_num=' + page_num + '&page_size=' + page_size + '&scope=' + scope,
		success: function (httpResponse) {
			res.success(httpResponse.text);
		},
		error: function (httpResponse) {
			res.error('error');
		}
	});
});

// 根据距离返回俱乐部活动列表
AV.Cloud.define('getNearClubEvent', function (req, res) {
	var EARTH_RADIUS = 6378.137;
	var query = new AV.Query('ClubEvent');
	var longitude = parseFloat(req.params.longitude);
	var latitude = parseFloat(req.params.latitude);
	var pageSize = parseInt(req.params.pageSize, 10) || 10;
	var pageNum = parseInt(req.params.pageNum, 10) || 1;
	var rad = function (d) {
		return d * Math.PI / 180;
	};

	if (!longitude || !latitude) {
		res.error('请检查请求数据');
	}

	query.near('location_geo', new AV.GeoPoint({latitude: latitude, longitude: longitude}));
	query.include('organizeuser_ptr');
	query.skip(pageSize * (pageNum - 1));
	query.limit(pageSize);
	query.find({
		success: function (results) {
			var finalResult = [];

			results.forEach(function (result) {
				var latDiff = rad(result.get('latitude')) - rad(latitude);
				var lngDiff = rad(result.get('longitude')) - rad(longitude);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDiff/2),2) +
					Math.cos(rad(result.get('latitude'))) * Math.cos(rad(latitude)) * Math.pow(Math.sin(lngDiff / 2), 2)));
				s = s * EARTH_RADIUS;
			  s = Math.round(s * 10000) / 10000;
				result = result.attributes;
				result.distance = s.toFixed(2) + 'km';

				result.starttime = new Date(result.starttime).getTime();
				result.endtime = new Date(result.endtime).getTime();

				finalResult.push(result);
			});
			res.success(JSON.stringify(finalResult));
			// res.success(finalResult);
		},
		error: function () {
			res.error('error');
		}
	});
});
