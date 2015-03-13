'use strict';
var PlayerCtrl = function($scope, $sce, $controls) {
  $scope.currentTime = 0;
  $scope.totalTime = 0;
  $scope.state = null;
  $scope.volume = 1;
  $scope.isCompleted = false;
  $scope.API = null;
  $scope.pictosReady = false;
  $scope.showLayers = false;
  $scope.layersTime = 3;
  $scope.layerIsActive = false;

  $scope.showLayer = function(direction) {
    $scope.layerIsActive = !$scope.layerIsActive;
  }

  function showLayer(layer, opposite) {
    $scope.API.pause();
    angular.element('vg-buffering').addClass('hidden');
    angular.element('vg-controls').addClass('hidden');
  }

  function hideLayer(layer, opposite) {
    $scope.API.play();
    angular.element('vg-buffering').removeClass('hidden');
    angular.element('vg-controls').removeClass('hidden');
  }

  $scope.onPlayerReady = function(API) {
    $scope.API = API;
    console.log(API);
    $scope.API.setSize($scope.config.width, $scope.config.height);
  };

  $scope.onCompleteVideo = function() {
    $scope.isCompleted = true;
  };

  $scope.onUpdateState = function(state) {
    $scope.state = state;
  };

  $scope.onUpdateTime = function(currentTime, totalTime) {
    $scope.currentTime = currentTime;
    $scope.totalTime = totalTime;
    if (!$scope.pictosReady) {
      injectPictos($scope.pictos);
    }
    if (currentTime > $scope.layersTime && !$scope.showLayers) {
      $scope.showLayers = true;
      angular.element('.layer').addClass('animateLayers')
    }
  };

  $scope.onUpdateVolume = function(newVol) {
    $scope.volume = newVol;
  };

  $scope.onUpdateSize = function(width, height) {
    $scope.config.width = width;
    $scope.config.height = height;
  };

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

  $scope.config = {
    width: 740,
    height: 380,
    autoHide: true,
    autoHideTime: 1000,
    autoPlay: false,
    responsive: false,
    stretch: $scope.stretchModes[1],
    sources: [{
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=BKNxdipHcR8"),
      type: "video/youtube"
    }],
    transclude: true,
    theme: {
      url: "css/themes/default/videogular.css"
    },
    plugins: {
      poster: {
        url: "assets/images/poster.png"
      },
      memeAds: {
        vid: 'P9EzRfvqOF'
      }
    }
  };

  $scope.pictos = [{
    url: 'assets/images/Repere1.png',
    timecode: 30,
    theme: 'war'
  }, {
    url: 'assets/images/Repere2.png',
    timecode: 60,
    theme: 'war2'
  }]

  $scope.changeSource = function() {
    $scope.config.sources = [{
        src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=XslueHBNJYU"),
        type: "video/youtube"
      },
      //{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
    ];
  };

  $scope.clickPicto = function() {

  };

  function injectPictos(pictos) {
    $scope.pictosReady = true;
    pictos.forEach(function(aPicto) {
      var picto = new Image();
      var timecode = (aPicto.timecode / $scope.totalTime) * 100;
      picto.src = aPicto.url;
      angular.element('vg-scrubbar').append(picto);
      angular.element(picto)
        .addClass('picto')
        .css('left', timecode + '%')
        .data('theme', aPicto.theme)
        .on('click', $scope.clickPicto);
    });
  }
}
module.exports = PlayerCtrl;
