// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('arbr', ['ionic', 'arbr.controllers', 'uiGmapgoogle-maps',"firebase", 'ngCordova'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      // StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  openFB.init({appId: '902539013111062'});

  // if none of the below states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');

  $stateProvider

  .state('splash', {
    url: "/splash",
    templateUrl: "templates/splash.html",
    controller: 'SplashCtrl'
  })

  .state('locationview', {
    url: "/locationview",
    abstract: true,
    templateUrl: "templates/locationview.html",
  }) 

  .state('locationview.map', {
    url: "/map",
    views: {
      'map-view' : {
        templateUrl: "templates/map.html",
        controller: 'LocationViewCtrl'
      }
    }
  })

  .state('locationview.list', {
    url: "/list",
    views: {
      'list-view' : {
        templateUrl: "templates/list.html",
        controller: 'LocationViewCtrl'
      }
    }
  })

  .state('arbrLocation', {
    url: "/arbrLocation/:fbID",
    templateUrl: "templates/arbrlocation.html",
    controller: "ArbrLocationPageCtrl"
  })

  .state('userProfile', {
      url: "/profile",
      templateUrl: "templates/userprofile.html",
      controller: "ProfileCtrl"
  })

  // .state('map', {
  //   url: "/map",
  //   templateUrl: "templates/map.html",
  //   controller: "MapCtrl"
  // });

});
