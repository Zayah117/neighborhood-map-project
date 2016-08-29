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

// Get data from Yelp
getData();

/* Takes the reviews from Yelp data and assigns
them to the proper location based on name */
function assignReviews(reviews) {
	for (i in locations) {
		for (j in reviews) {
			if (locations[i].name == reviews[j].name) {
				locations[i].review = reviews[j].snippet_text;
				locations[i].reviewUrl = reviews[j].url;
				locations[i].infoWindow.setContent(locations[i].marker.title + '<br><br>' + locations[i].review + '<a href="' + locations[i].reviewUrl + '"> full review</a>');
			}
		}
	}
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
		currentLocation = locations[i];
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
		}

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
	ko.applyBindings(new ViewModel);
}

// Inspired by MarkN's code: https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/4


/* Gets review data from yelp then runs
assignReviews() function passing in the 
results as a parameter. */
function getData() {

	// Generates a random number and returns it as a string for OAuthentication
	function nonce_generate() {
		return (Math.floor(Math.random() * 1e12).toString());
	}

	var MY_KEY = 'jcxihH9bOq3E-J4DBbcKFA';
	var SECRET_KEY = 'SxDknbz-0-uyzrhyvyvV6mralX4';
	var TOKEN = 'XZwiTogSdAxBtWOfcBqxORA9Av2khLut';
	var SECRET_TOKEN = 'VgRmDeZi__7Cj6-2SNGhkiZpBh8';

	var yelp_url = 'https://api.yelp.com/v2/search';

		var parameters = {
			oauth_consumer_key: MY_KEY,
			oauth_token: TOKEN,
			oauth_nonce: nonce_generate(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version : '1.0',
			limit: 10,
			location: 'Mulberry IN',
			// term: 'food',
			callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
		};

		var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, SECRET_KEY, SECRET_TOKEN);
		parameters.oauth_signature = encodedSignature;

		var settings = {
			url: yelp_url,
			data: parameters,
			cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
			dataType: 'jsonp',
			success: function(results) {
				console.log('success!');
				console.log(results);

				var reviews = [];

				for (i in results.businesses) {
					if (results.businesses[i].location.city === "Mulberry") {
						reviews.push(results.businesses[i]);
					}
				}

				assignReviews(reviews);
			},
			error: function(e) {
				console.log('error!');
				console.log(e);
			}
		};

		// Send AJAX query via jQuery library.
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
	}
}

// My ViewModel
var ViewModel = function() {
	console.log('Applying KO bindings');

	var self = this;

	// Links to the filter input
	this.filterValue = ko.observable("");

	// Handles the locations on left side of screen
	this.locationList = ko.computed(function() {
		var myList = []
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
}