var container = document.getElementById('liked-cont');
getLikes();

function getLikes() {
	console.log('doing the likes');
	var email = localStorage.getItem('email');
	endpoint = '/car_likes?email=' + email;
	makeRec('GET', endpoint, handleLikes);
}
function handleLikes(response) {
	var object = JSON.parse(response.responseText);
	console.log(response.responseText);
	var j_object = JSON.parse(object);
	console.log(j_object);
	for (var car in j_object) {
		fillLikes(j_object[car]);
	}
}

function fillLikes(object) {
	var car = JSON.parse(object);
	//console.log(car['vin']);
	var new_like = document.createElement('div');
	var car_info = document.createElement('div');
	car_info.innerText =
		car['build']['year'] + ' ' + car['build']['make'] + ' ' + car['build']['model'] + ' ' + car['build']['trim'];

	car_info.classList.add('car_info');
	var car_img = document.createElement('div');
	var img = document.createElement('img');
	img.src = car['media']['photo_links'][0];
	car_img.classList.add('car_photo');
	car_img.appendChild(img);
	new_like.appendChild(car_img);
	new_like.appendChild(car_info);

	new_like.classList.add('liked_car_item');
	container.appendChild(new_like);
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
