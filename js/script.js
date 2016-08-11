var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.3453136, lng: -86.6668564},
		zoom: 16
	});
}