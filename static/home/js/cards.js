$(document).ready(function() {
	var animating = false;
	var cardsCounter = 0;
	var numOfCards = 6;
	var decisionVal = 80;
	var pullDeltaX = 0;
	var deg = 0;
	var $card, $cardReject, $cardLike;

	function pullChange() {
		animating = true;
		deg = pullDeltaX / 10;
		$card.css('transform', 'translateX(' + pullDeltaX + 'px) rotate(' + deg + 'deg)');

		var opacity = pullDeltaX / 100;
		var rejectOpacity = opacity >= 0 ? 0 : Math.abs(opacity);
		var likeOpacity = opacity <= 0 ? 0 : opacity;
		$cardReject.css('opacity', rejectOpacity);
		$cardLike.css('opacity', likeOpacity);
	}

	function release() {
	    var value;
		if (pullDeltaX >= decisionVal) {
			$card.addClass('to-right');
			value = 1;
		} else if (pullDeltaX <= -decisionVal) {
			$card.addClass('to-left');
			value = -1;
		}

		if (Math.abs(pullDeltaX) >= decisionVal) {
			$card.addClass('inactive');
			setTimeout(function() {
			    var parent = $card.context.parentNode;
			    var card_id = document.getElementById($card.context.id);
				parent.removeChild(card_id);
				cardsCounter++;
				if (cardsCounter === numOfCards) {
					cardsCounter = 0;
					$('.card').removeClass('below');
					getCars();
				}
			}, 300);

		}

		if (Math.abs(pullDeltaX) < decisionVal) {
			$card.addClass('reset');
		}

		setTimeout(function() {
			$card.attr('style', '').removeClass('reset').find('.card__choice').attr('style', '');

			pullDeltaX = 0;
			animating = false;
		}, 300);

        var email = localStorage.getItem("email")
		makeRec('PUT', '/car_preferences?vin=' + $card[0].id + '&value=' + value + '&email=' + email, nothing);
	}

	$(document).on('mousedown touchstart', '.card:not(.inactive)', function(e) {
		if (animating) return;

		$card = $(this);
		$cardReject = $('.card__choice.m--reject', $card);
		$cardLike = $('.card__choice.m--like', $card);
		var startX = e.pageX || e.originalEvent.touches[0].pageX;

		$(document).on('mousemove touchmove', function(e) {
			var x = e.pageX || e.originalEvent.touches[0].pageX;
			pullDeltaX = x - startX;
			if (!pullDeltaX) return;
			pullChange();
		});

		$(document).on('mouseup touchend', function() {
			$(document).off('mousemove touchmove mouseup touchend');
			if (!pullDeltaX) return; // prevents from rapid click events
			release();
		});
	});
});

function nothing(){}

/* AJAX Boilerplate */
function makeRec(method, target, handlerAction, data) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			console.log('DONEDONEDONE');
			handlerAction(httpRequest);
		}
	};
	httpRequest.open(method, target);

	if (data) {
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(data);
	} else {
		httpRequest.send();
	}
}
