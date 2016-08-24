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

		currentLocation.marker = marker;
		currentLocation.infoWindow = infoWindow;
	}
	ko.applyBindings(new ViewModel);
	getData();
}

// MY OLD CODE

/*
function getData() {
	var yelpUrl = 'https://api.yelp.com/v2/search?location=San+Francisco';

	var parameters = {
		oauth_consumer_key: 'jcxihH9bOq3E-J4DBbcKFA',
		oauth_token: '97hDLyug92HlKhfUUholXDEr6C4ztNqd',
		oauth_signature_method: 'hmac-sha1',
		oauth_version: '2.0',
		oauth_nonce: (Math.floor(Math.random() * 1e12).toString()),
		oauth_timestamp: Math.floor(Date.now()/1000),
		callback: 'cb'
	};

	// var encodedSignature = oauthSignature.generate('GET',yelpUrl, parameters, 'SxDknbz-0-uyzrhyvyvV6mralX4', 'kLwD7MBstt1lq3zDqkjXkL2GRUo');

	$.ajax({
		url: yelpUrl,
		data: parameters,
		cache: true,
		dataType: 'jsonp',
		success: function(results) {
			console.log(results);
		},
		fail: function() {
			console.log('FAIL');
		}


	});

	timestamp = (Date.now()/100);
	$.ajax('https://api.yelp.com/v2/search?term=food&location=San+Francisco&oauth_consumer_key=jcxihH9bOq3E-J4DBbcKFA&oauth_token=97hDLyug92HlKhfUUholXDEr6C4ztNqd&oauth_signature_method=hmac-sha1&oauth_signature=kLwD7MBstt1lq3zDqkjXkL2GRUo&oauth_timestamp=' + timestamp + '')
}

*/

// MarkN's code: https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/4

function getData() {
	/**
	 * Generates a random number and returns it as a string for OAuthentication
	 * @return {string}
	 */
	function nonce_generate() {
	  return (Math.floor(Math.random() * 1e12).toString());
	}

	// var YELP_BASE_URL = 'https://api.yelp.com/';
	var MY_KEY = 'jcxihH9bOq3E-J4DBbcKFA';
	var SECRET_KEY = 'SxDknbz-0-uyzrhyvyvV6mralX4';
	var TOKEN = 'XZwiTogSdAxBtWOfcBqxORA9Av2khLut';
	var SECRET_TOKEN = 'VgRmDeZi__7Cj6-2SNGhkiZpBh8';

	var yelp_url = 'https://api.yelp.com/v2/search';

	// var yelp_url = 'https://api.yelp.com/v2/search?term=food&location=San+Francisco';

	    var parameters = {
	      oauth_consumer_key: MY_KEY,
	      oauth_token: TOKEN,
	      oauth_nonce: nonce_generate(),
	      oauth_timestamp: Math.floor(Date.now()/1000),
	      oauth_signature_method: 'HMAC-SHA1',
	      oauth_version : '1.0',
	      limit: 10,
	      location: 'San Francisco',
	      term: 'food',
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
	        // Do stuff with results
	        console.log('success!');
	        console.log(results);
	      },
	      error: function(e) {
	        // Do stuff on fail
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
	var self = this;

	// Pass my array of markers into the view model
	// this.markerList = ko.observableArray(markers);

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