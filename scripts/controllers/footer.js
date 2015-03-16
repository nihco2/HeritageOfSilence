'use strict';
var FooterCtrl = function($scope, $factory) {
  var promise = $factory.getEpisodes();

  promise.then(function(data) {
    $scope.episodes = data.episodes;
  }).catch(function(err) {
    console.log(err)
  });
}
module.exports = FooterCtrl;
