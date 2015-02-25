// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('arbr', ['ionic', 'arbr.controllers', 'arbr.services', 'ngCordova'])

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
    // abstract:true,
    templateUrl: "templates/splash.html",
    controller: 'SplashCtrl'
  })

  // .state('arbrLocations', {
  //   url: "/arbrLocations",
  //   abstract: true,
  //   template: "templates/arbrLocations.html",
  //   controller: "ArbrLocationCtrl"
  // })

  .state('userProfile', {
      url: "/profile",
      templateUrl: "templates/userprofile.html",
      controller: "ProfileCtrl"
  })

  .state('map', {
    url: "/map",
    templateUrl: "templates/map.html",
    controller: "MapCtrl"
  });

});
