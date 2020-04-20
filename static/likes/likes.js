if(localStorage.getItem("email") == null || localStorage.getItem("access_token") == null){
	if(localStorage.getItem("email") != null)
		localStorage.removeItem("email");
	else if(localStorage.getItem("access_token") != null)
		localStorage.removeItem("access_token");
	location.href = "/"
}

var container = document.getElementById('liked-cont');
getLikes();

function getLikes() {
	var email = localStorage.getItem('email');
	endpoint = '/car_likes?email=' + email;
	makeRec('GET', endpoint, handleLikes);
}
function handleLikes(response) {
	var object = JSON.parse(response.responseText);
	var j_object = JSON.parse(object);
	console.log(j_object);
	for (var car in j_object) {
		fillLikes(j_object[car]);
	}
}

function fillLikes(car) {
	var new_like = document.createElement('div');
	new_like.classList.add('liked-car');
	
	var title=document.createElement('div');
	title.classList.add('car-title');
	title.innerText=car['title'];
	var infoCont=document.createElement('div');
	var miles=document.createElement('div');
	miles.classList.add('car-miles'); 
	if(car['miles']!="undefined"){
		miles.innerText=addCommas(car['miles']) + " miles";
	}
	else{
		miles.innerText='Contact Dealer for miles'
	}
	var price=document.createElement('div');
	price.classList.add('car-price');
	price.innerText=("$"+addCommas(car['price']));
	infoCont.appendChild(title);
	var otherCont=document.createElement('div')
	otherCont.appendChild(miles);
	otherCont.appendChild(price)
	infoCont.appendChild(otherCont)
	infoCont.classList.add('car-details')
	var car_img = document.createElement('div');
	var img = document.createElement('img');
	img.src = car['pic_src'];
	car_img.classList.add('car-image');
	car_img.appendChild(img);
	new_like.appendChild(car_img);
	new_like.appendChild(infoCont);
	container.appendChild(new_like);
	new_like.onclick = function() {
		location.href = car['vdp'];	
	};
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
