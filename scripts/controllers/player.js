'use strict';
var PlayerCtrl = function ($scope, $sce, $routeParams, $factory, $controls) {
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
      src: $sce.trustAsResourceUrl("assets/videos/ep_1.mp4"),
      type: "video/mp4"
    }]
  }, {
    sources: [{
      src: $sce.trustAsResourceUrl("assets/videos/teaser.mp4"),
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
    stretch: $scope.stretchModes[1],
    sources: $scope.videos[0].sources,
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

  $scope.initEpisodes = function () {
    switch ($routeParams.episode) {
    case 'ep1':
      $scope.configEpisode(0);
      break;
    default:
      $scope.configEpisode(1);
      break;
    }
  };

  $scope.changeSource = function (index) {
    $scope.config.sources = $scope.videos[index].sources;
  };


  $scope.configEpisode = function (episode) {
    $scope.id = $scope.episodes[episode].id;
    $scope.totalTime = $scope.episodes[episode].duration;
    $scope.reperes = $scope.episodes[episode].reperes;
    $scope.changeSource(episode);
    $scope.injectPictos($scope.reperes);
  }

  $scope.onPlayerReady = function (API) {
    $scope.API = API;
    console.log(API);
    $scope.API.setSize($scope.config.width, $scope.config.height);
  };

  $scope.onCompleteVideo = function () {
    $scope.isCompleted = true;
  };

  $scope.onUpdateTime = function (currentTime, totalTime) {
    $scope.currentTime = currentTime;
    $scope.totalTime = totalTime;
    $scope.reperes.every(function (repere, index) {
      if (currentTime > repere.timecode && currentTime < repere.timecode + 7 && !$scope.repereIsActive) {
        $scope.currentTheme = repere.theme;
        $scope.currentAnimation = repere.anim;
        $scope.currentRepere = repere.src;
        $scope.repereIsActive = true;
        $('.repere').fadeIn();
        return false;
      } else if (currentTime < repere.timecode || currentTime > repere.timecode + 7) {
        if ($scope.repereIsActive && $scope.currentTheme != $scope.reperes[1].theme) {
          $('.repere').fadeOut();
          $scope.currentRepere = $scope.currentTheme = '';
          $scope.repereIsActive = false;
          return true;
        } else if ($scope.repereIsActive && $scope.currentTheme === $scope.reperes[1].theme && currentTime > $scope.reperes[1].timecode + 7) {
          $('.repere').fadeOut();
          $scope.currentRepere = $scope.currentTheme = '';
          $scope.repereIsActive = false;
          return true;
        }

        return true;
      }
    });
  };

  $scope.onUpdateVolume = function (newVol) {
    $scope.volume = newVol;
  };

  $scope.onUpdateSize = function (width, height) {
    $scope.config.width = width;
    $scope.config.height = height;
  };

  $scope.clickPicto = function (evt) {
    var video = document.getElementById($scope.id);
    video.currentTime = $(evt.currentTarget).data('timecode');
    $scope.API.play();
    $scope.currentTheme = $(evt.currentTarget).data('theme');
    $scope.currentRepere = $(evt.currentTarget).data('src');
    $('.repere').fadeIn();
    $('.layer').show();
  };

  $scope.showLayer = function (evt) {
    $scope.layerIsActive = !$scope.layerIsActive;
    $('#animation').prependTo('.layer').show();
    $('#animation').get(0).play()
    $('.repere').hide();
    angular.element('vg-buffering').addClass('hidden');
    angular.element('vg-controls').addClass('hidden');
    $scope.API.pause();
  }

  $scope.hideLayer = function (evt) {
    $scope.layerIsActive = !$scope.layerIsActive;
    $('#animation').prependTo('.layered').hide();
    $('#animation').get(0).pause();
    angular.element('vg-buffering').removeClass('hidden');
    angular.element('vg-controls').removeClass('hidden');
    $scope.API.play();
    $('.repere').show();
  }

  $scope.injectPictos = function (pictos) {
    $scope.pictosReady = true;
    pictos.forEach(function (aPicto) {
      var picto = new Image();
      var timecode = (aPicto.timecode / $scope.totalTime) * 80;
      picto.src = aPicto.url;
      $(picto).data('timecode', aPicto.timecode);
      angular.element('vg-scrubbar').append(picto);
      angular.element(picto)
        .addClass('picto')
        .css('left', timecode + '%')
        .data('timecode', aPicto.timecode)
        .data('theme', aPicto.theme)
        .data('src', aPicto.repere)
        .on('click', $scope.clickPicto);
    });
  }

  promise.then(function (data) {
    $scope.episodes = data.episodes;
    $scope.initEpisodes();
  }).catch(function (err) {
    console.log(err)
  });

  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
  });
}
module.exports = PlayerCtrl;
