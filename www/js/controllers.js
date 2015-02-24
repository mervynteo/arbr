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

    $scope.clickTest = function() {
      alert('rawr');
    }

    var markers = [];
    var infoWindows = [];

    function setArbrMarkers(map) {
      var firebaseRef = new Firebase("https://arbr-project.firebaseio.com/");
      var geoFire = new GeoFire(firebaseRef);
      var compiled;

      firebaseRef.on("value", function(snapshot) {
        var rawLocations = snapshot.val();
        var locations = rawLocations[0].locations;

        for(x in locations) {
          locName = locations[x].name;
          locPosLat = locations[x].pos[0];
          locPosLong = locations[x].pos[1];
          var locPosFinal = new google.maps.LatLng(locPosLat, locPosLong);

          var marker = new google.maps.Marker({
            position: locPosFinal,
            icon: 'img/arbr-map-marker.png',
            map: map,
            title: locName,
            animation: google.maps.Animation.DROP
          });

          marker.contentString = "<div><h4 class=em-default' ng-click='clickTest()'>" + locations[x].name + "</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, excepturi. Provident fuga inventore quod dolores sint est sed ad accusamus, nihil labore beatae eos enim sit, voluptatibus debitis similique temporibus</p></div>";
          marker.compiled = $compile(marker.contentString)($scope);


          var infoWindow = new google.maps.InfoWindow({});

          google.maps.event.addListener(marker, 'click', function(){
              infoWindow.setContent(this.compiled[0]);
              infoWindow.open(map, this);
          });

        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }  

    function initialize() {
        var myLatlng = new google.maps.LatLng(37.7833,-122.4167);

        var mapOptions = {
          center: myLatlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        $scope.map = map;

        setArbrMarkers(map);
    };

    ionic.Platform.ready(initialize);

    // google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function() {
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