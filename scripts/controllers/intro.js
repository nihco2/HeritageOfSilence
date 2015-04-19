'use strict';
var IntroCtrl = function ($scope, $sce, $routeParams, $rootScope, $controls) {
  $scope.currentTime = 0;
  $scope.totalTime = 0;
  $scope.volume = 1;
  $scope.isCompleted = false;
  $scope.API = null;

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
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=hRc2Vv92jF4"),
      type: "video/youtube"
    }]
  }];

  $scope.config = {
    width: 740,
    height: 300,
    autoHide: true,
    autoHideTime: 4000,
    autoPlay: true,
    responsive: true,
    stretch: $scope.stretchModes[2],
    sources: $scope.videos[0].sources,
    transclude: true,
    theme: {
      url: "css/themes/default/videogular.css"
    }
  };

  $scope.onUpdateTime = function (currentTime, totalTime) {
    if (currentTime >= totalTime - 1) {
      $('#ep1').trigger('click');
    }
  }

  $scope.onPlayerReady = function (API) {
    console.log(window.location);
    $scope.API = API;
    $scope.API.setSize($scope.config.width, $scope.config.height);
    window.addEventListener('ON_PLAYER_READY', function () {
      $('.play').trigger('click');
    });
  };

  $scope.onCompleteVideo = function () {
    $scope.isCompleted = true;
  };

  $scope.onUpdateVolume = function (newVol) {
    $scope.volume = newVol;
  };

  $scope.onUpdateSize = function (width, height) {
    width = window.innerWidth;
    height = window.innerHeight - $('header').height();
    $scope.config.width = width;
    $scope.config.height = height;
  };



  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
    angular.element('header,.skip').removeClass('hidden');
    $('.skip').on('click', function () {
      $('#ep1').trigger('click');
    });
  });
}
module.exports = IntroCtrl;
