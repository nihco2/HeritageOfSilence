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
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=tm-lPipFtRc"),
      type: "video/youtube"
    }]
  }, {
    sources: [{
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=0oZVKXpd1VQ"),
      type: "video/youtube"
    }]
  }, {
    sources: [{
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=0oZVKXpd1VQ"),
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

  $scope.changeSource = function (index) {
    $scope.config.sources = $scope.videos[index].sources;
  };


  $scope.configEpisode = function (episode) {
    console.log(episode);
    $scope.id = $scope.episodes[episode].id;
    $scope.reperes = $scope.episodes[episode].reperes;
  }

  $scope.onPlayerReady = function (API) {
    $scope.API = API;
    $scope.API.setSize($scope.config.width, $scope.config.height);
    window.addEventListener('ON_PLAYER_READY', function () {
      $scope.initEpisodes($scope.episodes);
      //$scope.config.sources = $scope.videos[1].sources;
      $scope.totalTime = $rootScope.ytplayer.getDuration();
      $scope.injectPictos($scope.reperes);
      $('.play').trigger('click');
      //API.play();
    });
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
    $rootScope.ytplayer.seekTo(video.currentTime);
    $scope.API.play();
    $scope.currentTheme = $(evt.currentTarget).data('theme');
    $scope.currentRepere = $(evt.currentTarget).data('src');
    $('.layer').show();
    $('.repere').fadeIn();
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
      var timecode = (aPicto.timecode / $scope.totalTime) * 60;
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
  });
}
module.exports = PlayerCtrl;
