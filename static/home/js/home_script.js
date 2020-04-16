var card_cont;
var all_cars;
var colors = [ 'purple', 'blue', 'indigo', 'cyan', 'lime', 'brown' ];
var js_passthrough = JSON.parse(document.getElementById('js-passthrough').innerText);
var search_params = js_passthrough['search_params'];

var no_cards_found = document.getElementById('no-cards-found');

getCars();

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
function getCars() {
	var email = localStorage.getItem('email');
	endpoint = '/search?email=' + email;

	console.log('Building search query...');
	for (const [ key, value ] of Object.entries(search_params)) {
		if (value != '') {
			console.log('\t' + key + ' -> ' + value);
			endpoint += '&' + key + '=' + value.replace(/\s/g, "");
		} else {
			console.log('\tEmpty key: ' + key);
		}
	}
	makeRec('GET', endpoint, handleCars);
}

function handleCars(response) {
	var object = JSON.parse(response.responseText);
	var j_object = JSON.parse(object);
	card_cont = document.getElementById('card-cont');
	allCars = j_object['listings'];
	if(allCars.length == 0) {
		no_cards_found.style.display = "flex";
	} else {
		allCars.forEach((car) => {
			buildCard(car);
		});
	}
}

function buildCard(car) {
	// Card structure
	if (car['media'] == null || car['price'] == null) return;
	var new_card = document.createElement('div');
	new_card.className = 'card';
	new_card.id = car['vin'];
	new_card.data = car;
	var card_top = document.createElement('div');
	card_top.classList.add('card__top');
	var color = getRandomColor();

	console.log(document.body.style.background);
	card_top.style.background = color;

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
	img.id = car['vin'] + '-img-1';
	img.addEventListener('click', goToNextImage);
	img.src = car['media']['photo_links'][0];
	card_img.appendChild(img);

	var card_name = document.createElement('div');
	card_name.className = 'card__name';
	var title =
		car['build']['year'] + ' ' + car['build']['make'] + ' ' + car['build']['model'] + ' ' + car['build']['trim'];
	card_name.innerText = title;

	card_top.appendChild(card_img);
	card_top.appendChild(card_name);

	// Card bottom
	var card_bot_header = document.createElement('div');
	card_bot_header.className = 'card_bot_header';
	var price = document.createElement('div');
	price.className = 'price';
	price.innerHTML = '$' + addCommas(car['price']);
	card_bot_header.appendChild(price);
	var miles = document.createElement('div');
	miles.className = 'miles';
	if (car['miles']) {
		miles.innerHTML = addCommas(car['miles']) + "<span style='font-size:35px'>miles</span>";
	} else {
		miles.innerHTML = 'Ask Alan';
	}
	card_bot_header.appendChild(miles);

	var newused = document.createElement('div');
	newused.className = 'element';
	var newused_text = car['inventory_type'] == 'used' ? 'Used' : 'New';
	newused.innerHTML = "<img src='" + js_passthrough['keys-pic'] + "'>" + newused_text;
	var drivetrain = document.createElement('div');
	drivetrain.className = 'element';
	drivetrain.innerHTML = "<img src='" + js_passthrough['drivetrain-pic'] + "'>" + car['build']['drivetrain'];
	var transmission = document.createElement('div');
	transmission.className = 'element';
	transmission.innerHTML =
		"<img src='" +
		js_passthrough['transmission-pic'] +
		"'>" +
		car['build']['transmission'] +
		', ' +
		car['build']['engine'];
	var bodytype = document.createElement('div');
	bodytype.className = 'element';
	bodytype.innerHTML =
		"<img src='" +
		js_passthrough['bodytype-pic'] +
		"'>" +
		car['build']['body_type'] +
		', ' +
		car['build']['std_seating'] +
		' seats';

	card_bot.appendChild(card_bot_header);
	card_bot.appendChild(newused);
	card_bot.appendChild(bodytype);
	card_bot.appendChild(drivetrain);
	card_bot.appendChild(transmission);

	new_card.appendChild(card_top);
	new_card.appendChild(card_bot);
	new_card.appendChild(cardLike);
	new_card.appendChild(cardReject);
	card_cont.appendChild(new_card);
}

function addCommas(nStr) {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function goToNextImage(e) {
	var id = e.target.id.split('-');
	var vin = id[0];
	var index = parseInt(id[2]);

	var thisCar;
	allCars.forEach((car) => {
		if (car['vin'] == vin) thisCar = car;
	});

	e.target.src = thisCar['media']['photo_links'][index];

	index++;

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

function LightenDarkenColor(colorCode, amount) {
	var usePound = true;

	if (colorCode[0] == '#') {
		colorCode = colorCode.slice(1);
		usePound = true;
	}

	var num = parseInt(colorCode, 16);

	var r = (num >> 16) + amount;

	if (r > 255) {
		r = 255;
	} else if (r < 0) {
		r = 0;
	}

	var b = ((num >> 8) & 0x00ff) + amount;

	if (b > 255) {
		b = 255;
	} else if (b < 0) {
		b = 0;
	}

	var g = (num & 0x0000ff) + amount;

	if (g > 255) {
		g = 255;
	} else if (g < 0) {
		g = 0;
	}

	return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}
