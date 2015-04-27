$(function () {

	$.ajaxSetup({
		timeout: 15000,
		dataType: 'json',
		error: (function () {
			var $alert = $('<div class="alert alert-danger text-center" id="show-errors"></div>');

			return function (xhr, errStr) {
				if ($('#show-errors').length) return;

				if (errStr === 'timeout') {
					$alert.text('连接超时，请稍后重试！');
				} else {
					$alert.text('请稍后重试！');
				}

				$alert.appendTo('body').fadeIn(500);

				setTimeout(function () {
					$alert.fadeOut(500, function () {$alert.remove();});
				}, 2000);
			};
		}())
	});
	$('[data-toggle="collapse"]').click(function () {
		$(this).find('.caret').toggleClass('fold');
	});


});
