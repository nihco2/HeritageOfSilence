'use strict';
var RepereCtrl = function ($scope, $sce, $routeParams, $factory, $controls) {
  var self = this,
    promise = $factory.getEpisodes();

  $scope.currentTime = 0;
  $scope.totalTime = 0;
  $scope.volume = 1;
  $scope.isCompleted = false;
  $scope.API = null;
  $scope.pictosReady = false;
  $scope.layerIsActive = false;
  $scope.repereIsActive = false;
  $scope.currentAnimation = '';

  $scope.stretchModes = [{
    label: "None",
    value: "none"
  }, {
    label: "Fit",
    value: "fit"
  }, {
    label: "Fill",
    value: "fill"
  }];

  $scope.videos = [{
    sources: [{
      src: $sce.trustAsResourceUrl("assets/videos/rep_1.mp4"),
      type: "video/mp4"
    }]
  }];

  $scope.config = {
    width: 740,
    height: 300,
    autoHide: true,
    autoHideTime: 4000,
    autoPlay: true,
    responsive: true,
    stretch: $scope.stretchModes[0],
    sources: $scope.videos[0].sources,
    transclude: true,
    theme: {
      url: "css/themes/default/videogular.css"
    }
  };

  $scope.initReperes = function () {
    console.log($routeParams.repere);
    $scope.reperes.forEach(function (repere, index) {

      if (repere.title === $routeParams.repere) {
        console.log(index, $scope.videos[1])
        $scope.config.sources = [{
          src: $sce.trustAsResourceUrl(repere.src),
          type: "video/mp4"
        }]
      }
    })
  };

  $scope.onPlayerReady = function (API) {
    $scope.API = API;
    $scope.API.setSize($scope.config.width, $scope.config.height);
  };

  $scope.onCompleteVideo = function () {
    $scope.isCompleted = true;
  };

  $scope.onUpdateVolume = function (newVol) {
    $scope.volume = newVol;
  };

  $scope.onUpdateSize = function (width, height) {
    $scope.config.width = width;
    $scope.config.height = height;
  };

  promise.then(function (data) {
    $scope.reperes = data.reperes;
    $scope.initReperes();
  }).catch(function (err) {
    console.log(err)
  });

  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
  });
}
module.exports = RepereCtrl;
