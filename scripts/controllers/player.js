'use strict';
var PlayerCtrl = function ($scope, $sce, $routeParams, $factory, $rootScope) {
  var self = this,
    promise = $factory.getEpisodes();
  $scope.currentRepereVideo = '';
  $scope.currentTime = 0;
  $scope.currentTimeCode = 0;
  $scope.totalTime = 0;
  $scope.volume = 1;
  $scope.isCompleted = false;
  $scope.API = null;
  $scope.pictosReady = false;
  $scope.repereIsActive = false;
  $scope.currentAnimation = '';
  $scope.currentEpisode = '';
  $scope.currentEpisodeVideo = '';
  $scope.animationIsPlaying = false;
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
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=tm-lPipFtRc"),
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

  $scope.initEpisodes = function (episodes) {
    episodes.forEach(function (episode, index) {
      if (episode.id === $routeParams.episode) {
        $scope.id = episode.id;
        //save current episode TODO: set timecode after video change
        $scope.currentEpisode = episode.id;
        $scope.currentEpisodeVideo = episode.src;
        $scope.reperes = episode.reperes;
        $scope.config.sources = [{
          src: $sce.trustAsResourceUrl(episode.src),
          type: "video/youtube"
        }];
      }
    });
  };

  $scope.onPlayerReady = function (API) {
    $scope.API = API;
    $scope.API.setSize($scope.config.width, $scope.config.height);
    $('.close').hide();
    $('.content').addClass('invisible');
    window.addEventListener('ON_PLAYER_READY', function () {
      $('.content').removeClass('invisible');
      $scope.initEpisodes($scope.episodes);
      $scope.totalTime = $rootScope.ytplayer.getDuration();
      $scope.injectPictos($scope.reperes);
      $('.play').trigger('click');
      API.play();
    }, true);
  };

  $scope.onUpdateTime = function (currentTime, totalTime) {
    $scope.currentTime = currentTime;
    $scope.totalTime = totalTime;
    if (currentTime >= totalTime - 1 && currentTime !== 0 && !$scope.isCompleted) {
      switch ($scope.id) {
      case 'ep1':
        $('#ep2').trigger('click');
        break;
      case 'ep2':
        $('#ep3').trigger('click');
        break;
      case 'ep3':
        $('#ep4').trigger('click');
        break;
      case 'ep4':
        $('#ep5').trigger('click');
        break;
      case 'ep5':
        $('.navbar-brand').trigger('click');
        //$('#ep6').trigger('click');
        break;
      case 'ep6':
        $('.navbar-brand').trigger('click');
        break;
      default:
        $scope.isCompleted = true;
        $scope.hideLayer();
      }

    }

    if ($scope.reperes) {
      $scope.reperes.every(function (repere, index) {
        if (currentTime > repere.timecode && currentTime < repere.timecode + 7 && !$scope.repereIsActive && !repere.hasBeenPlayed) {
          repere.hasBeenPlayed = true;
          $('.layer,.repere').fadeIn();
          $scope.currentTheme = repere.theme;
          $scope.currentAnimation = repere.anim;
          $scope.currentRepereVideo = repere.video;
          $scope.currentRepere = repere.src;
          $scope.titleSrc = repere.titleSrc;
          $scope.repereIsActive = true;
          setTimeout(function () {
            if (!$scope.animationIsPlaying) {
              $scope.repereIsActive = false;
              $('.layer,.repere').fadeOut();
              $scope.currentRepere = '';
            }
          }, 9000);
          return false;
        } else {
          return true;
        }
      });
    }
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

  $scope.clickPicto = function (evt) {
    $scope.currentTimeCode = $(evt.currentTarget).data('timecode');
    $rootScope.ytplayer.seekTo($scope.currentTimeCode);
    $scope.API.play();
    $scope.currentTheme = $(evt.currentTarget).data('theme');
    $scope.currentRepere = $(evt.currentTarget).data('src');
    $('.layer').show();
    $('.repere').fadeIn();
  };

  $scope.showLayer = function (evt) {
    $scope.currentTimeCode = $rootScope.ytplayer.getCurrentTime();
    $scope.animationIsPlaying = true;
    $scope.isCompleted = false;
    $scope.config.sources = [{
      src: $sce.trustAsResourceUrl($scope.currentRepereVideo),
      type: "video/youtube"
    }];
    angular.element('.iconButton').addClass('invisible');
    $scope.id = $scope.currentTheme;
    $('.repere').hide();
    $('.close').show();
    angular.element('vg-buffering').addClass('hidden');
    angular.element('vg-controls').addClass('hidden');
    $scope.API.pause();
  }

  $scope.hideLayer = function (evt) {
    $scope.animationIsPlaying = false;
    $scope.repereIsActive = false;
    $scope.currentRepere = $scope.currentTheme = $scope.titleSrc = '';
    $scope.isCompleted = true;
    $scope.config.sources = [{
      src: $sce.trustAsResourceUrl($scope.currentEpisodeVideo),
      type: "video/youtube"
    }];
    //set current episode after set video source

    $scope.id = $scope.currentEpisode;
    $('.overlayPlayContainer .play').show();

    angular.element('vg-buffering').removeClass('hidden');
    angular.element('vg-controls').removeClass('hidden');
    //$scope.API.play();
    setTimeout(function () {
      $rootScope.ytplayer.seekTo($scope.currentTimeCode);
    }, 1000);

    $('.close').hide();
    $('.repere').show();
  }

  $scope.injectPictos = function (pictos) {
    $scope.pictosReady = true;
    pictos.forEach(function (aPicto) {
      var picto = new Image();
      var timecode = (aPicto.timecode / $scope.totalTime) * 70;
      if ($scope.id === 'ep5' || $scope.id === 'ep6') {
        timecode = (aPicto.timecode / $scope.totalTime) * 60;
      }
      if ($scope.id === 'ep1') {
        timecode = (aPicto.timecode / $scope.totalTime) * 90;
      }
      if ($scope.id === 'ep3') {
        timecode = (aPicto.timecode / $scope.totalTime) * 60;
      }
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
  }).catch(function (err) {
    console.log(err)
  });

  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
    angular.element('header').removeClass('hidden');
    $('#nav-main').removeClass('expand');
  });
}
module.exports = PlayerCtrl;
