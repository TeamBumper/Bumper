function fillLikes() {
	var email = localStorage.getItem('email');

	makeRec(
		'PUT',
		'/car_preferences?vin=' + $card[0].id + '&value=' + value + '&email=' + email + '&data=' + data,
		nothing
	);
}
