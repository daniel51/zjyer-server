// 常量
var PAGE_SIZE = 10;

// 存储数据总量
var dataTotalCount = {
	clubEvent: null
};

// 展示俱乐部活动
exports.get_clubEvent = function (req, res) {
	var pageNum = parseInt(req.query.page_num, 10) || 1;
	var pageSize = PAGE_SIZE;
	var clubEventQuery = new AV.Query('ClubEvent');

	if (!dataTotalCount.clubEvent) {
		clubEventQuery.count({
			success: function (count) {
				dataTotalCount.clubEvent = count;
				clubEventQuery.skip(pageSize * (pageNum - 1));
				clubEventQuery.limit(pageSize);
				clubEventQuery.find({
					success: function (results) {
						res.render('admin/clubevent', {
							csrfToken: req.csrfToken(),
							title: '俱乐部活动',
							clubEvents: results,
							pagination: {
								dataCount: dataTotalCount.clubEvent,
								pageCount: Math.ceil(dataTotalCount.clubEvent / pageSize),
								currentPageNum: pageNum,
								pageSize: PAGE_SIZE
							}
						});
					},
					error: function () {
						res.send(500);
					}
				});
			},
			error: function () {
				res.send(500);
			}
		});
	} else {
		clubEventQuery.skip(pageSize * (pageNum - 1));
		clubEventQuery.limit(pageSize);

		clubEventQuery.find({
			success: function (results) {
				res.render('admin/clubevent', {
					csrfToken: req.csrfToken(),
					title: '俱乐部活动',
					clubEvents: results,
					pagination: {
						dataCount: dataTotalCount.clubEvent,
						pageCount: Math.ceil(dataTotalCount.clubEvent / pageSize),
						currentPageNum: pageNum,
						pageSize: PAGE_SIZE
					}
				});
			},
			error: function (error) {
				res.send(error);
			}
		});
	}
};

// 删除指定的俱乐部活动
exports.get_deleteClubEvent = function (req, res) {
	var ids = req.query.ids;

	ids.forEach(function (id) {
		var query = new AV.Query('ClubEvent');

		query.get(id, {
			success: function (object) {
				object.destroy({
					success: function () {},
					error: function () {}
				});
			},
			error: function (object, error) {

			}
		});
	});
	res.send(Object.prototype.toString.call(ids));
};

// 添加俱乐部活动
exports.post_addClubEvent = function (req, res) {
    var ClubEventObj = AV.Object.extend("ClubEvent");
	var clubEventObj = new ClubEventObj();

	
	clubEventObj.set('eventname', req.body.eventname);
	clubEventObj.set('eventintro', req.body.eventintro);
	clubEventObj.set('venuename', req.body.venuename);
	clubEventObj.set('venueaddress', req.body.venueaddress);
	
};
