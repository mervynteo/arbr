angular.module('arbr.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading) {
  console.log('rawr');
})

.controller('SplashCtrl', function($scope, $stateParams, $state) {
  $scope.fbLogin = function() {
      openFB.login(
          function(response) {
              console.log(response)
              if (response.status === 'connected') {
                  $state.go("map");
              } else {
                  alert('Facebook login failed, please try again');
                  $state.go("splash");
              }
          },
          {scope: 'email,publish_actions'});
  }
})

.controller('ProfileCtrl', function($scope, $ionicHistory, $state) {
  $scope.data = {};
  $scope.photoUrl = {};

  $scope.myGoBack = function() {
    $state.go("map");
  }

  $scope.logout = function() {
    console.log('rawr');
    openFB.logout(
      function() {
          alert('Logout successful');
          $state.go('splash');
      },
      '');
  }

 function getInfo() {
     openFB.api({
         path: '/me',
         success: function(data) {
             // console.log(JSON.stringify(data));
             $scope.photoUrl = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
             $scope.data = data;
             $scope.$apply();
         },

        error: function() {
          alert('Error getting your profile from FB');
        }
      });
  }

  ionic.Platform.ready(getInfo);
})

.controller("MapCtrl", ["$scope", "$firebase",
  function($scope, $firebase, $ionicLoading, $state) {
    $scope.locationArray = [];
    $scope.icon = '../img/arbr-map-marker.png';
    $scope.map = { center: { latitude: 37.7833, longitude: -122.4167 }, zoom: 13, options: {disableDefaultUI: true}};

    // $http.get('http://localhost:3300/api/places').then(function(resp) {
    //     console.log('Success', resp);
    //     // For JSON responses, resp.data contains the result
    //   }, function(err) {
    //     console.error('ERR', err);
    //     // err.status will contain the status code
    //   })

    var ref = new Firebase("https://arbr-project.firebaseio.com");
    var sync = $firebase(ref);
    var obj = sync.$asObject();
    var unformattedLocations = [];
    var formattedLocations = [];

    obj.$loaded().then(function() {
      unformattedLocations = obj[0].locations;
      var i = 0;
      for (x in unformattedLocations) { 
        formattedLocations[i] = {'id': i,
                                 'icon': './img/arbr-map-marker.png',
                                 'name': unformattedLocations[x].name, 
                                 'latitude': unformattedLocations[x].pos[0],
                                 'longitude': unformattedLocations[x].pos[1],
                                };
        i++;
      }

      // Set our locationArray to the freshly formatted set of locations
      $scope.locationArray = formattedLocations;

    });

    $scope.userSettings = function() {
      $state.go("userProfile");
    }

    $scope.loadMoreTweets = function () {
        alert("Loading tweets!");
    }

    }
]);

// .controller('MapCtrl', ["$scope", "$firebase", function($scope, $ionicLoading, $compile, $state, $firebase) {

    // var map, infoWindow;
    // var markers = [];

    // // map config
    // var mapOptions = {
    //     center: new google.maps.LatLng(37.7833,-122.4167),
    //     zoom: 12,
    //     scaleControl: false,
    //     streetViewControl: false,
    //     disableDefaultUI: true,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     scrollwheel: false
    // };

    // $scope.map = {};

    // $scope.centerOnMe = function() {
    //     if(!$scope.map) {
    //         return;
    //     }

    //     $scope.loading = $ionicLoading.show({
    //       content: 'Getting current location...',
    //       showBackdrop: true
    //     });

    //     navigator.geolocation.getCurrentPosition(function(pos) {
    //       var newPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    //       $scope.map.setCenter(newPos);
    //       $scope.loading.hide();

    //       var newMarker = new google.maps.Marker({
    //         position: newPos,
    //         // icon: 'img/arbr-map-marker.png',
    //         map: $scope.map,
    //         title: 'rawrawr'
    //       });

    //       //Marker + infowindow + angularjs compiled ng-click
    //       var contentString = "<div><a ng-click='clickTest()''>You are here!</a></div>";
    //       var compiled = $compile(contentString)($scope);

    //       var infowindow = new google.maps.InfoWindow({
    //         content: compiled[0]
    //       });

    //       google.maps.event.addListener(newMarker, 'click', function() {
    //         infowindow.open($scope.map,newMarker);
    //       });

    //     }, function(error) {
    //       alert('Unable to get location: ' + error.message);
    //     });
    // };

    // $scope.clickTest = function() {
    //   console.log('here we go');
    // }

    // function setMarker(map, position, title, content) {
    //     var marker;
    //     var markerOptions = {
    //         position: position,
    //         map: map,
    //         title: title,
    //         animation: google.maps.Animation.DROP,
    //         icon: 'img/arbr-map-marker.png'
    //     };

    //     marker = new google.maps.Marker(markerOptions);
    //     markers.push(marker); // add marker to array
        

    //     google.maps.event.addListener(marker, 'click', function (scope) {
    //         var contentString = "<div><h4 class=windowTitle ng-click=clickTest()>" + content + "</h4></div>";
    //         var compiled = $compile(contentString)($scope);

    //         if (infoWindow !== void 0) {
    //             infoWindow.close();
    //         }
    //         // create new window
    //         var infoWindowOptions = {
    //             content: compiled[0]
    //         };
    //         infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    //         infoWindow.open(map, marker);
    //     });
    // }


    // function initialize() {
    //     map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //     $scope.map = map;

    //     // Get some data from Firebase
    //     var firebaseRef = new Firebase("https://arbr-project.firebaseio.com/");
    //     firebaseRef.on("value", function(snapshot) {
    //         rawLocationData = snapshot.val();
    //         usableLocationData = rawLocationData[0].locations;

    //         for(i in usableLocationData) {
    //             locName = usableLocationData[i].name;
    //             locPosLat = usableLocationData[i].pos[0];
    //             locPosLong = usableLocationData[i].pos[1];
    //             locPosLatLong = new google.maps.LatLng(locPosLat, locPosLong);
    //             setMarker(map, locPosLatLong, locName, locName);
    //         }
    //     });

    //     // $scope.centerOnMe();
    // };

    // ionic.Platform.ready(initialize);
// }]);

