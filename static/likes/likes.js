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
	var j_object = JSON.parse(object);
	//console.log(j_object);
	for (var car in j_object) {
		fillLikes(j_object[car]);
	}
}

function fillLikes(object) {
	var car = JSON.parse(object);
	//console.log(car['vin']);
	var new_like = document.createElement('div');
	new_like.innerText =
		car['build']['year'] + ' ' + car['build']['make'] + ' ' + car['build']['model'] + ' ' + car['build']['trim'];
	// var img = document.createElement('img');
	// img.src = car['media']['photo_links'][0];
	// img.classList.add('car_photo');
	// new_like.appendChild(img);
	new_like.classList.add('liked_car_item');
	console.log('adding a car');
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
