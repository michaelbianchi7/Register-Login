
var hotspot = [];
var map;
var polygonCoords = [];
var polyShapes = [];

var regionOn = document.getElementById("region-on");
var regionOff = document.getElementById("region-off");
var finishSignIn = document.getElementById("finishSignIn");
var finishRegister = document.getElementById("finishRegister");
var signOut = document.getElementById("signOutButton");
var popupbox1 = document.getElementById("popupbox1");
var popupbox2 = document.getElementById("popupbox2");


regionOn.addEventListener("click", addRegions);
regionOff.addEventListener("click", removeRegions);
signOut.addEventListener("click", toggleSignOut);
finishSignIn.addEventListener("click", toggleSignIn);
finishRegister.addEventListener("click", handleSignUp);

var signInInputs = popupbox1.querySelectorAll("input");
var registerInputs = popupbox2.querySelectorAll("input");


function handleSignUp() {
	var email = registerInputs[0].value;
	var password = registerInputs[1].value;
	var firstName = registerInputs[2].value;
	var lastName = registerInputs[3].value;

	if (registerInputs[0].length < 4) {
		alert('Please enter an email address.');
		return;
	}
	if (registerInputs[1].length < 4) {
		alert('Please enter a password.');
		return;
	}
	//create user and store full name
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    	var user = firebase.auth().currentUser;
   	
		firebase.database().ref(user.uid).set({
    		firstName: firstName,
    		lastName: lastName
		});
		
		}, function(error){
		// Handle Errors here.
    	var errorCode = error.code;
    	var errorMessage = error.message;
    	
    	if (errorCode == 'auth/weak-password') {
    		alert('The password is too weak.');
    	} else {
    		alert(errorMessage);
    	}
    	console.log(error);	
	});
	document.getElementById("newUserButton").className += "hide";
	document.getElementById("signInButton").className += "hide";
	document.getElementById("signOutButton").className ="";
}

function toggleSignIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        var email = signInInputs[0].value;
      	var password = signInInputs[1].value;
        
        if (signInInputs[0].length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (signInInputs[1].length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    }
    document.getElementById("signInButton").className += "hide";
    document.getElementById("newUserButton").className += "hide";
    document.getElementById("signOutButton").className ="";
}

function toggleSignOut() {
	if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    document.getElementById("newUserButton").className = "";
    document.getElementById("signInButton").className = "";
    document.getElementById("signOutButton").className +="hide";
}

// makes login form visible and register form hidden
function login(showhide){ 
	if(showhide == "show"){
	    document.getElementById('popupbox1').style.visibility="visible";
	}else if(showhide == "hide"){
	    document.getElementById('popupbox1').style.visibility="hidden"; 
	}

}

// makes register form visible and login form hidden
function register(showhide){ 
	if(showhide == "show"){
	    document.getElementById('popupbox2').style.visibility="visible";
	}else if(showhide == "hide"){
	    document.getElementById('popupbox2').style.visibility="hidden"; 
	}
}




//create map
function initMap() {
	//custom style
	var styledMapType = new google.maps.StyledMapType(
	  [
		  {"elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#ebe3cd"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#523735"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#f5f1e6"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#c9b2a6"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#dcd2be"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#ae9e90"
		      }
		    ]
		  },
		  {
		    "featureType": "landscape.natural",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#93817c"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "geometry.fill",
		    "stylers": [
		      {
		        "color": "#a5b076"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#447530"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#f5f1e6"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "labels.icon",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "road.arterial",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#fdfcf8"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#f8c967"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#e9bc62"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway.controlled_access",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#e98d58"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway.controlled_access",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#db8555"
		      }
		    ]
		  },
		  {
		    "featureType": "road.local",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#806b63"
		      }
		    ]
		  },
		  {
		    "featureType": "transit",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#8f7d77"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#ebe3cd"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.station",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "geometry.fill",
		    "stylers": [
		      {
		        "color": "#b9d3c2"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#92998d"
		      }
		    ]
		  }
		], {name: 'Styled Map'});
	  
	//create map
  	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 12,
    	center: {lat: 42.300271, lng: -83.005173},
    	mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
  	});

  	//add users current location
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
        	lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        marker = new google.maps.Marker({
        	map: map,
        	draggable: true,
        	animation: google.maps.Animation.DROP,
        	position: pos
    	});
        marker.addListener('click', toggleBounce);
       	map.setCenter(pos);
       	}, function() {
        handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
    
  	//extract polygon coordinates from database
 	var regionsRef = firebase.database().ref('regions/');
	regionsRef.on('value', function(snapshot) {
		coords = snapshot.val();
		for(var i=0; i<coords.length; i++){
			polygonCoords = coords[i];
	
			// Construct the polygon.
		  	hotSpot = new google.maps.Polygon({
				paths: polygonCoords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35
			});
			
			polyShapes.push(hotSpot);
	  		addRegions();
	  		map.mapTypes.set('styled_map', styledMapType);
	  		map.setMapTypeId('styled_map');
	  	}
  	});

}

//current location marker bounce
function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }

//add all polygons
function addRegions() {
	for(var i = 0; i<polyShapes.length; i++){
		polyShapes[i].setMap(map);
	}	
}

//remove all polygons
function removeRegions() {
	for(var i = 0; i<polyShapes.length; i++){
		polyShapes[i].setMap(null);
	}	
}






