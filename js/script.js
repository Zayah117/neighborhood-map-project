var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.3453136, lng: -86.6668564},
		zoom: 16
	});

	var locations = [
		{name: "Mulberry Health and Retirement", location: {lat: 40.348114, lng: -86.67255899999999}},
		{name: "Pizza King", location: {lat: 40.343967, lng: -86.6661139}},
		{name: "Southfork", location: {lat: 40.344499, lng: -86.665989}},
		{name: "Mulberry Park", location: {lat: 40.340536, lng: -86.659653}},
		{name: "Mulberry Community Library", location: {lat: 40.344274, lng: -86.657544}},
		{name: "Bodline Funeral Home", location: {lat: 40.346559, lng: -86.666670}},
		{name: "Marathon Gas", location: {lat: 40.344854, lng: -86.664828}},
		{name: "Farmer's Bank", location: {lat: 40.344419, lng: -86.665319}},
		{name: "Mulberry Telephone", location: {lat: 40.344214, lng: -86.666254}}
	];
	for (i in locations) {
		current_location = locations[i];
		var marker = new google.maps.Marker({
			position: current_location.location,
			map: map,
			title: current_location.name,
			id: i
		});
	}
}