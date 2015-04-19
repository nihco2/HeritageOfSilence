'use strict';
var RepereCtrl = function ($scope, $sce, $routeParams, $factory, $rootScope) {
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
      src: $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=zOYAbTfnPag"),
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
      if (episode.title === $routeParams.repere) {
        $scope.title = episode.title;
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
    $('.content').addClass('invisible');
    window.addEventListener('ON_PLAYER_READY', function () {
      $('.content').removeClass('invisible');
      $scope.initEpisodes($scope.reperes);
      $scope.totalTime = $rootScope.ytplayer.getDuration();
      $('.play').trigger('click');
    });
  };

  $scope.onUpdateTime = function (currentTime, totalTime) {
    $scope.currentTime = currentTime;
    $scope.totalTime = totalTime;

    if (currentTime >= totalTime - 1 && currentTime !== 0) {
      switch ($scope.title) {
      case 'la-grande-catastrophe':
        $('#les-restes-de-lepee').trigger('click');
        break;
      case 'les-restes-de-lepee':
        $('#les-infideles').trigger('click');
        break;
      case 'les-infideles':
        $('#les-faussaires').trigger('click');
        break;
      case 'les-faussaires':
        $('#des-ames-errantes').trigger('click');
        break;
      case 'des-ames-errantes':
        $('.navbar-brand').trigger('click');
        //$('#la-langues-assassinee').trigger('click');
        break;
      case 'la-langues-assassinee':
        $('.navbar-brand').trigger('click');
        break;
      }

    }
  }

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

  promise.then(function (data) {
    $scope.reperes = data.reperes;
  }).catch(function (err) {
    console.log(err)
  });

  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
    angular.element('header').removeClass('hidden');
    $('#nav-main').removeClass('expand');
  });
}
module.exports = RepereCtrl;
