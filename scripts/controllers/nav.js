'use strict';
var NavCtrl = function ($scope, $factory) {
  var promise = $factory.getEpisodes();

  promise.then(function (data) {
    $scope.episodes = data.episodes;
    $scope.reperes = data.reperes;
  }).catch(function (err) {
    console.log(err);
  });

  $scope.onMouseOver = function (evt) {
    console.log(evt);
    $(evt.currentTarget).find('img').toggleClass('hidden');
  }

  $scope.onMouseLeave = function (evt) {
    $(evt.currentTarget).find('img').toggleClass('hidden');
  }
}
module.exports = NavCtrl;
