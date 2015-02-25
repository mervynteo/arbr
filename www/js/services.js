angular.module('arbr.services', [])
.factory('FirebaseService', function() {

    // Get some data from Firebase
    var firebaseRef = new Firebase("https://arbr-project.firebaseio.com/");
    firebaseRef.on("value", function(snapshot) {
        rawLocationData = snapshot.val();
        usableLocationData = rawLocationData[0].locations;
        for(i in usableLocationData) {
            locName = usableLocationData[i].name;
            locPosLat = usableLocationData[i].pos[0];
            locPosLong = usableLocationData[i].pos[1];
            locPosLatLong = new google.maps.LatLng(locPosLat, locPosLong);
            setMarker(map, locPosLatLong, locName, locName);
        }
    });

    var pets = [
        { id: 0, title: 'Cats', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
        { id: 1, title: 'Dogs', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
        { id: 2, title: 'Turtles', description: 'Everyone likes turtles.' },
        { id: 3, title: 'Sharks', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }
      ];





      return {
        all: function() {
          return pets;
        },
        get: function(petId) {
          // Simple index lookup
          return pets[petId];
        }
      }
});