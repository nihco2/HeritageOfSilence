'use strict';
var Factory = function ($http, $q) {
  var deferred = $q.defer();
  var data = $http.get('assets/assets.json').then(function (result) {
    deferred.resolve(result.data);
  }, function (result) {
    deferred.reject('Error loading JSON');
  });
  var factory = {
    getEpisodes: function () {
      return deferred.promise;
    }
  }
  return factory;

}
module.exports = Factory;
