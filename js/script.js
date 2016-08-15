// Declare map and location variables

var map;
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

// Initialize map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		// Centers to Mulberry IN
		center: {lat: 40.3453136, lng: -86.6668564},
		zoom: 16
	});
	// Create marker list
	var markers = [];

	function animate(marker) {
		if (marker.getAnimation() == null) {
			// Start animation
			marker.setAnimation(google.maps.Animation.BOUNCE);

			// Stop animation after 1.5 seconds
			setTimeout(function() {
				marker.setAnimation(null);
			}, (1.5 * 1000));
		}
	}


	// Add markers to this list taking data from locations
	for (i in locations) {
		// Get current location and make marker with data
		current_location = locations[i];
		var marker = new google.maps.Marker({
			position: current_location.location,
			map: map,
			title: current_location.name,
			id: i
		});

		// Create info window with content of marker's title
		var infoWindow = new google.maps.InfoWindow({
			content: marker.title
		});

		// When marker is clicked, display info window with marker info
		marker.addListener('click', (function(infoWindowCopy) {
			return function() {
				// Open info window
				infoWindowCopy.open(map, this);

				// Set animation to bounce
				animate(this);
			};
		})(infoWindow));

		markers.push(marker);
	}
}

// Data for locations
var Location = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
}

// My ViewModel
var ViewModel = function() {
	var self = this;

	// Links to the filter input
	this.filterValue = ko.observable("Hello");

	// handles the locations on left side of screen
	this.locationList = ko.computed(function() {
		var myList = []
		locations.forEach(function(locationItem){
			myList.push(new Location(locationItem));
		});
		return myList;
	}, this);
}

ko.applyBindings(new ViewModel);