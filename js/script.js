'use strict';

// Declare map and location variables
var map;
var locations = [
	{name: "Mulberry Health and Retirement", location: {lat: 40.348114, lng: -86.67255899999999}},
	{name: "Pizza King of Mulberry", location: {lat: 40.343967, lng: -86.6661139}},
	{name: "Southfork Restaurant & Pub", location: {lat: 40.344499, lng: -86.665989}},
	{name: "Mulberry Park", location: {lat: 40.340536, lng: -86.659653}},
	{name: "Mulberry Community Library", location: {lat: 40.344274, lng: -86.657544}},
	{name: "Genda Funeral Home-Mulberry Chapel", location: {lat: 40.346559, lng: -86.666670}},
	{name: "Marathon Gas", location: {lat: 40.344854, lng: -86.664828}},
	{name: "Farmer's Bank", location: {lat: 40.344419, lng: -86.665319}},
	{name: "Mulberry Telephone", location: {lat: 40.344214, lng: -86.666254}}
];


/* Takes the reviews from Yelp data and assigns
them to the proper location based on name */
function assignReviews(reviews) {
	// Loop through all locations and reviews looking for a match
	locations.forEach(function(location) {
		reviews.forEach(function(review) {
			if (location.name == review.name) {
				location.review = review.snippet_text;
				location.reviewUrl = review.url;
				location.infoWindow.setContent(location.marker.title + '<br><br>' + '<b>From Yelp.com:</b><br>' + location.review + '<a href="' + location.reviewUrl + '"> full review</a>');
			}
		});

		// If the location does not have a review, let the user know
		if (location.review === undefined) {
			location.infoWindow.setContent(location.marker.title + '<br><br>' + 'No reviews... :(');
		}
	});
}

// Initialize map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		// Centers to Mulberry IN
		center: {lat: 40.3453136, lng: -86.6668564},
		zoom: 16
	});

	// Animate function for markers
	function animate(marker) {
		if (marker.getAnimation() === null) {
			// Start animation
			marker.setAnimation(google.maps.Animation.BOUNCE);

			// Stop animation after 1.5 seconds
			setTimeout(function() {
				marker.setAnimation(null);
			}, (1.5 * 1000));
		}
	}

	// Add markers to this list taking data from locations
	for (var i = 0; i < locations.length; i++) {
		// Get current location and make marker with data
		var currentLocation = locations[i];
		var marker = new google.maps.Marker({
			position: currentLocation.location,
			map: map,
			title: currentLocation.name,
			id: "marker" + i
		});

		// Create info window with content of marker's title
		var infoWindow = new google.maps.InfoWindow({
			content: marker.title
		});

		// Add animate function to marker
		marker.animate = function() {
			animate(this);
		};

		// When marker is clicked, display info window with marker info
		marker.addListener('click', (function(infoWindowCopy) {
			return function() {
				// Open info window
				infoWindowCopy.open(map, this);

				// Set animation to bounce
				this.animate();
			};
		})(infoWindow));

		// Add marker and infoWindow as objects to the location
		currentLocation.marker = marker;
		currentLocation.infoWindow = infoWindow;
	}

	// Apply ko bindings after map loads
	ko.applyBindings(new ViewModel());

	// Get data from Yelp after map loads
	getData();
}

// getData() function inspired by MarkN's code: https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/5


/* Gets review data from yelp then runs
assignReviews() function passing in the 
results as a parameter. */
function getData() {

	var MY_KEY = 'jcxihH9bOq3E-J4DBbcKFA';
	var SECRET_KEY = 'SxDknbz-0-uyzrhyvyvV6mralX4';
	var TOKEN = 'XZwiTogSdAxBtWOfcBqxORA9Av2khLut';
	var SECRET_TOKEN = 'VgRmDeZi__7Cj6-2SNGhkiZpBh8';

	var yelp_url = 'https://api.yelp.com/v2/search';

		// Parameters and authentication
		var parameters = {
			oauth_consumer_key: MY_KEY,
			oauth_token: TOKEN,
			oauth_nonce: Math.floor(Math.random() * 1e12).toString(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version : '1.0',
			limit: 10,
			location: 'Mulberry IN',
			// term: 'food',
			callback: 'cb'
		};
		var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, SECRET_KEY, SECRET_TOKEN);
		parameters.oauth_signature = encodedSignature;

		// Settings for AJAX reqeust
		var settings = {
			url: yelp_url,
			data: parameters,
			cache: true,
			dataType: 'jsonp',
			success: function(results) {
				console.log('success!');
				console.log(results);

				var reviews = [];

				// Get reviews and push them to list
				for (var i = 0; i < results.businesses.length; i++) {
					if (results.businesses[i].location.city === "Mulberry") {
						reviews.push(results.businesses[i]);
					}
				}

				// Assign reviews to locations
				assignReviews(reviews);
			},
			error: function(e) {
				console.log('error!');
				console.log(e);

				// Run assignReviews with empty list on fail
				assignReviews([]);
			}
		};

		// Run AJAX request with settings
		$.ajax(settings);
}

// Data for locations
var Location = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
	this.marker = ko.observable(data.marker);
	this.infoWindow = ko.observable(data.infoWindow);

	this.showInfo = function() {
		this.infoWindow().open(map, this.marker());
		this.marker().animate();
	};
};

// My ViewModel
var ViewModel = function() {
	console.log('Applying KO bindings');

	var self = this;

	// Links to the filter input
	this.filterValue = ko.observable("");

	// Handles the locations on left side of screen
	this.locationList = ko.computed(function() {
		var myList = [];
		locations.forEach(function(locationItem){
			// If the location name includes text from the input add it to the list
			if (locationItem.name.toLowerCase().includes(self.filterValue().toLowerCase())) {
				myList.push(new Location(locationItem));
				locationItem.marker.setMap(map);
			} else {
				locationItem.marker.setMap(null);
			}
		});

		return myList;
	}, this);
};