getCars();
var card_cont;
var all_cars;

function getCars() {
	endpoint = '/search';
	endpoint += '?make=Chevrolet';
	makeRec('GET', endpoint, handleCars);
}

function handleCars(response) {
	var object = JSON.parse(response.responseText);
	var j_object = JSON.parse(object);
	card_cont = document.getElementById('card-cont');
	allCars = j_object['listings'];
	allCars.forEach((car) => {
		buildCard(car);
	});
}

function buildCard(car) {
	// Card structure
	if (car['media'] == null) return;
	var new_card = document.createElement('div');
	new_card.className = 'card';
	new_card.id = car['vin'];
	var card_top = document.createElement('div');
	card_top.className = 'card__top purple';
	var card_bot = document.createElement('div');
	card_bot.className = 'card__btm';

	const cardLike = document.createElement('div'); //cool green swipe effect
	cardLike.classList.add('card__choice');
	cardLike.classList.add('m--like');

	const cardReject = document.createElement('div'); //cool red swipe effect
	cardReject.classList.add('card__choice');
	cardReject.classList.add('m--reject');

	// Card top
	var card_img = document.createElement('div');
	card_img.className = 'card__img';
	var img = document.createElement('img');
	img.id = car['vin'] + '-img-0';
	img.addEventListener('click', goToNextImage);
	img.src = car['media']['photo_links'][0];
	card_img.appendChild(img);

	var card_name = document.createElement('div');
	card_name.className = 'card__name';
	card_name.innerText = car['heading'];

	card_top.appendChild(card_img);
	card_top.appendChild(card_name);

	new_card.appendChild(card_top);
	new_card.appendChild(card_bot);
	new_card.appendChild(cardLike);
	new_card.appendChild(cardReject);
	card_cont.appendChild(new_card);
}

function goToNextImage(e) {
	var id = e.target.id.split('-');
	var vin = id[0];
	var index = parseInt(id[2]);

	var thisCar;
	allCars.forEach((car) => {
		if (car['vin'] == vin) thisCar = car;
	});

	e.target.src = thisCar['media']['photo_links'][++index];

	if (index >= 4) index = 0;
	e.target.id = vin + '-img-' + index;
}

/* AJAX Boilerplate */
function makeRec(method, target, handlerAction, data) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			// console.log('DONEDONEDONE');
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
