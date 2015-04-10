'use strict';
var PlayerCtrl = function ($scope, $sce, $routeParams, $factory, $rootScope) {
  var self = this,
    promise = $factory.getEpisodes();

  $scope.currentTime = 0;
  $scope.totalTime = 0;
  $scope.volume = 1;
  $scope.isCompleted = false;
  $scope.API = null;
  $scope.pictosReady = false;
  $scope.repereIsActive = false;
  $scope.currentAnimation = '';
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

    window.addEventListener('ON_PLAYER_READY', function () {

      $scope.initEpisodes($scope.episodes);

      $scope.totalTime = $rootScope.ytplayer.getDuration();
      $scope.injectPictos($scope.reperes);
      $('.play').trigger('click');
      //API.play();
    }, true);
  };

  $scope.onCompleteVideo = function () {
    $scope.isCompleted = true;
  };

  $scope.onUpdateTime = function (currentTime, totalTime) {
    $scope.currentTime = currentTime;
    $scope.totalTime = totalTime;
    if (currentTime >= totalTime - 1 && currentTime !== 0) {
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
        $('#ep6').trigger('click');
        break;
      case 'ep6':
        $('.navbar-brand').trigger('click');
        break;
      }

    }

    $scope.reperes.every(function (repere, index) {
      if (currentTime > repere.timecode && currentTime < repere.timecode + 7 && !$scope.repereIsActive) {
        $('.layer,.repere').fadeIn();
        $scope.currentTheme = repere.theme;
        $scope.currentAnimation = repere.anim;
        $scope.currentRepere = repere.src;
        $scope.repereIsActive = true;
        setTimeout(function () {
          if (!$scope.animationIsPlaying) {
            $scope.repereIsActive = false;
            $('.layer,.repere').fadeOut();
            $scope.currentRepere = '';
          }
        }, 7000);
        return false;
      } else {
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
    $scope.currentTime = $(evt.currentTarget).data('timecode');
    $rootScope.ytplayer.seekTo($scope.currentTime);
    $scope.API.play();
    $scope.currentTheme = $(evt.currentTarget).data('theme');
    $scope.currentRepere = $(evt.currentTarget).data('src');
    $('.layer').show();
    $('.repere').fadeIn();
  };

  $scope.showLayer = function (evt) {
    $scope.animationIsPlaying = true;
    $('#animation').prependTo('.layer').show();
    $('#animation').get(0).play()
    $('.repere').hide();
    angular.element('vg-buffering').addClass('hidden');
    angular.element('vg-controls').addClass('hidden');
    $scope.API.pause();
  }

  $scope.hideLayer = function (evt) {
    $scope.animationIsPlaying = false;
    $scope.repereIsActive = false;
    $scope.currentRepere = $scope.currentTheme = '';
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
  }).catch(function (err) {
    console.log(err)
  });

  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
    angular.element('header').removeClass('hidden');
  });
}
module.exports = PlayerCtrl;
