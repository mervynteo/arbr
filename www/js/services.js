angular.module('arbr.services', [])
.factory('Post', function($resource) {
  return $resource('/api/places/:id');
});