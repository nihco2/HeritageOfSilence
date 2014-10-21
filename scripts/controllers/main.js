'use strict';
var MainCtrl = function ($scope, $sce) {
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

  $scope.showLayer = function (direction) {
    $scope.layerIsActive = !$scope.layerIsActive;
    if (direction === 'left') {
      if ($scope.layerIsActive) {
        angular.element('.layerLeft').addClass('translateLeftToRight');
        angular.element('.layerRight').hide();
      } else {
        angular.element('.layerLeft')
          .removeClass('translateLeftToRight')
          .addClass('hideLayerLeft')
        angular.element('.layerRight').show();
      }

    } else {
      if ($scope.layerIsActive) {
        angular.element('.layerRight').addClass('translateRightToLeft');
        angular.element('.layerLeft').hide();
      } else {
        angular.element('.layerRight')
          .removeClass('translateRightToLeft')
          .addClass('hideLayerRight');
        angular.element('.layerLeft').show();
      }
    }
  }

  $scope.layerOvered = function (direction) {
    $scope.API.pause();
    angular.element('.overlayPlayContainer').addClass('addPictoLayer');
    angular.element('.iconButton').addClass('hidden');
  }

  $scope.layerLeave = function (direction) {
    $scope.API.play();
    angular.element('.overlayPlayContainer').removeClass('addPictoLayer');
    //angular.element('.iconButton').show();
  }

  $scope.onPlayerReady = function (API) {
    $scope.API = API;
    console.log(API);
  };

  $scope.onCompleteVideo = function () {
    $scope.isCompleted = true;
  };

  $scope.onUpdateState = function (state) {
    $scope.state = state;
  };

  $scope.onUpdateTime = function (currentTime, totalTime) {
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

  $scope.onUpdateVolume = function (newVol) {
    $scope.volume = newVol;
  };

  $scope.onUpdateSize = function (width, height) {
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
        src: $sce.trustAsResourceUrl('assets/videos/teaser.mp4'),
        type: "video/mp4"
      }

      /*{
        src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=DgzBz3ibnBA"),
        type: "video/youtube"
      },*/
      //{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
      //{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
    ],
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
    timecode: 30
  }, {
    url: 'assets/images/Repere2.png',
    timecode: 60
  }]

  $scope.changeSource = function () {
    $scope.config.sources = [{
        src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=XslueHBNJYU"),
        type: "video/youtube"
      },
      //{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
    ];
  };

  function injectPictos(pictos) {
    $scope.pictosReady = true;
    pictos.forEach(function (aPicto) {
      var picto = new Image();
      var timecode = (aPicto.timecode / $scope.totalTime) * 100;
      picto.src = aPicto.url;
      angular.element('vg-scrubbar').append(picto);
      angular.element(picto).addClass('picto').css('left', timecode + '%');
    });
  }
}

module.exports = MainCtrl;
