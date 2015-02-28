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
                  $state.go("locationview.map");
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
    $state.go("locationview.map");
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
     $scope.data = {};
     openFB.api({
         path: '/me',
         success: function(data) {
             console.log(data);
             $scope.data = data;
             $scope.$apply();
         },

        error: function(err) {
          alert(err);
        }
      });
  }

  ionic.Platform.ready(getInfo);
})

.controller("InfoWindowCtrl", function($scope, $state) {

  $scope.arbrLocationPage = function(id) {
    $state.go('arbrLocation', { fbID: id });
  }

})

.controller("ArbrLocationPageCtrl", function($scope, $state, $ionicHistory, $ionicLoading, $stateParams, $cordovaProgress, $timeout, $cordovaToast) {
  var locationID = $stateParams.fbID;
  $scope.data = {};
  openFB.api({
      path: '/' + locationID,
      success: function(data) {
          $scope.data = data;
          console.log($scope.data);
          $scope.$apply();
      },

     error: function(err) {
       alert(err.message);
     }
   });

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  $scope.checkIn = function() {
    if (window.cordova) {
      $cordovaProgress.showBarWithLabel(true, 9000, "Verifying location, hang tight!");
      $timeout(function(){
        $state.go('locationview.map');
        $cordovaToast.show('You just planted a tree!', 'long', 'bottom');
      },1000);
    } else {
      $scope.loadingIndicator = $ionicLoading.show({
         template: 'Verifying your location',
         animation: 'fade-in',
         showBackdrop: true
       });

      openFB.api({
          path:  "/check-in",
          success: function(data) {
          console.log(data);
              // $scope.data = data;
              // $scope.$apply();
          },

         error: function(err) {
           console.log(err);
         }
       });


       
       $timeout(function(){
         $ionicLoading.hide();
         $state.go("locationview.map");
       },1000);
    }
  }
})

.controller("LocationViewCtrl", ["$scope", "$firebase", "$cordovaGeolocation", "$ionicLoading",
  function($scope, $firebase, $cordovaGeolocation, $ionicLoading, $state) {

    $scope.loadingContent = 'Showing Loading Indicator';

    $ionicLoading.show({
      showBackdrop: true,
      template: 'Getting current location...'
    });


    $scope.icon = '../img/arbr-map-marker.png';
    $scope.map = { 
      // Original SF location
      // center: { latitude: 37.7833, longitude: -122.4167 }, 
      zoom: 13,
      options: {disableDefaultUI: true}
    };

    if (window.cordova) {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude
          var long = position.coords.longitude
          $scope.map.center = {
            latitude: latLong.lat,
            longitude: latLong.lng
          }
          $scope.$apply();
          $ionicLoading.hide();
        }, function(err) {
          alert('Unable to get location: ' + err.message);
        });
    }

    navigator.geolocation.getCurrentPosition(function(pos) {
      latLong = { 'lat' : pos.coords.latitude,
                  'lng' : pos.coords.longitude 
                }
      $scope.map.center = {
        latitude: latLong.lat,
        longitude: latLong.lng
      }
      $scope.$apply();
      $ionicLoading.hide();
    });



    $scope.locationArray = [];

    $scope.arbrLocationPage = function(id) {
      $state.go('arbrLocation', { fbID: id });
    }

    $scope.events = {
      click: function(marker){
        console.log('rawr');
      }
    };

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
                                 'fbID': unformattedLocations[x].fbID,
                                 'latitude': unformattedLocations[x].pos[0],
                                 'longitude': unformattedLocations[x].pos[1]
                                };
        i++;
      }

      // Set our locationArray to the freshly formatted set of locations
      $scope.locationArray = formattedLocations;

    });

    $scope.userSettings = function() {
      $state.go("userProfile");
    }

    }
]);
