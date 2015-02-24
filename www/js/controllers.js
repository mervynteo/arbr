angular.module('arbr.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading) {
  // Form data for the login modal
  $scope.loginData = {};
  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.userSettingsGo = function() {
    console.log('rawr');
  }

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SplashCtrl', function($scope, $stateParams, $state) {
  $scope.fbLogin = function() {
      openFB.login(
          function(response) {
              if (response.status === 'connected') {
                  $state.go("app.map");
              } else {
                  alert('Facebook login failed');
                  $state.go("splash");
              }
          },
          {scope: 'email,publish_actions'});
  }
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {

    $scope.map = {};

    $scope.clickTest = function() {
      console.log(this.$id);
    }

    function centerOnMe() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: true
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          var newPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          $scope.map.setCenter(newPos);
          $scope.loading.hide();

          var newMarker = new google.maps.Marker({
            position: newPos,
            // icon: 'img/arbr-map-marker.png',
            map: $scope.map,
            title: 'rawrawr'
          });

          //Marker + infowindow + angularjs compiled ng-click
          var contentString = "<div><a ng-click='clickTest()'>You are here!</a></div>";
          var compiled = $compile(contentString)($scope);

          var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
          });

          google.maps.event.addListener(newMarker, 'click', function() {
            infowindow.open($scope.map,newMarker);
          });

        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    };

    // Placeholders for our Pins and Popups
    var markers = [];
    var map, infoWindow;  

    // General GoogleMaps configuration
    var mapOptions = {
      center: new google.maps.LatLng(37.7833,-122.4167),
      zoom: 12,
      scaleControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false
    };

    function setMarker(map, position, title, content) {
      var marker;
      var markerOptions = {
        position: position,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: 'img/arbr-map-marker.png'
      }

      marker = new google.maps.Marker(markerOptions);
      markers.push(marker); // add marker to array

      google.maps.event.addListener(marker, 'click', function(scope) {
        var contentString = 
        "<div><h4 class=em-default>" 
        + content 
        + "</h4>" 
        + "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, modi qui et alias impedit culpa tempore, veritatis explicabo in quia! Minima a dolorum voluptas doloribus praesentium enim hic unde accusantium!</p>"
        + "<button ng-click=clickTest() class='button button-balanced em-default'>Check in to plant a tree!</button>"
        + "</div>";

        var compiled = $compile(contentString)($scope);
        console.log(compiled);

        if (infoWindow !== void 0) {
            infoWindow.close();
        }

        var infoWindowOptions = {
            content: compiled[0],
            maxWidth: 250
        };

        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        infoWindow.open(map, marker);
      })

    }

    function setArbrMarkers(map) {
      var firebaseRef = new Firebase("https://arbr-project.firebaseio.com/");
      var geoFire = new GeoFire(firebaseRef);
      var compiled;

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
    }  

    function initialize() {
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        $scope.map = map;

        centerOnMe();
        setArbrMarkers(map);
    };

    ionic.Platform.ready(initialize);

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

});