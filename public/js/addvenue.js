/* useless method used to add option for cascading */

// function appendOption (data, parent) {
// 	var totalCount = data.length, i=0, one;
// 	var fragment = document.createDocumentFragment();
// 	var option;

// 	for (; i < totalCount; i += 1) {
// 		one = data[i];

// 		option = document.createElement('option');
// 		option.value = one.title;
// 		option.appendChild(document.createTextNode(one.title));
// 		option.setAttribute('data-id', one.areaid);

// 		fragment.appendChild(option);
// 	}

// 	parent.append(fragment);
// }

/* addtag plugin */
$.fn.addTag = function (opt) {
	var $src = $(opt.src);
	var $dest = $(opt.dest);
	var self = this;
	var val;
	if ($src.length) {
		this.click(function () {
			val = $src.val();
			if ($.trim(val).length > 0) {
				val = val.replace(/×/g, '*');
				$src.val('').focus();
				$('<div class="btn-group"><div class="btn btn-default">' + val + '</div><div class="btn btn-default close-tag">×</div></div>').appendTo($dest);
			}
		});

		$src.keyup(function (e) {
			if (e.which === 13) {
				self.triggerHandler('click');
			}
		});
	}
}

/* intialization code */
$(function () {

	$('.hidd-file').change(function () {
		console.log('change');
	});

	// initialize map
	var map = new BMap.Map("map");
	var myGeo = new BMap.Geocoder();
	var point = new BMap.Point(116.404, 39.915);

	var /*$venPro = $('#venueProvince'), */$venCity = $('#venueCity'), $venAdd = $('#venueAddress'), $longitude = $('#longitude'), $latitude = $('#latitude');
	var $mask = $('#mask'), $submit = $('#submit');
	var coffeeTime = false, oldAdd = '';

	// jquery element for croping
	var $cropImg = $('#cropImg'), $x = $('#x'), $y = $('#y'), $w = $('#w'), $h = $('#h');

	// map intialization
	map.centerAndZoom(point,12);
	map.enableScrollWheelZoom();

	map.addEventListener('click', function (e) {
		var point = e.point;
		myGeo.getLocation(point, function (rs) {
			var addCom = rs.addressComponents;
			focusPoint(point);
			$venCity.val(addCom.city);
			$venAdd.val(addCom.district + addCom.street + addCom.streetNumber);
			oldAdd = $venAdd.val();
		});
	});

	// addtag intialization
	$('#addService').addTag({src: '#venueService', dest: '#serviceContainer'});
	$('#addChara').addTag({src: '#venueChara', dest: '#charaContainer'});
	$(document).on('click', '.close-tag', function () {$(this).parent().remove();})

	$('body').append('<div id="dtp"></div>');
	$('#dtp').DateTimePicker({
		mode: 'time',
		isPopup: false,
		setButtonContent: '确定',
		clearButtonContent: '取消',
		titleContentTime: '请选择时间'
	});

	/* useless code for cascading */

	// // load province when page is loaded
	// $.post('/getarea', {pid: 0}, function (data) {

	// 	appendOption(data, $venPro);

	// }, 'json');

	// // load corresponding city when province is changed
	// $venPro.change(function () {
	// 	var selectedAreaid = $venPro.find(':selected').data('id');

	// 	$venCity.empty().append('<option value="0">请选择</option>');

	// 	if (selectedAreaid !== 0){

	// 		console.log('changed');
	// 		$.post('/getarea', {pid: selectedAreaid}, function (data) {

	// 			appendOption(data, $venCity);
	// 		}, 'json');
	// 	}
	// });

	$venAdd.keyup(function (e) {
		var venAdd = $venAdd.val(), venCity = $venCity.val();

		if (coffeeTime || oldAdd === venAdd) {
			return;
		}
		
		// if venueaddress is not empty
		if ($.trim(venAdd).length) {

			// condition to invoke getPoint
			if ($.trim(venCity).length) {
				coffeeTime = true;

				myGeo.getPoint(venCity + $venAdd.val(), function (point) {
					if (point) {
						focusPoint(point);
					}
				});
			}

			// settimeout to set coffeetime false
			setTimeout(function () {
				if (coffeeTime) {
					coffeeTime = false;
					oldAdd = $venAdd.val();
				}
			}, 200);// end setTimeout
		}
	});

	// validate
	$('#venueform').validate({
		// debug: true,
		rules: {
			venuePhoneno: {
				required: true,
				digits: true
			}
		},
		showErrors: $.validator.showTooltipErrors,
		submitHandler: function (form) {
			$('#venueServiceData').val($('#serviceContainer').text());
			$('#venueCharaData').val($('#charaContainer').text());
			$('#venueLng').val($longitude.text());
			$('#venueLat').val($latitude.text());
			$mask.addClass('show');
			$submit.button('waiting');

			// form.submit via ajax;
			$.ajax({
				url: '/venue/add',
				method: 'POST',
				data: $(form).serialize(),
				success: function (data) {
					location.href = data.redirectUrl;
				},
				complete: function () {
					$mask.removeClass('show');
					$submit.button('reset');
				}
			});
		}
	});// end validate

	// focus corresponding point on baidu map
	function focusPoint (point) {
		map.clearOverlays();
		map.centerAndZoom(point, 16);
		map.addOverlay(new BMap.Marker(point));
		$longitude.text(point.lng);
		$latitude.text(point.lat);
	}

	// show modal to crop
	// $('#cropModal').modal({
	// 	backdrop: 'static',
	// 	keyboard: false,
	// 	show: true
	// }).on('shown.bs.modal', function () {
	// 	var originalWidth = $cropImg.width();
	// 	$cropImg.removeClass('glassy').addClass('full-width');
	// 	var realWidth = $cropImg.width();
	// 	var rate = originalWidth / realWidth;
	// 	console.log(rate);

	// 	// initialize jcrop
	// 	$cropImg.Jcrop({
	// 		aspectRatio: 5/3,
	// 		setSelect: [10, 10, 90, 70],
	// 		onChange: function (c) {
	// 			$x.val(c.x * rate);
	// 			$y.val(c.y * rate);
	// 			$w.val(c.w * rate);
	// 			$h.val(c.h * rate);
	// 		}
	// 	});
	// });

});

